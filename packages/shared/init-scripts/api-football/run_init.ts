import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
}

interface TableResult {
  tableName: string;
  action: 'created' | 'skipped' | 'recreated' | 'error';
  fingerprint?: string;
  error?: string;
}

function computeFingerprint(sql: string): string {
  // Normalize SQL: remove comments, extra whitespace, normalize to lowercase
  const normalized = sql
    .replace(/--[^\n]*/g, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .toLowerCase();
  
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function extractTableName(sql: string, filename: string): string {
  // Try to parse CREATE TABLE statement
  const match = sql.match(/CREATE\s+TABLE\s+(\w+)/i);
  if (match) {
    return match[1].toLowerCase();
  }
  
  // Fallback: extract from filename (e.g., "001_countries.sql" -> "countries")
  const fileMatch = filename.match(/\d+_(.+)\.sql$/);
  if (fileMatch) {
    return fileMatch[1].toLowerCase();
  }
  
  throw new Error(`Cannot extract table name from SQL or filename: ${filename}`);
}

function parseDatabaseUrl(url: string): { host: string; database: string } {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      database: parsed.pathname.slice(1), // Remove leading '/'
    };
  } catch (err) {
    throw new Error(`Invalid DATABASE_URL: ${url}`);
  }
}

function performSafetyCheck(databaseUrl: string, appEnv: string): SafetyCheckResult {
  const { host, database } = parseDatabaseUrl(databaseUrl);
  
  // Check 1: APP_ENV must be "local"
  if (appEnv !== 'local') {
    return {
      isSafe: false,
      reason: `APP_ENV is "${appEnv}" (must be "local" for drop+recreate operations)`,
    };
  }
  
  // Check 2: Host must be localhost/127.0.0.1/postgres
  const allowedHosts = ['localhost', '127.0.0.1', 'postgres'];
  if (!allowedHosts.includes(host)) {
    return {
      isSafe: false,
      reason: `Database host is "${host}" (must be one of: ${allowedHosts.join(', ')})`,
    };
  }
  
  // Check 3: Database name must NOT be production/staging
  const blockedDatabases = ['prod', 'production', 'stage', 'staging'];
  if (blockedDatabases.includes(database.toLowerCase())) {
    return {
      isSafe: false,
      reason: `Database name is "${database}" (blocked for safety)`,
    };
  }
  
  return { isSafe: true };
}

async function ensureMetadataSchema(client: Client): Promise<void> {
  await client.query(`
    CREATE SCHEMA IF NOT EXISTS oddins_schema;
  `);
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS oddins_schema.schema_fingerprints (
      table_name TEXT PRIMARY KEY,
      fingerprint TEXT NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function tableExists(client: Client, tableName: string): Promise<boolean> {
  const result = await client.query(
    `SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    );`,
    [tableName]
  );
  return result.rows[0].exists;
}

async function getStoredFingerprint(client: Client, tableName: string): Promise<string | null> {
  const result = await client.query(
    `SELECT fingerprint FROM oddins_schema.schema_fingerprints WHERE table_name = $1;`,
    [tableName]
  );
  return result.rows[0]?.fingerprint || null;
}

async function storeFingerprint(client: Client, tableName: string, fingerprint: string): Promise<void> {
  await client.query(
    `INSERT INTO oddins_schema.schema_fingerprints (table_name, fingerprint, last_updated)
     VALUES ($1, $2, NOW())
     ON CONFLICT (table_name) 
     DO UPDATE SET fingerprint = $2, last_updated = NOW();`,
    [tableName, fingerprint]
  );
}

async function processTableFile(
  client: Client,
  filePath: string,
  filename: string,
  safetyCheck: SafetyCheckResult
): Promise<TableResult> {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const tableName = extractTableName(sql, filename);
    const fingerprint = computeFingerprint(sql);
    
    const exists = await tableExists(client, tableName);
    
    if (!exists) {
      // Table doesn't exist - create it
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await storeFingerprint(client, tableName, fingerprint);
        await client.query('COMMIT');
        return { tableName, action: 'created', fingerprint };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    } else {
      // Table exists - check fingerprint
      const storedFingerprint = await getStoredFingerprint(client, tableName);
      
      if (storedFingerprint === fingerprint) {
        // No changes - skip
        return { tableName, action: 'skipped', fingerprint };
      } else {
        // Schema changed - drop and recreate
        if (!safetyCheck.isSafe) {
          throw new Error(
            `Cannot drop+recreate table "${tableName}": ${safetyCheck.reason}`
          );
        }
        
        await client.query('BEGIN');
        try {
          console.log(`  ⚠️  Dropping table "${tableName}" (schema changed)`);
          await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);
          await client.query(sql);
          await storeFingerprint(client, tableName, fingerprint);
          await client.query('COMMIT');
          return { tableName, action: 'recreated', fingerprint };
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        }
      }
    }
  } catch (err) {
    const error = err as Error;
    return {
      tableName: filename,
      action: 'error',
      error: error.message,
    };
  }
}

async function main() {
  console.log('🚀 Oddins Odds - Database Schema Initializer\n');
  
  // Read environment
  const databaseUrl = process.env.DATABASE_URL;
  const appEnv = process.env.APP_ENV || 'development';
  
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  console.log(`📊 APP_ENV: ${appEnv}`);
  console.log(`🔗 DATABASE_URL: ${databaseUrl}\n`);
  
  // Perform safety check
  const safetyCheck = performSafetyCheck(databaseUrl, appEnv);
  if (!safetyCheck.isSafe) {
    console.log(`⚠️  Safety Check: ${safetyCheck.reason}`);
    console.log(`   (Drop+recreate operations will be blocked)\n`);
  } else {
    console.log(`✅ Safety Check: Passed (drop+recreate enabled)\n`);
  }
  
  // Connect to database
  const client = new Client({ connectionString: databaseUrl });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    // Ensure metadata schema exists
    await ensureMetadataSchema(client);
    console.log('✅ Metadata schema ready\n');
    
    // Get all SQL files in order
    const tablesDir = path.join(__dirname, 'tables');
    const files = fs.readdirSync(tablesDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    console.log(`📁 Found ${files.length} table definition files\n`);
    
    // Process each file
    const results: TableResult[] = [];
    for (const file of files) {
      const filePath = path.join(tablesDir, file);
      console.log(`Processing: ${file}`);
      const result = await processTableFile(client, filePath, file, safetyCheck);
      results.push(result);
      
      if (result.action === 'created') {
        console.log(`  ✅ Created table: ${result.tableName}`);
      } else if (result.action === 'recreated') {
        console.log(`  ♻️  Recreated table: ${result.tableName}`);
      } else if (result.action === 'skipped') {
        console.log(`  ⏭️  Skipped (no changes): ${result.tableName}`);
      } else if (result.action === 'error') {
        console.log(`  ❌ ERROR: ${result.error}`);
      }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    
    const created = results.filter(r => r.action === 'created').length;
    const recreated = results.filter(r => r.action === 'recreated').length;
    const skipped = results.filter(r => r.action === 'skipped').length;
    const errors = results.filter(r => r.action === 'error').length;
    
    console.log(`✅ Created:   ${created}`);
    console.log(`♻️  Recreated: ${recreated}`);
    console.log(`⏭️  Skipped:   ${skipped}`);
    console.log(`❌ Errors:    ${errors}`);
    console.log('='.repeat(60));
    
    if (errors > 0) {
      console.log('\n❌ Initialization completed with errors');
      process.exit(1);
    } else {
      console.log('\n✅ Database initialization completed successfully!');
    }
    
  } catch (err) {
    const error = err as Error;
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();


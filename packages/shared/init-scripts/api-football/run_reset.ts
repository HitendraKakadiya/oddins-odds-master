import { Client } from 'pg';

interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
}

function parseDatabaseUrl(url: string): { host: string; database: string } {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      database: parsed.pathname.slice(1),
    };
  } catch (err) {
    throw new Error(`Invalid DATABASE_URL: ${url}`);
  }
}

function performSafetyCheck(databaseUrl: string, appEnv: string): SafetyCheckResult {
  const { host, database } = parseDatabaseUrl(databaseUrl);

  if (appEnv !== 'local') {
    return {
      isSafe: false,
      reason: `APP_ENV is "${appEnv}" (must be "local" for reset operations)`,
    };
  }

  const allowedHosts = ['localhost', '127.0.0.1', 'postgres'];
  if (!allowedHosts.includes(host)) {
    return {
      isSafe: false,
      reason: `Database host is "${host}" (must be one of: ${allowedHosts.join(', ')})`,
    };
  }

  const blockedDatabases = ['prod', 'production', 'stage', 'staging'];
  if (blockedDatabases.includes(database.toLowerCase())) {
    return {
      isSafe: false,
      reason: `Database name is "${database}" (blocked for safety)`,
    };
  }

  return { isSafe: true };
}

async function main() {
  console.log('🔥 OddinsOdds - Database Reset (DROP ALL TABLES)\n');
  console.log('⚠️  WARNING: This will DROP ALL tables in the public schema!\n');

  const databaseUrl = process.env.DATABASE_URL;
  const appEnv = process.env.APP_ENV || 'development';

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log(`📊 APP_ENV: ${appEnv}`);
  console.log(`🔗 DATABASE_URL: ${databaseUrl}\n`);

  const safetyCheck = performSafetyCheck(databaseUrl, appEnv);
  if (!safetyCheck.isSafe) {
    console.error(`❌ SAFETY CHECK FAILED: ${safetyCheck.reason}`);
    console.error('   Reset operation ABORTED for your safety.');
    process.exit(1);
  }

  console.log('✅ Safety Check: Passed\n');

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all tables in public schema
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    if (result.rows.length === 0) {
      console.log('ℹ️  No tables found in public schema');
      return;
    }

    console.log(`Found ${result.rows.length} tables to drop:\n`);
    result.rows.forEach(row => {
      console.log(`  - ${row.tablename}`);
    });

    console.log('\n🔥 Dropping all tables...\n');

    // Drop all tables with CASCADE
    await client.query('DROP SCHEMA IF EXISTS oddins_schema CASCADE;');
    await client.query('DROP SCHEMA public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    await client.query('GRANT ALL ON SCHEMA public TO PUBLIC;');

    console.log('✅ All tables dropped successfully\n');
    console.log('💡 Run "pnpm db:init" to recreate the schema\n');

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


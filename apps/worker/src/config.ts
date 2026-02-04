/**
 * Worker Configuration
 * Validates and exports environment variables
 */

interface Config {
  APP_ENV: string;
  DATABASE_URL: string;
  SPORTS_PROVIDER_API_KEY: string;
  API_FOOTBALL_BASE_URL: string;
}

function getConfig(): Config {
  const APP_ENV = process.env.APP_ENV || 'development';
  const SPORTS_PROVIDER_API_KEY = process.env.SPORTS_PROVIDER_API_KEY;
  const API_FOOTBALL_BASE_URL = process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io';

  // Support both DATABASE_URL (local) and individual components (production)
  let DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL && process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
    // Construct DATABASE_URL from components
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT || '5432';
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const dbname = process.env.DB_NAME || 'oddins_odds';
    DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${dbname}`;
  }

  // Validate required variables
  const missing: string[] = [];
  
  if (!DATABASE_URL) {
    missing.push('DATABASE_URL (or DB_HOST, DB_USER, DB_PASSWORD)');
  }
  
  if (!SPORTS_PROVIDER_API_KEY) {
    missing.push('SPORTS_PROVIDER_API_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
      `Please set them before running the worker:\n` +
      missing.map(v => `  export ${v}=<value>`).join('\n')
    );
  }

  return {
    APP_ENV,
    DATABASE_URL: DATABASE_URL!,
    SPORTS_PROVIDER_API_KEY: SPORTS_PROVIDER_API_KEY!,
    API_FOOTBALL_BASE_URL,
  };
}

export const config = getConfig();


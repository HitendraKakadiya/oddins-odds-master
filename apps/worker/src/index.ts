/**
 * Worker Entry Point
 * 
 * Orchestrates job execution based on command-line arguments.
 */

import { logger } from './logger';
import { syncLeaguesSeasons } from './jobs/syncLeaguesSeasons';
import { syncTeams } from './jobs/syncTeams';
import { syncFixtures } from './jobs/syncFixtures';
import { syncOdds } from './jobs/syncOdds';
import { syncPlayers } from './jobs/syncPlayers';
import { syncEvents } from './jobs/syncEvents';
import { syncLineups } from './jobs/syncLineups';
import { syncDailyFixtures, syncFixturesWindow } from './jobs/syncDailyFixtures';
import { syncPredictions } from './jobs/syncPredictions';
import { cleanupOldData } from './jobs/cleanup';
import { startScheduler } from './scheduler';

function printUsage() {
  console.log(`
Usage: node dist/index.js <command>

Available commands:
  sync:leagues    Sync leagues and seasons from API-Football
  sync:teams      Sync teams for featured leagues (24 months)
  sync:fixtures   Sync fixtures/matches for featured leagues (24 months)
  sync:daily      Sync fixtures for today only
  sync:window     Sync fixtures for past 10 days + future 14 days
  sync:odds       Sync betting odds for upcoming fixtures
  sync:predictions Sync match predictions for recent and upcoming matches
  sync:players    Sync player data for all teams
  sync:events     Sync match events (goals, cards, subs)
  sync:lineups    Sync match lineups (starting XI + subs)

Example:
  pnpm sync:leagues
  node dist/index.js sync:teams
  node dist/index.js sync:fixtures
  node dist/index.js sync:odds
  node dist/index.js sync:players
  node dist/index.js sync:events
  node dist/index.js sync:lineups
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const command = args[0];

  try {
    logger.info('Worker started', { command });

    switch (command) {
      case 'sync:leagues':
        await syncLeaguesSeasons();
        break;

      case 'sync:teams':
        await syncTeams();
        break;

      case 'sync:fixtures':
        await syncFixtures();
        break;

      case 'sync:odds':
        await syncOdds();
        break;

      case 'sync:players':
        await syncPlayers();
        break;

      case 'sync:events':
        await syncEvents();
        break;

      case 'sync:lineups':
        await syncLineups();
        break;

      case 'sync:predictions':
        await syncPredictions();
        break;

      case 'sync:daily':
        await syncDailyFixtures();
        break;

      case 'sync:window':
        await syncFixturesWindow(10, 14);
        break;

      case 'cleanup':
        await cleanupOldData();
        break;

      case 'scheduler':
        startScheduler();
        // Keep process alive for scheduler
        await new Promise(() => { });
        break;

      default:
        logger.error('Unknown command', null, { command });
        printUsage();
        process.exit(1);
    }
  } catch (error: unknown) {
    logger.error('Worker execution failed', error);
    process.exit(1);
  }
}

main();

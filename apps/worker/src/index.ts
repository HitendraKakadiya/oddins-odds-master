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

function printUsage() {
  console.log(`
Usage: node dist/index.js <command>

Available commands:
  sync:leagues    Sync leagues and seasons from API-Football
  sync:teams      Sync teams for featured leagues (24 months)
  sync:fixtures   Sync fixtures/matches for featured leagues (24 months)
  sync:odds       Sync betting odds for upcoming fixtures
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

      default:
        logger.error('Unknown command', null, { command });
        printUsage();
        process.exit(1);
    }
  } catch (error: any) {
    logger.error('Worker execution failed', error);
    process.exit(1);
  }
}

main();

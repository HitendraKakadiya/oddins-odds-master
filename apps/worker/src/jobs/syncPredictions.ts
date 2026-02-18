/**
 * Job: Sync Predictions from API-Football
 * 
 * Fetches match predictions for fixtures and stores them in match_predictions table.
 */

import { getPool } from '../db/pool';
import { logger } from '../logger';
import { apiFootballClient } from '../provider/apiFootballClient';
import { withLock } from '../orchestration/locks';
import {
    ensureProviderSource,
    updateSyncState,
    upsertPredictionModel,
    upsertMarket,
    upsertMatchPrediction
} from '../db/queries';
import { PoolClient } from 'pg';

interface PredictionResponse {
    predictions: {
        winner: {
            id: number;
            name: string;
            comment: string | null;
        };
        win_or_draw: boolean;
        under_over: string | null;
        goals: {
            home: string | null;
            away: string | null;
        };
        advice: string;
        percent: {
            home: string;
            draw: string;
            away: string;
        };
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
        season: number;
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
            last_5: {
                form: string;
                att: string;
                def: string;
                goals: {
                    for: { total: number; average: string };
                    against: { total: number; average: string };
                };
            };
            league: {
                form: string;
                fixtures: { played: number; wins: number; draws: number; loses: number };
                goals: { for: any; against: any };
            };
        };
        away: any;
    };
    comparison: any;
    h2h: any[];
}

interface PredictionAPIResponse {
    response: PredictionResponse[];
}

// Get recent fixture IDs (past 1 day to future 7 days)
async function getFixturesForPredictions(client: PoolClient): Promise<number[]> {
    const result = await client.query(
        `SELECT provider_fixture_id
     FROM matches
     WHERE kickoff_at > NOW() - INTERVAL '1 day'
       AND kickoff_at < NOW() + INTERVAL '7 days'
       AND status IN ('NS', 'TBD', '1H', 'HT', '2H')
     ORDER BY kickoff_at ASC
     LIMIT 500`,
        []
    );
    return result.rows.map((row: { provider_fixture_id: number }) => row.provider_fixture_id);
}

// Get match ID by provider_fixture_id
async function getMatchId(
    client: PoolClient,
    providerFixtureId: number
): Promise<number | null> {
    const result = await client.query(
        `SELECT id FROM matches WHERE provider_fixture_id = $1`,
        [providerFixtureId]
    );
    return result.rows.length > 0 ? result.rows[0].id : null;
}

export async function syncPredictions(): Promise<void> {
    const JOB_NAME = 'sync:predictions';
    const ENTITY_NAME = 'match_predictions';

    logger.setContext({ job: JOB_NAME });
    logger.info('Starting predictions sync job');

    const pool = getPool();
    const lockClient = await pool.connect();

    try {
        const result = await withLock(lockClient, JOB_NAME, async () => {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const sourceId = await ensureProviderSource(client);

                // Upsert the API-Football model
                const modelId = await upsertPredictionModel(
                    client,
                    'API-Football Predictions',
                    'v3',
                    'api-football',
                    true
                );

                // Pre-cache central markets
                const marketFT1X2 = await upsertMarket(client, 1, 'Match Winner', 'FT_1X2', false);
                const marketBTTS = await upsertMarket(client, 8, 'Both Teams Score', 'BTTS', false);
                const marketOU25 = await upsertMarket(client, 5, 'Goals Over/Under', 'OU_GOALS', true);

                let predictionsCount = 0;
                let fixturesProcessed = 0;
                let fixturesSkipped = 0;

                const fixtures = await getFixturesForPredictions(client);
                logger.info(`Found ${fixtures.length} fixtures to sync predictions for`);

                // Limit to 200 per run to stay within reasonable API usage
                const processLimit = Math.min(fixtures.length, 200);

                for (let i = 0; i < processLimit; i++) {
                    const providerFixtureId = fixtures[i];

                    try {
                        const rawResponse = await apiFootballClient.getPredictions({
                            fixture: providerFixtureId
                        }) as PredictionAPIResponse;

                        if (!rawResponse.response || rawResponse.response.length === 0) {
                            fixturesSkipped++;
                            continue;
                        }

                        const data = rawResponse.response[0];
                        const matchId = await getMatchId(client, providerFixtureId);

                        if (!matchId) {
                            fixturesSkipped++;
                            continue;
                        }

                        // 1. FT_1X2 Prediction
                        const homeProb = parseFloat((data.predictions.percent.home || '0%').replace('%', '')) / 100;
                        const drawProb = parseFloat((data.predictions.percent.draw || '0%').replace('%', '')) / 100;
                        const awayProb = parseFloat((data.predictions.percent.away || '0%').replace('%', '')) / 100;

                        let winnerSelection = 'Draw';
                        if (homeProb > drawProb && homeProb > awayProb) winnerSelection = 'Home';
                        else if (awayProb > homeProb && awayProb > drawProb) winnerSelection = 'Away';

                        await upsertMatchPrediction(
                            client,
                            matchId,
                            modelId,
                            marketFT1X2,
                            null,
                            winnerSelection,
                            {
                                percent: data.predictions.percent,
                                advice: data.predictions.advice,
                                winner: data.predictions.winner
                            },
                            Math.max(homeProb, drawProb, awayProb),
                            Math.floor(Math.max(homeProb, drawProb, awayProb) * 100)
                        );
                        predictionsCount++;

                        // 2. OU_GOALS (Usually 2.5 is the standard for under_over if available)
                        if (data.predictions.under_over) {
                            const isOver = data.predictions.under_over.includes('+');
                            const line = 2.5; // API-Football usually provides +/- 2.5 in advice and under_over string

                            await upsertMatchPrediction(
                                client,
                                matchId,
                                modelId,
                                marketOU25,
                                line,
                                isOver ? 'Over' : 'Under',
                                {
                                    raw: data.predictions.under_over,
                                    advice: data.predictions.advice
                                },
                                null,
                                null
                            );
                            predictionsCount++;
                        }

                        fixturesProcessed++;

                        // Wait 100ms between calls
                        await new Promise(resolve => setTimeout(resolve, 100));

                    } catch (err: any) {
                        logger.error(`Error syncing prediction for fixture ${providerFixtureId}`, err);
                        fixturesSkipped++;
                    }
                }

                await updateSyncState(client, sourceId, ENTITY_NAME, {
                    fixturesProcessed,
                    fixturesSkipped,
                    predictionsCount
                });

                await client.query('COMMIT');
                logger.info('Predictions sync job completed', { fixturesProcessed, predictionsCount });

                return { fixturesProcessed, predictionsCount };

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        });

        if (result === null) {
            logger.info('Job skipped - lock busy');
            process.exit(0);
        }
        process.exit(0);
    } catch (error) {
        logger.error('Predictions sync job failed', error);
        process.exit(1);
    } finally {
        lockClient.release();
    }
}

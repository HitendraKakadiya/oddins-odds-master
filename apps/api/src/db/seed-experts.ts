import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://oddins:oddins_dev@localhost:5433/oddins_odds';
const pool = new Pool({ connectionString: DATABASE_URL });

async function seedPredictionAnalysis() {
    const client = await pool.connect();
    try {
        // Find the latest match
        const matchRes = await client.query('SELECT id, home_team_id, away_team_id FROM matches ORDER BY kickoff_at DESC LIMIT 5');
        if (matchRes.rows.length === 0) {
            console.log('No matches found to seed predictions for.');
            return;
        }

        const matches = matchRes.rows;
        console.log(`Found ${matches.length} matches. Seeding specialist tips...`);

        for (const match of matches) {
            // Check if tip exists
            const tipCheck = await client.query('SELECT id FROM tips WHERE match_id = $1', [match.id]);

            const title = 'HT/FT - 2/2';
            const reason = 'We expect a strong start from the visitors. They have led at half-time in 4 of their last 5 away matches and given the hosts defensive struggles, a repeat performance is highly probable.';

            if (tipCheck.rows.length === 0) {
                await client.query(
                    'INSERT INTO tips (match_id, title, short_reason, is_premium, published_at, tip_rank) VALUES ($1, $2, $3, $4, NOW(), 1)',
                    [match.id, title, reason, true]
                );
                console.log(`Inserted premium tip for match ID ${match.id}`);
            } else {
                await client.query(
                    'UPDATE tips SET title = $2, short_reason = $3, is_premium = $4, published_at = NOW() WHERE match_id = $1',
                    [match.id, title, reason, true]
                );
                console.log(`Updated tip for match ID ${match.id}`);
            }
        }
    } catch (err) {
        console.error('Error seeding prediction analysis:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedPredictionAnalysis();

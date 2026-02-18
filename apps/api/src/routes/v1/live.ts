import { FastifyInstance } from 'fastify';
import { getPool } from '../../db/pool';

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function liveRoutes(server: FastifyInstance) {
    const pool = getPool();

    // GET /v1/live/matches
    server.get<{ Querystring: { date?: string; leagueId?: string; market?: string; minOdds?: string; maxOdds?: string; page?: string; pageSize?: string } }>('/live/matches', async (request) => {
        const { date, leagueId, market, minOdds, maxOdds, page = '1', pageSize = '20' } = request.query;
        let targetDate = date || new Date().toISOString().split('T')[0];

        const pageNum = Math.max(1, parseInt(page, 10));
        const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10)));
        const offset = (pageNum - 1) * pageSizeNum;

        // Map UI market to DB key
        const marketMap: Record<string, string> = {
            '1X2': 'FT_1X2',
            'Double Chance': 'DC',
            'Both Teams to Score': 'BTTS',
            'Over 2.5': 'OU_GOALS',
            'Under 2.5': 'OU_GOALS',
            'Over 1.5': 'OU_GOALS',
            'Correct Score': 'CS',
            'Over 9.5 Corners': 'OU_CORNERS',
            'Under 9.5 Corners': 'OU_CORNERS',
        };
        const dbMarketKey = market ? marketMap[market] : null;

        const client = await pool.connect();

        try {
            // Build filter clauses
            const filters = [];
            const params: any[] = [targetDate];
            let paramIdx = 2;

            filters.push(`m.kickoff_at >= $1::date AND m.kickoff_at < ($1::date + INTERVAL '1 day')`);

            if (leagueId) {
                filters.push(`l.provider_league_id = $${paramIdx++}`);
                params.push(leagueId);
            }

            if (dbMarketKey) {
                // For simplicity, we'll just check if there's a prediction for this market
                filters.push(`EXISTS (
                    SELECT 1 FROM match_predictions mp 
                    JOIN markets mk ON mp.market_id = mk.id 
                    WHERE mp.match_id = m.id AND mk.key = $${paramIdx++}
                )`);
                params.push(dbMarketKey);
            }

            if (minOdds) {
                const minOddsVal = parseFloat(minOdds);
                if (!isNaN(minOddsVal)) {
                    filters.push(`EXISTS (
                        SELECT 1 FROM odds_snapshots os
                        JOIN odds_snapshot_lines osl ON os.id = osl.snapshot_id
                        WHERE os.match_id = m.id 
                        AND osl.odd_value > $${paramIdx++}
                    )`);
                    params.push(minOddsVal);
                }
            }

            const filterClause = filters.join(' AND ');

            if (!date) {
                const checkQuery = `
                    SELECT EXISTS(
                        SELECT 1 FROM matches m 
                        JOIN leagues l ON m.league_id = l.id
                        WHERE ${filterClause}
                    ) as exists
                `;
                const checkResult = await client.query(checkQuery, params);
                const hasMatches = checkResult.rows[0].exists;

                if (!hasMatches) {
                    // ... simpler check for brevity
                }
            }

            const countQuery = `
                SELECT COUNT(*) FROM matches m 
                JOIN leagues l ON m.league_id = l.id
                WHERE ${filterClause}
            `;
            const countResult = await client.query(countQuery, params);
            const total = parseInt(countResult.rows[0].count, 10);

            // Fetch matches
            const matchesQuery = `
                SELECT 
                    m.provider_fixture_id as "matchId",
                    m.kickoff_at as "kickoffAt",
                    m.status,
                    m.elapsed,
                    m.home_goals as "homeScore",
                    m.away_goals as "awayScore",
                    l.provider_league_id as "leagueId",
                    l.name as "leagueName",
                    l.logo_url as "leagueLogo",
                    c.name as "countryName",
                    c.flag_url as "countryFlag",
                    ht.name as "homeTeamName",
                    ht.logo_url as "homeTeamLogo",
                    at.name as "awayTeamName",
                    at.logo_url as "awayTeamLogo"
                FROM matches m
                JOIN leagues l ON m.league_id = l.id
                JOIN countries c ON l.country_id = c.id
                JOIN teams ht ON m.home_team_id = ht.id
                JOIN teams at ON m.away_team_id = at.id
                WHERE ${filterClause}
                ORDER BY m.kickoff_at ASC
                LIMIT $${paramIdx++} OFFSET $${paramIdx++}
            `;

            params.push(pageSizeNum, offset);
            const matchesResult = await client.query(matchesQuery, params);

            const matches = matchesResult.rows.map(row => ({
                matchId: row.matchId,
                providerFixtureId: row.matchId,
                kickoffAt: row.kickoffAt,
                status: row.status,
                elapsed: row.elapsed,
                league: {
                    id: row.leagueId,
                    name: row.leagueName,
                    slug: slugify(row.leagueName),
                    logoUrl: row.leagueLogo,
                    country: {
                        name: row.countryName,
                        flagUrl: row.countryFlag
                    }
                },
                homeTeam: {
                    name: row.homeTeamName,
                    slug: slugify(row.homeTeamName),
                    logoUrl: row.homeTeamLogo
                },
                awayTeam: {
                    name: row.awayTeamName,
                    slug: slugify(row.awayTeamName),
                    logoUrl: row.awayTeamLogo
                },
                score: {
                    home: row.homeScore,
                    away: row.awayScore
                },
                featuredTip: null // Placeholder as per original
            }));

            return {
                date: targetDate,
                page: pageNum,
                pageSize: pageSizeNum,
                total,
                matches,
            };

        } finally {
            client.release();
        }
    });

    // GET /v1/live/leagues
    server.get<{ Querystring: { page?: string; pageSize?: string } }>('/live/leagues', async (request) => {
        const { page = '1', pageSize = '50' } = request.query;
        const pageNum = Math.max(1, parseInt(page, 10));
        const pageSizeNum = Math.min(200, Math.max(1, parseInt(pageSize, 10)));
        const offset = (pageNum - 1) * pageSizeNum;

        const client = await pool.connect();

        try {
            // Get unique countries with leagues
            // Logic: we want list of leagues grouped by country.
            // Original API logic: fetches /leagues and groups them.
            // SQL logic: Select all leagues joined with countries.

            // First count total leagues (or total groups? Original paginated by country groups)
            // The original logic paginated the *groups* of countries.
            // Let's verify original logic in Step 24:
            // "paginated = allGrouped.slice(offset)" -> Pagination is on Country Groups.

            // 1. Get unique countries with leagues, paginated
            const countriesQuery = `
                SELECT c.id, c.name, c.code, c.flag_url, COUNT(l.id) as league_count
                FROM countries c
                JOIN leagues l ON l.country_id = c.id
                GROUP BY c.id, c.name, c.code, c.flag_url
                ORDER BY c.name
                LIMIT $1 OFFSET $2
            `;

            const countQuery = `
                SELECT COUNT(DISTINCT c.id) 
                FROM countries c
                JOIN leagues l ON l.country_id = c.id
            `;

            const [countriesResult, countResult] = await Promise.all([
                client.query(countriesQuery, [pageSizeNum, offset]),
                client.query(countQuery)
            ]);

            const total = parseInt(countResult.rows[0].count, 10);
            const countries = countriesResult.rows;

            // 2. For each country, get its leagues
            // We can do this with a second query using ANY(country_ids)

            const countryIds = countries.map(c => c.id);
            let leaguesByCountry: Record<number, any[]> = {};

            if (countryIds.length > 0) {
                const leaguesQuery = `
                    SELECT l.id, l.country_id, l.provider_league_id, l.name, l.type, l.logo_url
                    FROM leagues l
                    WHERE l.country_id = ANY($1)
                    ORDER BY l.name
                `;
                const leaguesResult = await client.query(leaguesQuery, [countryIds]);

                for (const row of leaguesResult.rows) {
                    if (!leaguesByCountry[row.country_id]) {
                        leaguesByCountry[row.country_id] = [];
                    }
                    leaguesByCountry[row.country_id].push({
                        id: row.provider_league_id, // Use provider ID for frontend compatibility? Or internal ID? Frontend usually expects provider ID if it comes from API-Football. 
                        // Original `item.league.id` is provider ID.
                        name: row.name,
                        slug: slugify(row.name),
                        logoUrl: row.logo_url,
                        type: row.type
                    });
                }
            }

            // Assemble response
            const items = countries.map(country => ({
                country: {
                    name: country.name,
                    code: country.code,
                    flagUrl: country.flag_url
                },
                leagues: leaguesByCountry[country.id] || []
            }));

            return {
                page: pageNum,
                pageSize: pageSizeNum,
                total,
                items,
            };

        } finally {
            client.release();
        }
    });
}

import { FastifyInstance } from 'fastify';
import { query } from '../../db';
import {
  getTeamBySlugDirect,
  getTeamMatchesDirect,
  getTeamStatsDirect,
  getLeaguesDirect,
  getLeagueStandingsDirect,
  getTeamSquadDirect,
  getTeamsByLeagueDirect,
  getPopularTeamsDirect
} from '../../lib/sports';

interface TeamsQuery {
  query?: string;
  leagueSlug?: string;
  leagueId?: string;
}

interface TeamParams {
  teamSlug: string;
}

interface TeamTabParams {
  teamSlug: string;
  tab: string;
}

export async function teamsRoutes(server: FastifyInstance) {
  // GET /v1/teams/featured
  server.get('/teams/featured', async () => {
    // const popularIds = [529, 40, 541, 33, 157, 496, 85, 212, 42]; // Top clubs
    // return getPopularTeamsDirect(popularIds);

    // Fetch from local database instead of third-party API
    const popularIds = [529, 40, 541, 33, 157, 496, 85, 212, 42];
    const result = await query(
      `SELECT 
        t.provider_team_id as id,
        t.name,
        t.slug,
        t.logo_url as "logoUrl",
        c.name as country
      FROM teams t
      JOIN countries c ON t.country_id = c.id
      WHERE t.provider_team_id = ANY($1::int[])`,
      [popularIds] as any
    );

    return result.rows;
  });

  // GET /v1/teams
  server.get<{ Querystring: TeamsQuery }>('/teams', async (request) => {
    const { query: searchQuery, leagueSlug, leagueId } = request.query;

    if (leagueId) {
      // return getTeamsByLeagueDirect(parseInt(leagueId), new Date().getFullYear());

      // Fetch from local database instead of third-party API
      const result = await query(
        `SELECT DISTINCT
          t.provider_team_id as id,
          t.name,
          t.slug,
          t.logo_url as "logoUrl",
          c.name as country
        FROM teams t
        JOIN countries c ON t.country_id = c.id
        JOIN season_teams st ON t.id = st.team_id
        JOIN seasons s ON st.season_id = s.id
        JOIN leagues l ON s.league_id = l.id
        WHERE l.provider_league_id = $1
        ORDER BY t.name`,
        [parseInt(leagueId)]
      );

      return result.rows;
    }

    const conditions: string[] = [];
    const params: (string)[] = [];
    let paramIndex = 1;

    if (searchQuery) {
      conditions.push(`t.name ILIKE $${paramIndex++}`);
      params.push(`%${searchQuery}%`);
    }

    if (leagueSlug) {
      conditions.push(`l.slug = $${paramIndex++}`);
      params.push(leagueSlug);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT DISTINCT
        t.provider_team_id as id,
        t.name,
        t.slug,
        t.logo_url as "logoUrl",
        c.name as country
      FROM teams t
      JOIN countries c ON t.country_id = c.id
      ${leagueSlug ? 'JOIN season_teams st ON t.id = st.team_id JOIN seasons s ON st.season_id = s.id JOIN leagues l ON s.league_id = l.id' : ''}
      ${whereClause}
      ORDER BY t.name
      LIMIT 50`,
      params
    );

    return result.rows;
  });

  // GET /v1/team/:teamSlug
  server.get<{ Params: TeamParams }>('/team/:teamSlug', async (request, reply) => {
    const { teamSlug } = request.params;

    try {
      // 1. Resolve Team ID via Local Database instead of Live Search
      // const liveTeam = await getTeamBySlugDirect(teamSlug);
      const teamResult = await query(
        `SELECT 
          t.provider_team_id as id,
          t.name,
          t.slug,
          t.logo_url as logo,
          c.name as country,
          v.name as venue_name,
          v.city as venue_city
        FROM teams t
        JOIN countries c ON t.country_id = c.id
        LEFT JOIN venues v ON t.venue_id = v.id
        WHERE t.slug = $1`,
        [teamSlug]
      );

      const liveTeam = teamResult.rows[0];

      if (!liveTeam) {
        return reply.status(404).send({ error: 'Team not found' });
      }

      // 2. Fetch Matches in parallel (Commented out third-party API)
      /*
      const [nextMatches, recentMatches] = await Promise.all([
        getTeamMatchesDirect(liveTeam.id, 'next', 5).catch(() => []),
        getTeamMatchesDirect(liveTeam.id, 'last', 10).catch(() => [])
      ]);
      */
      const nextMatches: any[] = [];
      const recentMatches: any[] = [];

      // 3. Try to get stats from most frequent league in recent matches
      let statsSummary = {
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
        cleanSheets: 0
      };

      /*
      try {
        // Find most common league ID from recent matches
        const leagueCounts = new Map<number, number>();
        recentMatches.forEach((m: any) => {
          if (m.league?.id) {
            leagueCounts.set(m.league.id, (leagueCounts.get(m.league.id) || 0) + 1);
          }
        });

        const statsLeagueId = liveTeam.leagueId || [...leagueCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 39;

        if (statsLeagueId) {
          const stats = await getTeamStatsDirect(liveTeam.id, statsLeagueId, new Date().getFullYear());
          if (stats && stats.fixtures) {
            statsSummary = {
              wins: stats.fixtures.wins?.total || 0,
              draws: stats.fixtures.draws?.total || 0,
              losses: stats.fixtures.loses?.total || 0,
              goalsScored: stats.goals?.for?.total?.total || 0,
              goalsConceded: stats.goals?.against?.total?.total || 0,
              cleanSheets: stats.clean_sheet?.total || 0
            };
          }
        }
      } catch (err) {
        console.warn('Failed to fetch live team stats:', (err as any).message);
      }
      */

      // 4. Fetch Standings and Squad (Commented out third-party API)
      // const commonLeagueId = liveTeam.leagueId || (recentMatches[0]?.league?.id) || 39;

      /*
      const [standings, squad] = await Promise.all([
        getLeagueStandingsDirect(commonLeagueId, new Date().getFullYear()),
        getTeamSquadDirect(liveTeam.id)
      ]);
      */
      const standings: any[] = [];
      const squad: any[] = [];

      return {
        team: {
          id: liveTeam.id,
          name: liveTeam.name,
          slug: teamSlug,
          logoUrl: liveTeam.logo,
          country: liveTeam.country,
          venue: liveTeam.venue_name || 'Unknown Stadium',
          city: liveTeam.venue_city || 'Unknown City',
        },
        competitions: [], // liveTeam.leagues || [],
        nextMatch: nextMatches[0] || null,
        recentMatches,
        statsSummary,
        standings,
        squad
      };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Internal server error fetching team details' });
    }
  });

  // GET /v1/team/:teamSlug/:tab
  server.get<{ Params: TeamTabParams }>('/team/:teamSlug/:tab', async (request, reply) => {
    const { teamSlug, tab } = request.params;

    try {
      // Resolve team from database
      const teamResult = await query(
        `SELECT 
          t.provider_team_id as id,
          t.name,
          t.slug,
          t.logo_url as logo
        FROM teams t
        WHERE t.slug = $1`,
        [teamSlug]
      );

      const liveTeam = teamResult.rows[0];

      // const liveTeam = await getTeamBySlugDirect(teamSlug);
      if (!liveTeam) {
        return reply.status(404).send({ error: 'Team not found' });
      }

      let items: any[] = [];

      /*
      switch (tab) {
        case 'fixtures':
          items = await getTeamMatchesDirect(liveTeam.id, 'next', 20);
          break;
        case 'results':
          items = await getTeamMatchesDirect(liveTeam.id, 'last', 20);
          break;
        case 'stats':
        case 'corners':
        case 'cards': {
          // Fetch last 20 matches for detailed stats breakdown
          items = await getTeamMatchesDirect(liveTeam.id, 'last', 20);
          break;
        }
        case 'squads':
          items = await getTeamSquadDirect(liveTeam.id);
          break;
        default:
          items = [];
      }
      */

      return {
        team: {
          id: liveTeam.id,
          name: liveTeam.name,
          slug: teamSlug,
          logoUrl: liveTeam.logo,
        },
        tab,
        items,
      };
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Internal server error fetching team tab data' });
    }
  });
}


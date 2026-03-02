import { FastifyInstance } from 'fastify';
import { query } from '../../db';
import {
  getTeamBySlugDirect,
  getTeamMatchesDirect,
  getTeamStatsDirect,
  getLeaguesDirect,
  getLeagueStandingsDirect,
  getTeamSquadDirect
} from '../../lib/sports';

interface TeamsQuery {
  query?: string;
  leagueSlug?: string;
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
    const result = await query(
      `SELECT 
        t.id,
        t.name,
        t.slug,
        t.logo_url as "logoUrl",
        c.name as "countryName"
      FROM teams t
      JOIN countries c ON t.country_id = c.id
      ORDER BY t.id ASC
      LIMIT 6`
    );

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logo: row.logoUrl || '⚽',
      country: row.countryName
    }));
  });

  // GET /v1/teams
  server.get<{ Querystring: TeamsQuery }>('/teams', async (request) => {
    const { query: searchQuery, leagueSlug } = request.query;

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
        t.id,
        t.name,
        t.slug,
        t.logo_url
      FROM teams t
      ${leagueSlug ? 'JOIN season_teams st ON t.id = st.team_id JOIN seasons s ON st.season_id = s.id JOIN leagues l ON s.league_id = l.id' : ''}
      ${whereClause}
      ORDER BY t.name
      LIMIT 50`,
      params
    );

    return result.rows.map((row: { id: number; name: string; slug: string; logo_url: string | null }) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      logoUrl: row.logo_url,
    }));
  });

  // GET /v1/team/:teamSlug
  server.get<{ Params: TeamParams }>('/team/:teamSlug', async (request, reply) => {
    const { teamSlug } = request.params;

    try {
      // 1. Resolve Team ID via Live Search
      const liveTeam = await getTeamBySlugDirect(teamSlug);
      if (!liveTeam) {
        return reply.status(404).send({ error: 'Team not found via live provider' });
      }

      // 2. Fetch Matches in parallel
      const [nextMatches, recentMatches] = await Promise.all([
        getTeamMatchesDirect(liveTeam.id, 'next', 1).catch(() => []),
        getTeamMatchesDirect(liveTeam.id, 'last', 5).catch(() => [])
      ]);

      // 3. Try to get stats from most frequent league in recent matches
      let statsSummary = {
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
        cleanSheets: 0
      };

      try {
        const statsLeagueId = liveTeam.leagueId || (recentMatches?.length > 0 ?
          recentMatches.map((m: any) => m.league?.id).filter(Boolean).sort((a: any, b: any) =>
            recentMatches.filter((v: any) => v.league?.id === a).length - recentMatches.filter((v: any) => v.league?.id === b).length
          ).pop() : 39);

        if (statsLeagueId) {
          const liveStats = await getTeamStatsDirect(liveTeam.id, statsLeagueId, new Date().getFullYear());
          const stats = Array.isArray(liveStats) ? liveStats[0] : liveStats;
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

      // 4. Fetch Standings and Squad
      const commonLeagueId = liveTeam.leagueId || (recentMatches[0]?.league?.id) || 39;

      const [standings, squad] = await Promise.all([
        getLeagueStandingsDirect(commonLeagueId || 39, new Date().getFullYear()),
        getTeamSquadDirect(liveTeam.id)
      ]);

      return {
        team: {
          id: liveTeam.id,
          name: liveTeam.name,
          slug: teamSlug,
          logoUrl: liveTeam.logo,
          country: liveTeam.country,
          venue: liveTeam.venue?.name || 'Unknown Stadium',
          city: liveTeam.venue?.city || 'Unknown City',
        },
        competitions: liveTeam.leagues || [
          { name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' }
        ],
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
      // 1. Resolve Team ID
      const liveTeam = await getTeamBySlugDirect(teamSlug);
      if (!liveTeam) {
        return reply.status(404).send({ error: 'Team not found' });
      }

      let items: any[] = [];

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
          // For live API, we might just return the overall stats for now as historical per-match stats 
          // require iterating over fixtures which is heavy. 
          // We'll return the summary stats formatted for the table.
          const recent = await getTeamMatchesDirect(liveTeam.id, 'last', 10);
          items = recent.map((m: any) => ({
            kickoffAt: m.kickoffAt,
            homeTeamName: m.homeTeam.name,
            awayTeamName: m.awayTeam.name,
            leagueName: m.league.name,
            stats: {
              score: `${m.score.home}-${m.score.away}`,
              status: m.status
            }
          }));
          break;
        }
        default:
          items = [];
      }

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


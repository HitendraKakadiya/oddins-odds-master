import { FastifyInstance } from 'fastify';
import {
  getTeamBySlugDirect,
  getTeamByIdDirect,
  getTeamMatchesDirect,
  getTeamStatsDirect,
  getLeaguesDirect,
  getLeagueStandingsDirect,
  getTeamSquadDirect,
  getTeamsByLeagueDirect,
  getPopularTeamsDirect
} from '../../lib/sports';
import { FEATURED_LEAGUES } from '../../config/leagues';

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
    // Strategy: Fetch top leagues dynamically and get their first couple of teams
    const allLeagues = await getLeaguesDirect() || [];
    const topCountries = ['England', 'Spain', 'Germany', 'Italy', 'France'];

    const topLeagues = allLeagues.filter((item: any) => {
      const isCurrent = item.seasons.some((s: any) => s.current === true);
      const isTop5 = topCountries.includes(item.country.name);
      return isCurrent && isTop5 && item.league.type === 'League';
    }).slice(0, 5);

    const leagueIds = topLeagues.map(l => l.league.id);

    const teamsPromises = leagueIds.map(id => getTeamsByLeagueDirect(id));
    const teamsResults = await Promise.all(teamsPromises);

    // Take first 3-4 teams from each major league
    const featuredTeams = teamsResults.flatMap(teams => teams.slice(0, 4));

    return featuredTeams.slice(0, 15);
  });

  // GET /v1/teams
  server.get<{ Querystring: TeamsQuery }>('/teams', async (request) => {
    const { query: searchQuery, leagueId } = request.query;

    if (leagueId) {
      return getTeamsByLeagueDirect(parseInt(leagueId));
    }

    if (searchQuery) {
      const data = await getTeamBySlugDirect(searchQuery);
      return data ? [data] : [];
    }

    // Default to some popular teams if no ID
    const popularLeagues = await server.inject({ method: 'GET', url: '/v1/leagues/popular' });
    const leaguesData = popularLeagues.json();
    const firstLeagueId = leaguesData[0]?.id || 39;

    return await getTeamsByLeagueDirect(firstLeagueId, new Date().getFullYear());
  });

  // GET /v1/team/:teamSlug
  server.get<{ Params: TeamParams }>('/team/:teamSlug', async (request, reply) => {
    const { teamSlug } = request.params;

    try {
      // 1. Resolve Team (ID-in-slug support for 100% reliability)
      let liveTeam = null;
      const idMatch = teamSlug.match(/^(\d+)-/);

      if (idMatch) {
        const teamId = parseInt(idMatch[1], 10);
        liveTeam = await getTeamByIdDirect(teamId);
      }

      // Fallback to fuzzy slug search if no ID or ID lookup failed
      if (!liveTeam) {
        liveTeam = await getTeamBySlugDirect(teamSlug);
      }

      if (!liveTeam) {
        return reply.status(404).send({ error: 'Team not found' });
      }

      // 2. Fetch Matches in parallel
      const [nextMatches, recentMatches] = await Promise.all([
        getTeamMatchesDirect(liveTeam.id, 'next', 5).catch(() => []),
        getTeamMatchesDirect(liveTeam.id, 'last', 10).catch(() => [])
      ]);

      // 3. Try to get stats from most frequent league in recent matches or default to 39 (Premier League)
      let statsSummary = {
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
        cleanSheets: 0
      };

      try {
        const leagueCounts = new Map<number, number>();
        recentMatches.forEach((m: any) => {
          if (m.league?.id) {
            leagueCounts.set(m.league.id, (leagueCounts.get(m.league.id) || 0) + 1);
          }
        });

        const statsLeagueId = [...leagueCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 39;

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

      // 4. Fetch Standings and Squad
      const commonLeagueId = (recentMatches[0]?.league?.id) || 39;

      const [standings, squad] = await Promise.all([
        getLeagueStandingsDirect(commonLeagueId, new Date().getFullYear() - 1), // Standard fallback for standings
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
        competitions: [],
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
          items = await getTeamMatchesDirect(liveTeam.id, 'last', 20);
          break;
        }
        case 'squads':
        case 'squad':
          items = await getTeamSquadDirect(liveTeam.id);
          break;
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


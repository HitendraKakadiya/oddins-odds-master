import { FastifyInstance } from 'fastify';
import { getTeamBySlugDirect, getLeaguesBySearchDirect } from '../../lib/sports';

interface SearchQuery {
  q: string;
}

export async function searchRoutes(server: FastifyInstance) {
  server.get<{ Querystring: SearchQuery }>('/search', async (request, reply) => {
    const { q } = request.query;

    if (!q || q.trim().length === 0) {
      return reply.status(400).send({ error: 'Query parameter "q" is required' });
    }

    const searchTerm = q.trim();

    // 1. Search Live Leagues
    const liveLeagues = await getLeaguesBySearchDirect(searchTerm);
    const leagues = liveLeagues.map((item: any) => ({
      id: item.league.id,
      name: item.league.name,
      slug: item.league.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      logoUrl: item.league.logo,
      country: {
        name: item.country.name,
        code: item.country.code,
        flagUrl: item.country.flag
      }
    }));

    // 2. Search Live Teams
    // Using a simple search approach - API-Football /teams?search=...
    const liveTeams = await getTeamBySlugDirect(searchTerm);
    // getTeamBySlugDirect already does a live search. If it returns 1 team, we wrap it.
    // If it returns null, we should probably try a more broad search if possible.
    const teams = liveTeams ? [{
      id: liveTeams.id,
      name: liveTeams.name,
      slug: liveTeams.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      logoUrl: liveTeams.logo,
      country: liveTeams.country
    }] : [];

    // 3. Matches and Articles remain empty or simplified as they require local persistence/caching usually
    // or we'd need another live call which might be slow. The user specifically asked for "team page" data.
    const matches: any[] = [];
    const articles: any[] = [];

    return {
      q: searchTerm,
      leagues,
      teams,
      matches,
      articles,
    };
  });
}


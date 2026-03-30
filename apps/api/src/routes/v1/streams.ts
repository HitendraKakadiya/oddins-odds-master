import { FastifyInstance } from 'fastify';
import { getLiveMatchesDirect } from '../../lib/sports';

export async function streamsRoutes(server: FastifyInstance) {
  server.get<{ Querystring: { region?: string; date?: string; page?: string; pageSize?: string; search?: string; sort?: string } }>('/streams', async (request) => {
    const { region, date, page = '1', pageSize = '20', search, sort } = request.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;

    const allMatches = await getLiveMatchesDirect(targetDate).catch(() => []);

    let filteredMatches = allMatches;
    if (region) {
      filteredMatches = allMatches.filter(m =>
        m.league.country.name.toLowerCase().includes(region.toLowerCase())
      );
    }

    if (search) {
      const s = search.toLowerCase();
      filteredMatches = filteredMatches.filter(m =>
        m.league.name.toLowerCase().includes(s) ||
        m.homeTeam.name.toLowerCase().includes(s) ||
        m.awayTeam.name.toLowerCase().includes(s)
      );
    }

    if (sort) {
       if (sort === 'important') {
          // Sort by top-tier league IDs
          const topLeagues = [2, 3, 39, 140, 61, 78, 135, 1]; // UCL, UEL, EPL, La Liga, Ligue 1, Bundesliga, Serie A, WC
          filteredMatches.sort((a, b) => {
             const aIsTop = topLeagues.includes(a.league.id) ? 0 : 1;
             const bIsTop = topLeagues.includes(b.league.id) ? 0 : 1;
             if (aIsTop !== bIsTop) return aIsTop - bIsTop;
             return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
          });
       } else if (sort === 'favourite') {
          // Sort by a mock "popularity" metric (e.g. higher matchId or just reverse alphabetical by team name for visual change)
          filteredMatches.sort((a, b) => {
             // Mocking popularity by using matchId modulo 100
             const aPop = (a.matchId % 100);
             const bPop = (b.matchId % 100);
             if (aPop !== bPop) return bPop - aPop;
             return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
          });
       } else if (sort === 'time') {
          filteredMatches.sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime());
       }
    }

    // 3. Paginate
    const total = filteredMatches.length;
    const pagedMatches = filteredMatches.slice(offset, offset + pageSizeNum);

    const items = pagedMatches.map((m) => ({
      league: {
        id: m.league.id,
        name: m.league.name,
        slug: m.league.slug,
        logoUrl: m.league.logoUrl,
      },
      matchId: m.matchId,
      kickoffAt: m.kickoffAt,
      homeTeam: {
        name: m.homeTeam.name,
        slug: m.homeTeam.name.toLowerCase().replace(/\s+/g, '-'),
        logoUrl: m.homeTeam.logoUrl,
      },
      awayTeam: {
        name: m.awayTeam.name,
        slug: m.awayTeam.name.toLowerCase().replace(/\s+/g, '-'),
        logoUrl: m.awayTeam.logoUrl,
      },
      status: m.status,
      elapsed: m.elapsed,
      score: m.score,
      payload: {} as Record<string, unknown>,
      whereToWatch: [
        { name: 'Sky Sports', url: 'https://www.skysports.com' },
        { name: 'BT Sport', url: 'https://www.bt.com/sport' },
      ],
    }));

    return {
      date: targetDate,
      region,
      page: pageNum,
      pageSize: pageSizeNum,
      total,
      items,
    };
  });
}



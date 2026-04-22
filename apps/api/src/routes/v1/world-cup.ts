import { FastifyInstance } from 'fastify';
import { getLeagueStandingsDirect, fetchFromSportsProvider } from '../../lib/sports';
import { ApiProviderResponse, ApiFixtureResponse } from '../../lib/provider-types';

export async function worldCupRoutes(server: FastifyInstance) {
  server.get('/world-cup', async (request) => {
    const leagueId = 1; // FIFA World Cup
    let season = 2026;

    try {
      // Try fetching 2026 standings
      let standings: any[] = await getLeagueStandingsDirect(leagueId, season).catch(() => []);

      // Fallback to 2022 if 2026 is empty (to show proper tournament structure)
      if (!standings || standings.length === 0) {
        season = 2022;
        standings = await getLeagueStandingsDirect(leagueId, season).catch(() => []);
      }

      // Fetch all fixtures for the selected season
      const fixturesData: ApiProviderResponse<ApiFixtureResponse> = await fetchFromSportsProvider(
        `/fixtures?league=${leagueId}&season=${season}`
      );

      let fixtures = fixturesData.response || [];

      // Group standings by group name
      const groupsMap: Record<string, any> = {};
      standings.forEach((row: any) => {
        const groupName = row.group || 'Tournament';
        if (!groupsMap[groupName]) {
          groupsMap[groupName] = {
            name: groupName,
            teams: [],
            standings: [],
            fixtures: []
          };
        }
        groupsMap[groupName].teams.push(row.team.name);
        groupsMap[groupName].standings.push(row);
      });

      // Map and group fixtures
      const slugify = (id: number, name: string) => `${id}-${name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`;
      
      fixtures.forEach((f: any) => {
        const round = f.league.round;
        let targetGroup = groupsMap[round];
        if (!targetGroup) {
          const foundKey = Object.keys(groupsMap).find(k => round.includes(k) || k.includes(round));
          if (foundKey) targetGroup = groupsMap[foundKey];
        }

        const matchData = {
          id: f.fixture.id,
          date: f.fixture.date,
          venue: f.fixture.venue.name,
          status: f.fixture.status.short,
          homeTeam: {
            name: f.teams.home.name,
            logo: f.teams.home.logo,
            id: f.teams.home.id,
            slug: slugify(f.teams.home.id, f.teams.home.name)
          },
          awayTeam: {
            name: f.teams.away.name,
            logo: f.teams.away.logo,
            id: f.teams.away.id,
            slug: slugify(f.teams.away.id, f.teams.away.name)
          },
          league: f.league.name,
          round: f.league.round
        };

        if (targetGroup) {
          targetGroup.fixtures.push(matchData);
        }
      });

      const groups = Object.values(groupsMap);

      return {
        season,
        groups,
        allFixtures: fixtures.map((f: any) => ({
           id: f.fixture.id,
           homeTeam: { name: f.teams.home.name, logo: f.teams.home.logo, slug: slugify(f.teams.home.id, f.teams.home.name) },
           awayTeam: { name: f.teams.away.name, logo: f.teams.away.logo, slug: slugify(f.teams.away.id, f.teams.away.name) },
           date: f.fixture.date,
           venue: f.fixture.venue.name,
           round: f.league.round
        }))
      };
    } catch (error) {
      server.log.error(error);
      return { error: 'Failed to fetch World Cup data' };
    }
  });
}

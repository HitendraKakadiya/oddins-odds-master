import { FastifyInstance } from 'fastify';
import { metaRoutes } from './meta';
import { matchesRoutes } from './matches';
import { predictionsRoutes } from './predictions';
import { leaguesRoutes } from './leagues';
import { teamsRoutes } from './teams';
import { streamsRoutes } from './streams';
import { matchDetailRoutes } from './match-detail';
import { articlesRoutes } from './articles';
import { searchRoutes } from './search';

export async function v1Routes(server: FastifyInstance) {
  await server.register(metaRoutes);
  await server.register(matchesRoutes);
  await server.register(predictionsRoutes);
  await server.register(leaguesRoutes);
  await server.register(teamsRoutes);
  await server.register(streamsRoutes);
  await server.register(matchDetailRoutes);
  await server.register(articlesRoutes);
  await server.register(searchRoutes);
}


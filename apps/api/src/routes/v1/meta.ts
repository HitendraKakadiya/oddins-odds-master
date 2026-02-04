import { FastifyInstance } from 'fastify';

const VERSION = '1.0.0';

export async function metaRoutes(server: FastifyInstance) {
  server.get('/meta', async () => {
    return {
      version: VERSION,
      env: process.env.APP_ENV || 'development',
      now: new Date().toISOString(),
    };
  });
}


import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pool } from './db';

// Import routes
import { healthRoutes } from './routes/health';
import { v1Routes } from './routes/v1';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

export async function buildServer() {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register CORS
  await server.register(cors, {
    origin: true, // Allow all origins in development
  });

  // Health check
  await server.register(healthRoutes);

  // V1 API routes
  await server.register(v1Routes, { prefix: '/v1' });

  // Graceful shutdown
  const closeGracefully = async (signal: string) => {
    server.log.info(`Received ${signal}, closing server gracefully...`);
    await server.close();
    await pool.end();
    process.exit(0);
  };

  process.on('SIGINT', () => closeGracefully('SIGINT'));
  process.on('SIGTERM', () => closeGracefully('SIGTERM'));

  return server;
}

export async function startServer() {
  const server = await buildServer();

  try {
    await server.listen({ port: PORT, host: HOST });
    server.log.info(`Server listening on ${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}


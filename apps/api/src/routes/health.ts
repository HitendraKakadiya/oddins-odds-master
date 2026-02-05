import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { pool } from '../db';

export async function healthRoutes(server: FastifyInstance) {
  // Basic health check (for ALB)
  server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'unknown' as string,
    };

    try {
      // Check database connection
      await pool.query('SELECT 1');
      health.database = 'connected';
    } catch (error: unknown) {
      server.log.error({ err: error }, 'Database health check failed');
      health.status = 'unhealthy';
      health.database = 'disconnected';
      return reply.code(503).send(health);
    }

    return reply.send(health);
  });

  // Detailed health check (for monitoring)
  server.get('/health/detailed', async (request: FastifyRequest, reply: FastifyReply) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: 'unknown' as string,
        totalConnections: 0,
        activeConnections: 0,
      },
    };

    try {
      const result = await pool.query(`
        SELECT 
          count(*)::int as total_connections,
          count(*) FILTER (WHERE state = 'active')::int as active_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `);

      if (result.rows && result.rows.length > 0) {
        health.database = {
          status: 'connected',
          totalConnections: result.rows[0].total_connections,
          activeConnections: result.rows[0].active_connections,
        };
      }
    } catch (error: unknown) {
      server.log.error({ err: error }, 'Detailed database health check failed');
      health.status = 'unhealthy';
      health.database.status = 'disconnected';
      return reply.code(503).send(health);
    }

    return reply.send(health);
  });
}


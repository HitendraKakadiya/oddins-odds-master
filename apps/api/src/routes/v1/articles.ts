import { FastifyInstance } from 'fastify';
import { query } from '../../db';

interface ArticlesQuery {
  type: 'academy' | 'blog';
  category?: string;
  page?: string;
  pageSize?: string;
}

interface ArticleParams {
  type: 'academy' | 'blog';
  slug: string;
}

export async function articlesRoutes(server: FastifyInstance) {
  // GET /v1/articles
  server.get<{ Querystring: ArticlesQuery }>('/articles', async (request, reply) => {
    const {
      type,
      category,
      page = '1',
      pageSize = '20',
    } = request.query;

    if (!type || !['academy', 'blog'].includes(type)) {
      return reply.status(400).send({ error: 'Invalid type parameter. Must be "academy" or "blog"' });
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSizeNum = Math.min(200, Math.max(1, parseInt(pageSize, 10)));
    const offset = (pageNum - 1) * pageSizeNum;

    const conditions: string[] = ['type = $1', 'published_at IS NOT NULL'];
    const params: (string | number | null)[] = [type];
    let paramIndex = 2;

    if (category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM articles
       WHERE ${whereClause}`,
      params
    );

    const total = parseInt(countResult.rows[0].total, 10);

    // Get paginated results
    params.push(pageSizeNum, offset);
    const result = await query(
      `SELECT 
        id, type, slug, title, summary, category, published_at, updated_at
      FROM articles
      WHERE ${whereClause}
      ORDER BY published_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      params
    );

    return {
      page: pageNum,
      pageSize: pageSizeNum,
      total,
      items: result.rows.map((row: { id: number; type: string; slug: string; title: string; summary: string; category: string; published_at: string; updated_at: string }) => ({
        id: row.id,
        type: row.type,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        category: row.category,
        publishedAt: row.published_at,
        updatedAt: row.updated_at,
      })),
    };
  });

  // GET /v1/articles/:type/:slug
  server.get<{ Params: ArticleParams }>('/articles/:type/:slug', async (request, reply) => {
    const { type, slug } = request.params;

    if (!['academy', 'blog'].includes(type)) {
      return reply.status(400).send({ error: 'Invalid type parameter' });
    }

    const result = await query(
      `SELECT 
        id, type, slug, title, summary, body_md, category,
        published_at, updated_at, seo_title, seo_description
      FROM articles
      WHERE type = $1 AND slug = $2
      LIMIT 1`,
      [type, slug]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ error: 'Article not found' });
    }

    const row = result.rows[0];

    return {
      id: row.id,
      type: row.type,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      category: row.category,
      bodyMd: row.body_md,
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
    };
  });
}


import { createRoute, OpenAPIHono, type RouteHandler } from '@hono/zod-openapi';
import { z } from 'zod';
import { prisma } from '../db.js';
import { getStaticImgUrl } from './staticResources.js';

const getImagesRoute = createRoute({
  description: 'Get a paginated list of images',
  method: 'get',
  path: '/api/images',
  request: {
    query: z.object({
      from: z.coerce.number().optional().default(0)
        .openapi({ example: 0 })
        .describe('Starting index'),
      limit: z.coerce.number().min(10).max(20).optional().default(10)
        .openapi({ example: 10 })
        .describe('Count of images to retrieve (from 10 to 20)'),
      tag: z.string().optional()
        .openapi({ example: 'red' })
        .describe('Filter images by tag'),
    }),
  },
  responses: {
    200: {
      description: 'List of images with pagination',
      content: {
        'application/json': {
          schema: z.object({
            images: z.array(z.object({
              id: z.number(),
              name: z.string(),
              url: z.string(),
              tags: z.array(z.string()),
            })),
            from: z.number(),
            limit: z.number(),
            imagesCount: z.number(),
            imagesTotal: z.number(),
          }),
        },
      },
    },
    400: {
      description: 'Invalid parameters',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

const getImagesHandler: RouteHandler<typeof getImagesRoute> = async (ctx) => {
  const from = Number(ctx.req.query('from')) || 0;
  const limit = Math.min(Number(ctx.req.query('limit')) || 10, 20);
  const tag = ctx.req.query('tag');

  if (from < 0) {
    return ctx.json({ error: 'Invalid from parameter' }, 400);
  }

  if (limit <= 0) {
    return ctx.json({ error: 'Invalid limit parameter (1-20)' }, 400);
  }

  const whereStatement = tag ? {
    tags: {
      some: {
        name: tag,
      },
    },
  } : {};

  const [imagesList, totalImagesCounter] = await Promise.all([
    prisma.image.findMany({
      where: whereStatement,
      skip: from,
      take: limit,
      include: { tags: true },
    }),
    prisma.image.count({
      where: whereStatement,
    }),
  ]);

  return ctx.json({
    images: imagesList.map(img => ({
      id: img.id,
      name: img.name,
      url: getStaticImgUrl(img.name),
      tags: img.tags.map(t => t.name),
    })),
    from: from,
    limit: limit,
    imagesCount: imagesList.length,
    imagesTotal: totalImagesCounter,
  }, 200);
};

export function registerImagesRoute(app: OpenAPIHono) {
  app.openapi(getImagesRoute, getImagesHandler);
}

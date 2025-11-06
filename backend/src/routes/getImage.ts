import { createRoute, OpenAPIHono, type RouteHandler } from '@hono/zod-openapi';
import { z } from 'zod';
import { prisma } from '../db.js';
import { getStaticImgUrl } from './staticResources.js';

const getImageRoute = createRoute({
  description: 'Get an image by ID',
  method: 'get',
  path: '/api/image',
  request: {
    query: z.object({
      id: z.coerce.number({ error: 'ID must be a number' }).int().min(0)
        .openapi({ example: 0 })
        .describe('ID of the image to retrieve'),
    }),
  },
  responses: {
    200: {
      description: 'Image details',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number(),
            name: z.string(),
            url: z.string(),
            tags: z.array(z.string()),
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
    404: {
      description: 'Image not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    }
  },
});

const getImageHandler: RouteHandler<typeof getImageRoute> = async (ctx) => {
  const { id } = ctx.req.valid('query');

  const image = await prisma.image.findUnique({
    where: { id: id },
    include: { tags: true },
  });
  if (!image) {
    return ctx.json({ error: 'Image not found' }, 404);
  }

  return ctx.json({
    id: image.id,
    name: image.name,
    url: getStaticImgUrl(image.name),
    tags: image.tags.map(t => t.name),
  }, 200);
};

export function registerImageRoute(app: OpenAPIHono) {
  app.openapi(getImageRoute, getImageHandler);
}


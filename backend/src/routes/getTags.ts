import { createRoute, OpenAPIHono, type RouteHandler } from '@hono/zod-openapi';
import { z } from 'zod';
import { getAllTags } from '../db.js';

const getTagsRoute = createRoute({
  description: 'Get tag list',
  method: 'get',
  path: '/api/tags',
  request: {},
  responses: {
    200: {
      description: 'List of all tags',
      content: {
        'application/json': {
          schema: z.object({
            tags: z.array(z.string()),
          }),
        },
      },
    },
  },
});

const getTagsHandler: RouteHandler<typeof getTagsRoute> = async (ctx) => {
  const result = await getAllTags();
  return ctx.json({ tags: result });
};

export function registerTagsRoute(app: OpenAPIHono) {
  app.openapi(getTagsRoute, getTagsHandler);
}

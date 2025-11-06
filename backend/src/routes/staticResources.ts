import { serveStatic } from '@hono/node-server/serve-static';
import type { OpenAPIHono } from '@hono/zod-openapi';

const STATIC_RESOURCES_PREFIX = '/img';

export function getStaticImgUrl(imageName: string) {
  return `${STATIC_RESOURCES_PREFIX}/${imageName}`;
}

export function registerStaticRoutes(app: OpenAPIHono) {
  app.use(`${STATIC_RESOURCES_PREFIX}/*`, async (ctx, next) => {
    if (!ctx.req.path.endsWith('.png')) {
      return ctx.notFound();
    }

    await next();
  });

  app.use(`${STATIC_RESOURCES_PREFIX}/*`, serveStatic({
    root: `./${process.env.IMAGES_FOLDER!}`,
    rewriteRequestPath: (path) => path.replace(/^\/img/, ''),
    onFound: (_, ctx) => {
      ctx.header('Cache-Control', 'public, max-age=31536000, immutable');
      ctx.header('Vary', 'Accept-Encoding');
    }
  }));
}

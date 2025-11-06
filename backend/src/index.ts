import 'dotenv/config';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { syncResourceFiles } from './helpers/fs.js';
import { registerImageRoute } from './routes/getImage.js';
import { registerImagesRoute } from './routes/getImages.js';
import { registerTagsRoute } from './routes/getTags.js';
import { registerDevRoutes } from './routes/dev.js';
import { registerStaticRoutes } from './routes/staticResources.js';
import { cors } from 'hono/cors';
import { checkDatabaseConnection } from './db.js';

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({
        error: 'Params validation failed',
        details: result.error,
      }, 400);
    }
  }
});

// Images
registerStaticRoutes(app);

// Disable CORS (only for development purposes :)
app.use('/api/*', cors());

// OpenAPI + Swagger
app.doc('/openapi.json', { openapi: '3.0.0', info: { title: 'API', version: '1.0' } });
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

// API routes
registerImageRoute(app);
registerImagesRoute(app);
registerTagsRoute(app);
registerDevRoutes(app);

// React client - only for non-API routes
app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/api')) {
    return next();
  }
  return serveStatic({ root: '../frontend/dist' })(c, next);
});

// SPA fallback - serve index.html for non-API routes
app.get('*', async (c) => {
  if (c.req.path.startsWith('/api')) {
    return c.notFound();
  }
  return serveStatic({ path: '../frontend/dist/index.html' })(c, async () => {});
});

(async () => {
  try {
    await checkDatabaseConnection();
    await syncResourceFiles();

    const port = Number(process.env.PORT) || 3000;
    serve({ fetch: app.fetch, port }, (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    });
  } catch (error) {
    console.error('Failed to start server: ', error);
    process.exit(1);
  }
})();

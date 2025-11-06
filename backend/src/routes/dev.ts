import { createRoute, type OpenAPIHono, type RouteHandler } from '@hono/zod-openapi';
import { randomInt, sampleSize } from 'es-toolkit';
import { z } from 'zod';
import { getImageName, getResourceFiles } from '../helpers/fs.js';
import { getAllTags, insertImage, insertTags } from '../db.js';
import { generateImage, saveImage } from '../helpers/imageGenerator.js';

const testRoute = createRoute({
  description: 'Test route',
  method: 'get',
  path: '/api/dev/test',
  request: {},
  responses: {
    200: {
      description: 'Successfully upserted tags',
      content: {
        'application/json': {
          schema: z.any(),
        },
      },
    },
  },
});

const testHandler: RouteHandler<typeof testRoute> = async (ctx) => {
  return ctx.json({
    process: process.cwd(),
    meta: import.meta.dirname,
    rand: randomInt(1, 100),
    files: await getResourceFiles(),
  })
};

const postTagsRoute = createRoute({
  description: 'Upsert tag list with sample data',
  method: 'post',
  path: '/api/dev/fillTags',
  request: {},
  responses: {
    200: {
      description: 'Successfully upserted tags',
      content: {
        'application/json': {
          schema: z.object({
            result: z.boolean().describe('Result of the operation')
          }),
        },
      },
    },
  },
});

const postTagsHandler: RouteHandler<typeof postTagsRoute> = async (ctx) => {
  const result = await insertTags(['red', 'blue', 'green', 'yellow', 'gray', 'black', 'white']);

  return ctx.json({ result: result }, 200);
};


const postImageRoute = createRoute({
  description: 'Generate a new image with random tags',
  method: 'post',
  path: '/api/dev/generateImage',
  request: {},
  responses: {
    200: {
      description: 'Successfully generated image and inserted into DB',
      content: {
        'application/json': {
          schema: z.object({
            result: z.boolean().describe('Result of the operation'),
            fileName: z.string().describe('File name of the generated image'),
          }),
        },
      },
    },
    500: {
      description: '',
      content: {
        'application/json': {
          schema: z.object({
            result: z.boolean().describe('Result of the operation'),
            message: z.string().describe('Error message')
          })
        }
      }
    }
  },
});

const postImageHandler: RouteHandler<typeof postImageRoute> = async (ctx) => {
  try {
    const b64 = await generateImage('Radom image of car');
    if (!b64) {
      return ctx.json({ result: false, message: 'Image generation failed' }, 500);
    }

    const tags = await getAllTags();
    const imgName = getImageName();
    await saveImage(b64, imgName);
    await insertImage(imgName, sampleSize(tags, 2));

    return ctx.json({ result: true, fileName: imgName }, 200);
  } catch (error) {
    return ctx.json({ result: false, message: `Error occurred during image generation (${error})` }, 500);
  }
};


export function registerDevRoutes(app: OpenAPIHono) {
  app.openapi(postTagsRoute, postTagsHandler);
  app.openapi(postImageRoute, postImageHandler);
  app.openapi(testRoute, testHandler);
}

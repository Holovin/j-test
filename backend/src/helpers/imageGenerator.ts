import OpenAI from 'openai';
import fs from 'fs';
import { join } from 'node:path';

const openai = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage(prompt: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  // https://docs.studio.nebius.com/api-reference/examples/image-generation
  // Params are different from standard OpenAI API, so any is used here
  const result = await openai.images.generate({
    model: 'black-forest-labs/flux-schnell',
    prompt: prompt,
    width: 512,
    height: 512,
    response_format: 'b64_json',
    response_extension: 'png',
  } as any);

  if (result.data && result.data.length > 0 && result.data[0].b64_json) {
    return result.data[0].b64_json;
  }

  return null;
}

export async function saveImage(base64Image: string, imgName: string): Promise<string|null> {
  try {
    const image_bytes = Buffer.from(base64Image, 'base64');
    fs.writeFileSync(join(process.cwd(), process.env.IMAGES_FOLDER!, imgName), image_bytes);
    console.log(`Saved image: ${imgName}`);

    return imgName;
  }
  catch (error) {
    console.error(error);

    return null;
  }
}

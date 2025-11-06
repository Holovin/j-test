import { readdir } from 'fs/promises';
import { join } from 'path';
import { v7 as uuidV7 } from 'uuid';
import { prisma } from '../db.js';

export function getImageName(): string {
  return `${uuidV7()}.png`;
}

export async function getResourceFiles(): Promise<string[]> {
  try {
    const resourcesPath = join(process.cwd(), process.env.IMAGES_FOLDER!);
    const allFiles = await readdir(resourcesPath);
    const pngFiles = allFiles.filter(file => file.toLowerCase().endsWith('.png'));

    console.log(`Found ${pngFiles.length} PNG files in resources folder`);
    return pngFiles;

  } catch (error) {
    console.error('Error reading resources folder: ', error);
    return [];
  }
}

export async function syncResourceFiles(): Promise<void> {
  try {
    const resourceImages = await getResourceFiles();
    const dbImages = await prisma.image.findMany({
      select: { id: true, name: true },
    });

    const fileNames = new Set(resourceImages);
    const toDelete = dbImages.filter(img => !fileNames.has(img.name));
    if (toDelete.length > 0) {
      console.log(`Deleting ${toDelete.length} missing images from DB: ${toDelete.map(i => i.name)}`);
      await prisma.image.deleteMany({
        where: { id: { in: toDelete.map(i => i.id) } },
      });
    }

    const imageNamesDB = new Set(dbImages.map(img => img.name));
    const toAdd = resourceImages.filter(file => !imageNamesDB.has(file));
    if (toAdd.length > 0) {
      console.log(`Adding ${toAdd.length} new images to DB: ${toAdd.join(',')}`);
      await prisma.image.createMany({
        data: toAdd.map(name => ({ name })),
      });
    }

    console.log('Sync complete');
  } catch (error) {
    console.error('Error syncing resources: ', error);
  }
}

import { PrismaClient } from '../generated/prisma/client.js';

export const prisma = new PrismaClient({
  datasourceUrl: `file:${process.cwd()}/${process.env.DATABASE_URL!.split('/').pop()}`,
});

export async function checkDatabaseConnection(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1 FROM Image LIMIT 1`;
    console.log('Database connection successful');

  } catch {
    throw new Error('Database is not initialized, check README.md');
  }
}

export async function insertImage(name: string, tags: string[]): Promise<boolean> {
  try {
    const result = await prisma.image.create({
      data: {
        name: name,
        tags: {
          connectOrCreate: tags.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    console.log(`Image created successfully. ID: ${result.id}`);
    return true;

  } catch (error) {
    console.error('Error inserting image:', error);
    return false;
  }
}

export async function getAllTags(): Promise<string[]> {
  const result = await prisma.tag.findMany();
  return result.map(tag => tag.name);
}

export async function insertTags(tags: string[]): Promise<boolean> {
  try {
    const results = await Promise.all(
      tags.map(tag =>
        prisma.tag.upsert({
          create: { name: tag },
          where: { name: tag },
          update: {},
        })
      )
    );

    console.log('Tags inserted or updated: ', results.length);
    return true;

  } catch (error) {
    console.error('Error inserting tags: ', error);
    return false;
  }
}

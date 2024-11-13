import { eq } from '@repo/database';
import { database } from '@repo/database/client';
import { pages } from '@repo/database/schema';

export const POST = async () => {
  const newPage = await database
    .insert(pages)
    .values({
      name: 'cron-temp',
      email: 'test@test.com',
    })
    .returning({
      id: pages.id,
    });

  await database.delete(pages).where(eq(pages.id, newPage[0].id));

  return new Response('OK', { status: 200 });
};

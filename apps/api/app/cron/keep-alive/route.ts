import { eq } from '@repo/database';
import { database } from '@repo/database/client';
import { meetingsTable } from '@repo/database/schema';

export const POST = async () => {
  const newPage = await database
    .insert(meetingsTable)
    .values({
      name: 'New Meeting',
      type: 'meetingbaas',
      status: 'loaded',
    })
    .returning({
      id: meetingsTable.id,
    });

  await database
    .delete(meetingsTable)
    .where(eq(meetingsTable.id, newPage[0].id));

  return new Response('OK', { status: 200 });
};

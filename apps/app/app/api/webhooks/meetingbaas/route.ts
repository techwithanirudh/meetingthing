import { currentUser } from '@clerk/nextjs/server';
import { analytics } from '@repo/analytics/posthog/server';
import { eq, sql } from '@repo/database/src';
import { database } from '@repo/database/src/client';
import { meetingsTable } from '@repo/database/src/schema';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import { NextResponse } from 'next/server';

export const POST = async (request: Request): Promise<Response> => {
  try {
    const user = await currentUser();
    const body = await request.json();

    log.info(`event received: ${body?.event} for user: ${user?.id}`);
    
    if (body?.event === 'complete') {
    //   const meeting = await database.query.meetingsTable.findFirst({
    //     where: (meetings, { eq }) => eq(meetings.botId, body?.event?.data?.bot_id),
    //   });

      const meeting = await database
        .update(meetingsTable)
        .set({ updatedAt: sql`NOW()` })
        .where(eq(meetingsTable.botId, body?.event?.data?.bot_id))
        .returning({
            id: meetingsTable.id,
        });

      log.info(`meeting updated with id: ${meeting[0].id}`);
    }

    await analytics.shutdown();

    return NextResponse.json({ result: null, ok: true });
  } catch (error) {
    const message = parseError(error);

    log.error(message);

    return NextResponse.json(
      {
        message: 'something went wrong',
        ok: false,
      },
      { status: 500 }
    );
  }
};

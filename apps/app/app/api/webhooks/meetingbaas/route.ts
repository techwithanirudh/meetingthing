import { analytics } from '@repo/analytics/posthog/server';
import { eq, sql } from '@repo/database/src';
import { database } from '@repo/database/src/client';
import { meetingsTable } from '@repo/database/src/schema';
import { env } from '@repo/env';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import { NextResponse } from 'next/server';

export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json();
    const apiKey = request.headers.get('x-meeting-baas-api-key');

    if (apiKey !== env.MEETING_BAAS_API_KEY) {
      log.error('Error verifying webhook:', { error: 'invalid api key' });
      return Response.json(
        {
          message: 'something went wrong',
          ok: false,
        },
        { status: 401 }
      );
    }

    log.info(`event received: ${body?.event}`);

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

      if (meeting[0]) {
        log.info(`meeting updated with id: ${meeting[0]?.id}`);
      } else {
        log.info(`failed to update meeting with bot_id: ${body?.data?.bot_id}`);
      }
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

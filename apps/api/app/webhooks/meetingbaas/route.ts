import { env } from '@/env';
import { analytics } from '@repo/analytics/posthog/server';
import { eq, sql } from '@repo/database';
import { database } from '@repo/database/client';
import { meetingsTable, transcriptsTable } from '@repo/database/schema';
import {
  isCompletionWebhook,
  isStatusChangeWebhook,
} from '@repo/meeting-bots/types/meetingbaas';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import { NextResponse } from 'next/server';

export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json();
    const apiKey = request.headers.get('x-meeting-baas-api-key');

    if (apiKey !== env.MEETING_BAAS_API_KEY) {
      log.error('Error verifying webhook:', { error: 'invalid api key' });
      return NextResponse.json(
        {
          message: 'something went wrong',
          ok: false,
        },
        { status: 401 }
      );
    }

    log.info(`event received: ${body?.event}`);

    if (isStatusChangeWebhook(body)) {
      const { code, created_at } = body.data.status;
      log.info('status change webhook received', { code, created_at });
    } else if (isCompletionWebhook(body)) {
      // todo: do not run unlessUseriD
      //   const meeting = await database.query.meetingsTable.findFirst({
      //     where: (meetings, { eq }) => eq(meetings.botId, body?.event?.data?.bot_id),
      //   });

      const meeting = await database
        .update(meetingsTable)
        .set({ status: 'loaded', updatedAt: sql`NOW()` })
        .where(eq(meetingsTable.botId, body.data.bot_id))
        .returning({
          id: meetingsTable.id,
        });

      if (meeting[0]) {
        if (body.data.transcript) {
          log.info('inserting transcript segments');
          await database.insert(transcriptsTable).values(
            body.data.transcript.map((item) => ({
              meetingId: meeting[0].id,
              ...item,
            }))
          );
        }

        log.info(`meeting updated with id: ${meeting[0].id}`);
      } else {
        log.error(`failed to update meeting with bot_id: ${body.data.bot_id}`);
      }
    } else {
      const { error } = body.data;
      log.error('meeting recording failed:', { error });
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

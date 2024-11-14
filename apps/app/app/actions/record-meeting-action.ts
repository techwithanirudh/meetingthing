'use server';

import { actionClient } from '@/lib/safe-action';
import { database } from '@repo/database/src/client';
import { meetingsTable } from '@repo/database/src/schema';
import { log } from '@repo/observability/log';
import { RecordMeetingSchema } from '@repo/validators';
import { revalidatePath } from 'next/cache';
import { recordMeeting as recordMeetingBot } from '@repo/meeting-bots';

export const recordMeeting = actionClient
  .schema(RecordMeetingSchema)
  // biome-ignore lint/suspicious/useAwait: <explanation>
  .action(async ({ parsedInput: { meetingURL } }) => {
    if (meetingURL) {
      const data = await recordMeetingBot(meetingURL);
      const meeting = await database
        .insert(meetingsTable)
        .values({
          name: 'New Meeting',
          type: 'meetingbaas',
          status: 'loaded',
        })
        .returning({
          id: meetingsTable.id,
        });
      
      revalidatePath('/');

      log.info(`Meeting created with id: ${meeting[0].id}`);

      return {
        success: 'A meeting bot has been created.',
      };
    }

    return { failure: 'Incorrect credentials' };
  });

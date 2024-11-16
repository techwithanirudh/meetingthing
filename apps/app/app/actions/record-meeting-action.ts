'use server';

import { actionClient } from '@/lib/safe-action';
import { database } from '@repo/database/src/client';
import { meetingsTable } from '@repo/database/src/schema';
import { log } from '@repo/observability/log';
import { RecordMeetingSchema } from '@repo/validators';
import { revalidatePath } from 'next/cache';
import { recordMeeting as recordMeetingBot } from '@repo/meeting-bots';
import { auth, currentUser } from '@clerk/nextjs/server';

export const recordMeeting = actionClient
  .schema(RecordMeetingSchema)
  // biome-ignore lint/suspicious/useAwait: <explanation>
  .action(async ({ parsedInput: { meetingURL } }) => {
    if (meetingURL) {
      const { userId, orgId } = await auth();
      const user = await currentUser();

      if (!userId) {
        return { failure: 'User not authenticated' };
      }

      const botName = user?.firstName
        ? `${user.firstName}'s AI Notetaker`
        : 'AI Notetaker';
      const data = await recordMeetingBot(meetingURL, botName);
      const meeting = await database
        .insert(meetingsTable)
        .values({
          name: 'Impromptu Meeting',
          provider: 'meetingbaas',
          status: 'loading',
          userId: userId,
          orgId: orgId,
          botId: data.botId,
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

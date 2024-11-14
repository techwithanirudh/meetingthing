'use server'; 

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { JoinMeetingSchema } from '@repo/validators';

export const joinMeeting = actionClient
  .schema(JoinMeetingSchema)
  // biome-ignore lint/suspicious/useAwait: <explanation>
  .action(async ({ parsedInput: { meetingURL } }) => {
    if (meetingURL) {
      return {
        success: 'Successfully created in',
      };
    }

    return { failure: 'Incorrect credentials' };
  });

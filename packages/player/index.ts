import { z } from 'zod';

export const RecordMeetingSchema = z.object({
  meetingURL: z
    .string()
    .min(1, {
      message: 'Password is required',
    })
    .url(),
});
export type RecordMeeting = z.infer<typeof RecordMeetingSchema>;

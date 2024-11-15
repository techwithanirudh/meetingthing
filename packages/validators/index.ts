import { z } from "zod";

export const RecordMeetingSchema = z.object({
  // biome-ignore lint/style/useNamingConvention: url seems nice with caps
  meetingURL: z
    .string()
    .min(1, {
      message: 'Password is required',
    })
    .url(),
});
export type RecordMeeting = z.infer<typeof RecordMeetingSchema>;

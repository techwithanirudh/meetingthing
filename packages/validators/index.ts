import { z } from "zod";

export const JoinMeetingSchema = z.object({
  meetingURL: z.string().min(1, {
    message: 'Password is required',
  }).url()
});
export type JoinMeeting = z.infer<typeof JoinMeetingSchema>;

import { env } from '@repo/env';
import ky from 'ky';

export interface RecordMeetingResponse {
  bot_id: string;
}

// biome-ignore lint/style/useNamingConvention: url seems nice with caps
export const recordMeeting = async (meetingURL: string, botName?: string) => {
  const response = await ky
    .post('https://api.meetingbaas.com/bots', {
      headers: {
        'x-meeting-baas-api-key': env.MEETING_BAAS_API_KEY,
      },
      json: {
        // biome-ignore lint/style/useNamingConvention: this is how the meetingbaas api works
        meeting_url: meetingURL,
        bot_name: botName ?? 'AI Notetaker',
        reserved: false,
        recording_mode: 'speaker_view',
        bot_image: 'https://example.com/bot.jpg',
        entry_message: 'This meeting is now being recorded.',
        speech_to_text: {
          provider: 'Default',
        },
        automatic_leave: {
          waiting_room_timeout: 600,
        },
        webhook_url:
          `${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/webhooks/meetingbaas`,
      },
    })
    .json<RecordMeetingResponse>();

  return response;
};

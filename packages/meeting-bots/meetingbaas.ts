import ky from 'ky';
import { keys } from './keys';
import type { RecordMeetingResponse } from './types/meetingbaas';

export const recordMeeting = async (meetingURL: string, botName?: string) => {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
  if (!NEXT_PUBLIC_API_URL) throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");

  const response = await ky
    .post('https://api.meetingbaas.com/bots', {
      headers: {
        'x-meeting-baas-api-key': keys().MEETING_BAAS_API_KEY,
      },
      json: {
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
        webhook_url: `${NEXT_PUBLIC_API_URL}/webhooks/meetingbaas`,
      },
    })
    .json<RecordMeetingResponse>();

  return {
    botId: response?.bot_id ?? null,
  };
};

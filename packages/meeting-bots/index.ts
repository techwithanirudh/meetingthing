import { recordMeeting as meetingBaas } from './meetingbaas';

export const recordMeeting = async (meetingURL: string, botName?: string) => {
  return await meetingBaas(meetingURL, botName);
};
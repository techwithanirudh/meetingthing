import { recordMeeting as meetingBaas } from './meetingbaas';

// biome-ignore lint/style/useNamingConvention: url seems nice with caps
export const recordMeeting = async (meetingURL: string, botName?: string) => {
  return await meetingBaas(meetingURL, botName);
};
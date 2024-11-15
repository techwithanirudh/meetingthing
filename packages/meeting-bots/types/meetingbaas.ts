// Bot Status Types
export type BotStatusCode =
  | 'joining_call'
  | 'in_waiting_room'
  | 'in_call_not_recording'
  | 'in_call_recording'
  | 'call_ended';

export interface BotStatus {
  code: BotStatusCode;
  created_at: string; // ISO date string
}

// Transcript Types
export interface TranscriptWord {
  start: number;
  end: number;
  word: string;
}

export interface TranscriptSegment {
  speaker: string;
  words: TranscriptWord[];
}

// Webhook Event Types
export type FailureReason =
  | 'CannotJoinMeeting'
  | 'TimeoutWaitingToStart'
  | 'BotNotAccepted'
  | 'InternalError'
  | 'InvalidMeetingUrl';

// Live Status Change Webhook
export interface StatusChangeWebhook {
  event: 'bot.status_change';
  data: {
    bot_id: string;
    status: BotStatus;
  };
}

// Completion Webhook
export interface CompletionWebhook {
  event: 'complete';
  data: {
    bot_id: string;
    mp4: string; // AWS S3 URL
    speakers: string[];
    transcript?: TranscriptSegment[];
  };
}

// Failure Webhook
export interface FailureWebhook {
  event: 'failed';
  data: {
    bot_id: string;
    error: FailureReason;
  };
}

// Union type for all possible webhook events
export type WebhookEvent =
  | StatusChangeWebhook
  | CompletionWebhook
  | FailureWebhook;

// Type guards
export function isStatusChangeWebhook(
  webhook: WebhookEvent
): webhook is StatusChangeWebhook {
  return webhook.event === 'bot.status_change';
}

export function isCompletionWebhook(
  webhook: WebhookEvent
): webhook is CompletionWebhook {
  return webhook.event === 'complete';
}

export function isFailureWebhook(
  webhook: WebhookEvent
): webhook is FailureWebhook {
  return webhook.event === 'failed';
}

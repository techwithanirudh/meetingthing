import { relations, sql } from 'drizzle-orm';
import {
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const meetingProviderEnum = pgEnum('meeting_provider', [
  'meetingbaas',
  'upload',
]);
export const meetingStatusEnum = pgEnum('meeting_status', [
  'loaded',
  'loading',
  'error',
]);

export const meetingsTable = pgTable('meetings', {
  id: serial('id').primaryKey(),
  botId: text('bot_id'), 
  provider: meetingProviderEnum().notNull(),
  name: text('name').notNull(),
  status: meetingStatusEnum().notNull(),
  endedAt: timestamp('ended_at', {
    mode: 'date',
    withTimezone: true,
  }),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }),
});

export const meetingsRelations = relations(meetingsTable, ({ one }) => ({
  transcripts: one(transcriptsTable)
}));

export type InsertMeeting = typeof meetingsTable.$inferInsert;
export type SelectMeeting = typeof meetingsTable.$inferSelect;

export const transcriptsTable = pgTable('transcripts', {
  id: serial('id').primaryKey(),
  meetingId: serial('meeting_id')
    .notNull()
    .references(() => meetingsTable.id),
  speaker: text('speaker').notNull(),
  words: jsonb('words')
    .$type<
      Array<{
        start: number;
        end: number;
        word: string;
      }>
    >()
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }),
});

export const transcriptsRelations = relations(transcriptsTable, ({ one }) => ({
  meeting: one(meetingsTable, {
    fields: [transcriptsTable.meetingId],
    references: [meetingsTable.id],
  }),
}));

export type InsertTranscript = typeof transcriptsTable.$inferInsert;
export type SelectTranscript = typeof transcriptsTable.$inferSelect;
import { relations, sql } from 'drizzle-orm';
import {
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const meetingTypeEnum = pgEnum('meeting_type', ['meetingbaas', 'local']);
export const meetingStatusEnum = pgEnum('meeting_status', [
  'loaded',
  'loading',
  'error',
]);

export const meetingsTable = pgTable('meetings', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: meetingTypeEnum().notNull(),
  status: meetingStatusEnum().notNull(),
  attendees: text('attendees').array().notNull().default(sql`'{}'::text[]`),
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

export const transcripts = pgTable('transcripts', {
  id: serial('id').primaryKey(),
  meetingId: serial('meeting_id')
    .notNull()
    .references(() => meetingsTable.id),
  speaker: text('speaker').notNull(),
  words: jsonb('words')
    .$type<
      Array<{
        start_time: number;
        end_time: number;
        text: string;
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

export const transcriptsRelations = relations(transcripts, ({ one }) => ({
  meeting: one(meetingsTable, {
    fields: [transcripts.meetingId],
    references: [meetingsTable.id],
  }),
}));

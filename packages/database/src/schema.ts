import { sql } from 'drizzle-orm';
import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const pages = pgTable('pages', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});

export type InsertPost = typeof pages.$inferInsert;
export type SelectPost = typeof pages.$inferSelect;

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pages = sqliteTable('pages', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export type InsertPost = typeof pages.$inferInsert;
export type SelectPost = typeof pages.$inferSelect;

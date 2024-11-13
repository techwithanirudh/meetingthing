import { defineConfig } from 'drizzle-kit';
import { env } from '@repo/env';

export default defineConfig({
  schema: './schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});

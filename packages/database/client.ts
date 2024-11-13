import 'server-only';

import { env } from '@repo/env';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const database = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  schema: schema
});

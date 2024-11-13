import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@repo/env';

const sql = neon(env.DATABASE_URL);
export const database = drizzle({ client: sql });

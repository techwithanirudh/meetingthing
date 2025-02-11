import 'server-only';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { keys } from './keys';

const client = neon(keys().DATABASE_URL);

export const database = drizzle({ client });
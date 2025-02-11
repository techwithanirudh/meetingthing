import 'server-only';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { keys } from './keys';
import * as schema from './schema';

const client = neon(keys().DATABASE_URL);

export const database = drizzle({ client, schema });
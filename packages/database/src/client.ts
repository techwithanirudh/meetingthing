import 'server-only';

import { getXataClient } from './xata';
import { drizzle } from 'drizzle-orm/xata-http';
import * as schema from './schema';

const xata = getXataClient();

export const database = drizzle(xata, {
  schema,
});

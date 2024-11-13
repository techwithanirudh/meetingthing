import 'server-only';

import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { env } from '@repo/env';

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

const libsql = createClient({
  url: `${env.TURSO_DATABASE_URL}`,
  authToken: `${env.TURSO_AUTH_TOKEN}`,
})
const adapter = new PrismaLibSQL(libsql);

export const database = new PrismaClient({ adapter });

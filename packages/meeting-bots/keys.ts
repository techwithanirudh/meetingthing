import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      MEETING_BAAS_API_KEY: z.string().min(1),
    },
    client: {
      NEXT_PUBLIC_API_URL: z.string().min(1).url().optional(),
    },
    runtimeEnv: {
      MEETING_BAAS_API_KEY: process.env.MEETING_BAAS_API_KEY,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
  });

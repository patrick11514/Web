import { env as dynamicEnv } from '$env/dynamic/private';
import { z } from 'zod';

const envSchema = z.object({
  NINA_BASE_URL: z.string().default('http://10.10.10.211:1888/'),
  UPDATE_THRESHOLD_COUNT: z.coerce.number().default(30),
  JWT_SECRET: z.string().min(1),
  DATABASE_IP: z.string().min(1),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  FILE_FOLDER: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  COOKIE_EXPIRE: z.coerce.number()
});

export const env = envSchema.parse(dynamicEnv);

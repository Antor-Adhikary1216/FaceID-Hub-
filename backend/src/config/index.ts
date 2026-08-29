import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .default('mongodb://localhost:27017/faceid'),
  JWT_SECRET: z.string().default('faceid-jwt-secret-2026-change-in-production'),
  JWT_REFRESH_SECRET: z.string().default('faceid-refresh-secret-2026-change-in-production'),
  PORT: z.coerce.number().default(3001),
  AI_SERVICE_URL: z.string().default('http://localhost:8000'),
  UPLOAD_DIR: z.string().default('./uploads'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  FIREBASE_PROJECT_ID: z.string().default(''),
  FIREBASE_CLIENT_EMAIL: z.string().default(''),
  FIREBASE_PRIVATE_KEY: z.string().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

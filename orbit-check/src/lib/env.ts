import { config } from "dotenv";
import { z } from "zod";

// Ensure environment variables from .env are loaded
config();

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .default("postgresql://postgres:postgres@localhost:5432/orbitcheck?schema=public"),
  JWT_SECRET: z.string().default("orbitcheck-super-secret-jwt-key-2026"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional(),
});

export function getEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment variables");
  }
  return result.data;
}

export const env = getEnv();

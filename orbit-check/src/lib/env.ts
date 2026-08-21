import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
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

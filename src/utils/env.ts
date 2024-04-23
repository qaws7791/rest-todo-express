import { z } from "zod";

const envSchema = z.object({
  TOKEN_SECRET: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Environment variable error:", env.error.message);
  throw new Error("Environment variables are not set correctly.");
}

export default env.data;

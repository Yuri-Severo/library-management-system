import { z } from "zod";
import "dotenv/config"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().default("3333"),
});

export const env = envSchema.parse(process.env);

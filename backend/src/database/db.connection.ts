import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index";
import dotenv from "dotenv";
import { env } from "../config/env.config";

dotenv.config();

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: true,
});

export const db = drizzle(pool, { schema });
export type DrizzleClientType = typeof db;

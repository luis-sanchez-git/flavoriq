// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

export const db = drizzle(process.env.POSTGRES_URL!);
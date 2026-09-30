import { neon } from "@neondatabase/serverless";
import type { Db } from "./db.ts";

let instance: Db | undefined;

// The app's database, backed by Neon. Created on first use so that
// importing this file never needs DATABASE_URL (e.g. during a build).
export function getDb(): Db {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    const sql = neon(url);
    instance = {
      async query<T>(text: string, params?: unknown[]) {
        return (await sql.query(text, params ?? [])) as T[];
      },
    };
  }
  return instance;
}

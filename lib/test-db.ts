import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import type { Db } from "./db.ts";

const schema = readFileSync(join(__dirname, "../db/schema.sql"), "utf8");

// A fresh in-process Postgres with the production schema applied.
export async function createTestDb(): Promise<Db> {
  const pg = new PGlite();
  await pg.exec(schema);
  return {
    async query<T>(text: string, params?: unknown[]) {
      const result = await pg.query<T>(text, params);
      return result.rows;
    },
  };
}

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pgClient = postgres(process.env.DATABASE_URL, { max: 1 });
export const db = drizzle(pgClient, { schema });
export { pgClient as sqlClient };

function convertPlaceholders(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => {
    i++;
    return `$${i}`;
  });
}

function prepare(sql: string) {
  const converted = convertPlaceholders(sql);
  return {
    async run(...args: any[]): Promise<{ lastInsertRowid: any; changes: number }> {
      const isInsert = /^\s*insert\s+/i.test(sql);
      const hasReturning = /returning\s+/i.test(sql);
      const finalSql = isInsert && !hasReturning ? `${converted} RETURNING id` : converted;
      const res: any = await pgClient.unsafe(finalSql, args);
      let lastInsertRowid: any = null;
      if (isInsert && Array.isArray(res) && res.length > 0) {
        lastInsertRowid = (res[0] as any).id ?? null;
      }
      const changes = Array.isArray(res) ? res.length : 0;
      return { lastInsertRowid, changes };
    },
    async get(...args: any[]): Promise<any> {
      const res: any = await pgClient.unsafe(converted, args);
      return Array.isArray(res) ? res[0] ?? undefined : res;
    },
    async all(...args: any[]): Promise<any[]> {
      const res: any = await pgClient.unsafe(converted, args);
      return Array.isArray(res) ? res : [res];
    },
  };
}

export const sqlite = {
  prepare,
  async transaction<T extends () => unknown>(fn: T): Promise<() => Promise<void>> {
    return async () => {
      await pgClient.unsafe("BEGIN");
      try {
        await fn();
        await pgClient.unsafe("COMMIT");
      } catch (e) {
        await pgClient.unsafe("ROLLBACK");
        throw e;
      }
    };
  },
};

let seeded = false;
export async function ensureSeeded() {
  seeded = true;
  return;
}

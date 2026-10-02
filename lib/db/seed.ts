import fs from "node:fs";
import path from "node:path";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

type SeedData = {
  phases: { id: number; name: string; target_period: string; order: number }[];
  tasks: {
    no: number;
    phase_id: number;
    topic: string;
    title: string;
    priority: string;
    estimated_hours: number;
    resource_notes: string;
  }[];
  flashcards: { term: string; definition: string; category: string }[];
  data_sources: { name: string; url: string; category: string; personal_note: string }[];
};

export async function seedIfEmpty(db: PostgresJsDatabase<typeof schema>) {
  const [row] = await db.select({ count: schema.phases.id }).from(schema.phases).limit(1);
  if (row) return;

  const sourcePath = path.join(process.cwd(), "scripts", "seed-tasks-source.json");
  if (!fs.existsSync(sourcePath)) return;
  const raw = fs.readFileSync(sourcePath, "utf-8");
  const data: SeedData = JSON.parse(raw);
  const now = new Date().toISOString();

  try {
    for (const p of data.phases) {
      const exists = await db.select().from(schema.phases).where(eq(schema.phases.id, p.id)).limit(1);
      if (exists.length === 0) {
        await db.insert(schema.phases).values({
          id: p.id,
          name: p.name,
          targetPeriod: p.target_period,
          order: p.order,
        });
      }
    }

    for (const t of data.tasks) {
      const exists = await db.select().from(schema.tasks).where(eq(schema.tasks.no, t.no)).limit(1);
      if (exists.length === 0) {
        await db.insert(schema.tasks).values({
          no: t.no,
          phaseId: t.phase_id,
          topic: t.topic,
          title: t.title,
          priority: t.priority,
          estimatedHours: t.estimated_hours,
          resourceNotes: t.resource_notes,
          status: "Belum",
          notes: "",
          statusChangedAt: now,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    for (const f of data.flashcards) {
      const exists = await db.select().from(schema.flashcards).where(eq(schema.flashcards.term, f.term)).limit(1);
      if (exists.length === 0) {
        await db.insert(schema.flashcards).values({
          term: f.term,
          definition: f.definition,
          category: f.category,
          confidenceLevel: 1,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    for (const d of data.data_sources) {
      const exists = await db.select().from(schema.dataSources).where(eq(schema.dataSources.name, d.name)).limit(1);
      if (exists.length === 0) {
        await db.insert(schema.dataSources).values({
          name: d.name,
          url: d.url,
          category: d.category,
          personalNote: d.personal_note,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  } catch (err) {
    console.warn("seedIfEmpty: skipped due to error", err);
  }
}

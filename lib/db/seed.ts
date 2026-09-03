import fs from "node:fs";
import path from "node:path";
import type Database from "better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

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

export function seedIfEmpty(
  db: BetterSQLite3Database<typeof schema>,
  sqlite: Database.Database
) {
  const row = sqlite.prepare("SELECT COUNT(*) as c FROM phases").get() as { c: number };
  if (row.c > 0) return;

  const sourcePath = path.join(process.cwd(), "scripts", "seed-tasks-source.json");
  if (!fs.existsSync(sourcePath)) return;
  const raw = fs.readFileSync(sourcePath, "utf-8");
  const data: SeedData = JSON.parse(raw);
  const now = new Date().toISOString();

  const insertPhase = sqlite.prepare(
    `INSERT OR IGNORE INTO phases (id, name, target_period, "order") VALUES (?, ?, ?, ?)`
  );
  const insertTask = sqlite.prepare(
    `INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at, status_changed_at)
     SELECT ?, ?, ?, ?, ?, ?, ?, 'Belum', '', ?, ?, ?
     WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE no = ?)`
  );
  const insertFlashcard = sqlite.prepare(
    `INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at)
     SELECT ?, ?, ?, 1, ?, ? WHERE NOT EXISTS (SELECT 1 FROM flashcards WHERE term = ?)`
  );
  const insertDataSource = sqlite.prepare(
    `INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at)
     SELECT ?, ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM data_sources WHERE name = ?)`
  );

  const tx = sqlite.transaction(() => {
    for (const p of data.phases) {
      insertPhase.run(p.id, p.name, p.target_period, p.order);
    }
    for (const t of data.tasks) {
      insertTask.run(
        t.no,
        t.phase_id,
        t.topic,
        t.title,
        t.priority,
        t.estimated_hours,
        t.resource_notes,
        now,
        now,
        now,
        t.no
      );
    }
    for (const f of data.flashcards) {
      insertFlashcard.run(f.term, f.definition, f.category, now, now, f.term);
    }
    for (const d of data.data_sources) {
      insertDataSource.run(d.name, d.url, d.category, d.personal_note, now, now, d.name);
    }
  });
  try {
    tx();
  } catch (err) {
    // Another process may be seeding concurrently (e.g. parallel build workers) — safe to ignore.
    console.warn("seedIfEmpty: skipped due to concurrent write", err);
  }
}

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";
import { seedIfEmpty } from "./seed";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "mi.db");

const DDL = `
CREATE TABLE IF NOT EXISTS phases (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  target_period TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  no INTEGER NOT NULL,
  phase_id INTEGER NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  priority TEXT NOT NULL,
  estimated_hours REAL NOT NULL DEFAULT 0,
  resource_notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Belum',
  target_date TEXT,
  completed_date TEXT,
  notes TEXT DEFAULT '',
  status_changed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_number INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  focus_phase INTEGER,
  target_hours REAL NOT NULL DEFAULT 9,
  actual_hours REAL NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER,
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  duration_minutes REAL NOT NULL,
  mode TEXT DEFAULT 'focus',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  tags TEXT DEFAULT '',
  related_task_id INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS flashcards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT DEFAULT '',
  last_reviewed_at TEXT,
  confidence_level INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS market_sizing_calcs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  method TEXT DEFAULT 'top-down',
  tam_value REAL NOT NULL DEFAULT 0,
  tam_assumption TEXT NOT NULL DEFAULT '',
  sam_value REAL NOT NULL DEFAULT 0,
  sam_assumption TEXT NOT NULL DEFAULT '',
  som_value REAL NOT NULL DEFAULT 0,
  som_assumption TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS data_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  personal_note TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const sqlite = new Database(DB_PATH);
  sqlite.pragma("busy_timeout = 10000");
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(DDL);
  const db = drizzle(sqlite, { schema });
  seedIfEmpty(db, sqlite);
  return { sqlite, db };
}

declare global {
  var __miDb: ReturnType<typeof initDb> | undefined;
}

const cached = globalThis.__miDb ?? initDb();
if (process.env.NODE_ENV !== "production") {
  globalThis.__miDb = cached;
}

export const sqlite = cached.sqlite;
export const db = cached.db;
export { DB_PATH };

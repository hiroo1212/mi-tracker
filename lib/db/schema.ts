import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const phases = sqliteTable("phases", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  targetPeriod: text("target_period").notNull(),
  order: integer("order").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  no: integer("no").notNull(),
  phaseId: integer("phase_id").notNull(),
  topic: text("topic").notNull(),
  title: text("title").notNull(),
  priority: text("priority").notNull(), // Wajib | Penting | Opsional
  estimatedHours: real("estimated_hours").notNull().default(0),
  resourceNotes: text("resource_notes").default(""),
  status: text("status").notNull().default("Belum"), // Belum | Proses | Selesai
  targetDate: text("target_date"),
  completedDate: text("completed_date"),
  notes: text("notes").default(""),
  statusChangedAt: text("status_changed_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const weeklyLogs = sqliteTable("weekly_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekNumber: integer("week_number").notNull(),
  startDate: text("start_date").notNull(),
  focusPhase: integer("focus_phase"),
  targetHours: real("target_hours").notNull().default(9),
  actualHours: real("actual_hours").notNull().default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const studySessions = sqliteTable("study_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id"),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at").notNull(),
  durationMinutes: real("duration_minutes").notNull(),
  mode: text("mode").default("focus"), // focus | break
  createdAt: text("created_at").notNull(),
});

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  tags: text("tags").default(""), // comma-separated
  relatedTaskId: integer("related_task_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const flashcards = sqliteTable("flashcards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  category: text("category").default(""),
  lastReviewedAt: text("last_reviewed_at"),
  confidenceLevel: integer("confidence_level").notNull().default(1),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const marketSizingCalcs = sqliteTable("market_sizing_calcs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  method: text("method").default("top-down"), // top-down | bottom-up
  tamValue: real("tam_value").notNull().default(0),
  tamAssumption: text("tam_assumption").notNull().default(""),
  samValue: real("sam_value").notNull().default(0),
  samAssumption: text("sam_assumption").notNull().default(""),
  somValue: real("som_value").notNull().default(0),
  somAssumption: text("som_assumption").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const dataSources = sqliteTable("data_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull().default(""),
  category: text("category").default(""),
  personalNote: text("personal_note").default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

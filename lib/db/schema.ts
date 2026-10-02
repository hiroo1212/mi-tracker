import { pgTable, text, integer, doublePrecision, serial } from "drizzle-orm/pg-core";

export const phases = pgTable("phases", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  targetPeriod: text("target_period").notNull(),
  order: integer("order").notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  no: integer("no").notNull(),
  phaseId: integer("phase_id").notNull(),
  topic: text("topic").notNull(),
  title: text("title").notNull(),
  priority: text("priority").notNull().default("Wajib"),
  estimatedHours: doublePrecision("estimated_hours").notNull().default(0),
  resourceNotes: text("resource_notes").default(""),
  status: text("status").notNull().default("Belum"),
  targetDate: text("target_date"),
  completedDate: text("completed_date"),
  notes: text("notes").default(""),
  statusChangedAt: text("status_changed_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const weeklyLogs = pgTable("weekly_logs", {
  id: serial("id").primaryKey(),
  weekNumber: integer("week_number").notNull(),
  startDate: text("start_date").notNull(),
  focusPhase: integer("focus_phase"),
  targetHours: doublePrecision("target_hours").notNull().default(9),
  actualHours: doublePrecision("actual_hours").notNull().default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id"),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at").notNull(),
  durationMinutes: doublePrecision("duration_minutes").notNull(),
  mode: text("mode").default("focus"),
  createdAt: text("created_at").notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  tags: text("tags").default(""),
  relatedTaskId: integer("related_task_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  category: text("category").default(""),
  lastReviewedAt: text("last_reviewed_at"),
  confidenceLevel: integer("confidence_level").notNull().default(1),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const marketSizingCalcs = pgTable("market_sizing_calcs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  method: text("method").default("top-down"),
  tamValue: doublePrecision("tam_value").notNull().default(0),
  tamAssumption: text("tam_assumption").notNull().default(""),
  samValue: doublePrecision("sam_value").notNull().default(0),
  samAssumption: text("sam_assumption").notNull().default(""),
  somValue: doublePrecision("som_value").notNull().default(0),
  somAssumption: text("som_assumption").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const dataSources = pgTable("data_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().default(""),
  category: text("category").default(""),
  personalNote: text("personal_note").default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

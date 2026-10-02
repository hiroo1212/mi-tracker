CREATE TABLE "data_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"category" text DEFAULT '',
	"personal_note" text DEFAULT '',
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" serial PRIMARY KEY NOT NULL,
	"term" text NOT NULL,
	"definition" text NOT NULL,
	"category" text DEFAULT '',
	"last_reviewed_at" text,
	"confidence_level" integer DEFAULT 1 NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_sizing_calcs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"method" text DEFAULT 'top-down',
	"tam_value" double precision DEFAULT 0 NOT NULL,
	"tam_assumption" text DEFAULT '' NOT NULL,
	"sam_value" double precision DEFAULT 0 NOT NULL,
	"sam_assumption" text DEFAULT '' NOT NULL,
	"som_value" double precision DEFAULT 0 NOT NULL,
	"som_assumption" text DEFAULT '' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"tags" text DEFAULT '',
	"related_task_id" integer,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phases" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"target_period" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer,
	"started_at" text NOT NULL,
	"ended_at" text NOT NULL,
	"duration_minutes" double precision NOT NULL,
	"mode" text DEFAULT 'focus',
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"no" integer NOT NULL,
	"phase_id" integer NOT NULL,
	"topic" text NOT NULL,
	"title" text NOT NULL,
	"priority" text DEFAULT 'Wajib' NOT NULL,
	"estimated_hours" double precision DEFAULT 0 NOT NULL,
	"resource_notes" text DEFAULT '',
	"status" text DEFAULT 'Belum' NOT NULL,
	"target_date" text,
	"completed_date" text,
	"notes" text DEFAULT '',
	"status_changed_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"week_number" integer NOT NULL,
	"start_date" text NOT NULL,
	"focus_phase" integer,
	"target_hours" double precision DEFAULT 9 NOT NULL,
	"actual_hours" double precision DEFAULT 0 NOT NULL,
	"notes" text DEFAULT '',
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);

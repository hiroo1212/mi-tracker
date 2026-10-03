-- =========================================================
-- MI TRACKER - SUPABASE FULL INITIALIZATION SCRIPT
-- Paste this script into Supabase SQL Editor and click 'Run'
-- =========================================================

-- 1. CREATE ALL TABLES
CREATE TABLE "data_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"category" text DEFAULT '',
	"personal_note" text DEFAULT '',
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);

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

CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"tags" text DEFAULT '',
	"related_task_id" integer,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);

CREATE TABLE "phases" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"target_period" text NOT NULL,
	"order" integer NOT NULL
);

CREATE TABLE "study_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer,
	"started_at" text NOT NULL,
	"ended_at" text NOT NULL,
	"duration_minutes" double precision NOT NULL,
	"mode" text DEFAULT 'focus',
	"created_at" text NOT NULL
);

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


-- 2. SEED PHASES
INSERT INTO phases (id, name, target_period, "order") VALUES (0, 'Fase 0 - Orientasi', 'Minggu 1', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO phases (id, name, target_period, "order") VALUES (1, 'Fase 1 - Fondasi Bisnis', 'Bulan 1', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO phases (id, name, target_period, "order") VALUES (2, 'Fase 2 - Data & Spreadsheet', 'Bulan 2', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO phases (id, name, target_period, "order") VALUES (3, 'Fase 3 - Riset & Sumber Data', 'Bulan 3', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO phases (id, name, target_period, "order") VALUES (4, 'Fase 4 - Visualisasi & Storytelling', 'Bulan 4', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO phases (id, name, target_period, "order") VALUES (5, 'Fase 5 - Portofolio & Melamar', 'Bulan 5', 5) ON CONFLICT (id) DO NOTHING;

-- 3. SEED TASKS
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (1, 0, 'Kenali pekerjaannya', 'Kumpulkan 5 job description ''Market Intelligence / Insight Analyst Intern'', catat skill yang paling sering diminta', 'Wajib', 2, 'LinkedIn, Glints, Kalibrr, Dealls', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (2, 0, 'Kenali pekerjaannya', 'Pahami beda Market Research vs Market Intelligence vs Business Intelligence vs Competitive Intelligence', 'Wajib', 2, 'Artikel + video YouTube pengantar', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (3, 0, 'Kenali pekerjaannya', 'Wawancara singkat / baca pengalaman 2 praktisi MI (LinkedIn post, podcast, atau coffee chat)', 'Penting', 2, 'LinkedIn, podcast karier', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (4, 0, 'Pilih fokus', 'Pilih 1 industri yang akan dipakai jadi studi kasus sepanjang program (mis. FMCG, fintech, e-commerce, kopi ritel)', 'Wajib', 1, 'Keputusan pribadi', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (5, 0, 'Siapkan sistem kerja', 'Buat folder kerja + tempat catatan (Notion / Google Docs) dan rapikan LinkedIn', 'Wajib', 2, 'Notion, Google Drive', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (6, 0, 'Siapkan sistem kerja', 'Tetapkan jadwal belajar 8-10 jam/minggu dan masukkan ke kalender sebagai slot tetap', 'Wajib', 1, 'Google Calendar', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (7, 1, 'Bahasa bisnis dasar', 'Kuasai istilah: revenue, gross margin, market share, CAGR, YoY, unit economics, ARPU', 'Wajib', 4, 'Investopedia, buku pengantar manajemen', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (8, 1, 'Framework analisis', 'PESTEL: pahami 6 dimensinya dan latih pada industri fokus', 'Wajib', 3, 'Artikel + template PESTEL', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (9, 1, 'Framework analisis', 'Porter''s Five Forces: pahami tiap force dan tentukan mana yang paling menekan industri fokus', 'Wajib', 4, 'Harvard Business Review, video Porter', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (10, 1, 'Framework analisis', 'SWOT dan cara menurunkannya jadi rekomendasi (TOWS matrix)', 'Wajib', 2, 'Artikel strategi', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (11, 1, 'Framework analisis', 'STP: segmentasi, targeting, positioning + latih buat positioning map sederhana', 'Wajib', 3, 'Buku Kotler ringkas / artikel', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (12, 1, 'Framework analisis', 'Marketing mix 4P/7P dan Business Model Canvas', 'Penting', 3, 'Strategyzer, artikel BMC', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (13, 1, 'Framework analisis', 'Value chain dan cara mengenali di mana margin industri terkumpul', 'Opsional', 2, 'Artikel value chain', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (14, 1, 'Belajar dari laporan asli', 'Bedah struktur laporan e-Conomy SEA (Google-Temasek): pertanyaan apa yang dijawab, data dari mana', 'Wajib', 3, 'e-Conomy SEA (gratis)', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (15, 1, 'Belajar dari laporan asli', 'Baca 2 laporan industri Indonesia dan tandai cara mereka menyajikan ukuran pasar', 'Wajib', 4, 'Katadata Insight Center, DSInnovate, asosiasi industri', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (16, 1, 'Belajar dari laporan asli', 'Baca bagian ''Analisis Industri'' pada 1 annual report emiten IDX di industri fokus', 'Wajib', 3, 'idx.co.id, situs IR perusahaan', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (17, 1, 'Output Fase 1', 'TUGAS: tulis analisis industri fokus 2 halaman memakai PESTEL + Five Forces', 'Wajib', 6, 'Output sendiri - simpan di folder portofolio', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (18, 2, 'Excel fondasi', 'Navigasi, format cell, absolute vs relative reference ($), freeze panes, named range', 'Wajib', 3, 'Excel Is Fun, Kelas Excel (ID)', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (19, 2, 'Excel fungsi inti', 'SUM, AVERAGE, MEDIAN, IF, IFS, ROUND, dan penggunaan IFERROR', 'Wajib', 3, 'Latihan langsung di file sendiri', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (20, 2, 'Excel fungsi inti', 'COUNTIF/COUNTIFS dan SUMIF/SUMIFS untuk rekap berdasarkan kriteria', 'Wajib', 3, 'Latihan langsung', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (21, 2, 'Excel fungsi inti', 'VLOOKUP lalu naik ke INDEX + MATCH (lebih fleksibel dan jadi standar analis)', 'Wajib', 4, 'Tutorial INDEX MATCH', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (22, 2, 'Excel data cleaning', 'TRIM, CLEAN, TEXT to COLUMNS, Remove Duplicates, Find & Replace, Flash Fill', 'Wajib', 3, 'Latihan pakai data mentah berantakan', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (23, 2, 'Excel analisis', 'PivotTable: baris, kolom, nilai, filter, grouping tanggal, % of total', 'Wajib', 5, 'Tutorial PivotTable', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (24, 2, 'Excel analisis', 'Power Query dasar: import, append beberapa file, unpivot kolom', 'Penting', 4, 'Tutorial Power Query', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (25, 2, 'Excel visual', 'Chart di Excel: bar, line, combo (dual axis), dan kapan pakai yang mana', 'Wajib', 3, 'Latihan langsung', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (26, 2, 'Statistik terapan', 'Mean vs median vs modus, distribusi, outlier, standar deviasi - dan kapan mean menyesatkan', 'Wajib', 4, 'Khan Academy Statistics', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (27, 2, 'Statistik terapan', 'Sampling, ukuran sampel, margin of error, cara membaca hasil survei tanpa salah tafsir', 'Wajib', 3, 'Khan Academy, artikel metodologi survei', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (28, 2, 'Statistik terapan', 'Korelasi bukan kausalitas, growth rate, CAGR, indeks, weighted average', 'Wajib', 3, 'Artikel + latihan hitung di Excel', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (29, 2, 'SQL', 'SELECT, WHERE, ORDER BY, LIMIT, DISTINCT', 'Wajib', 3, 'SQLBolt, Mode SQL Tutorial', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (30, 2, 'SQL', 'Agregasi: GROUP BY, HAVING, COUNT/SUM/AVG', 'Wajib', 3, 'SQLBolt, latihan di DB Fiddle', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (31, 2, 'SQL', 'JOIN: inner, left, dan cara mengecek hasil join tidak menggandakan baris', 'Wajib', 4, 'Mode SQL Tutorial', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (32, 2, 'SQL', 'CTE (WITH) dan window function: ROW_NUMBER, RANK, SUM OVER', 'Penting', 4, 'Mode SQL Tutorial - Advanced', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (33, 2, 'Output Fase 2', 'TUGAS: ambil 1 dataset publik lalu jawab 3 pertanyaan bisnis konkret, bukan sekadar deskripsi angka', 'Wajib', 8, 'BPS, Kaggle, Data Jakarta', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (34, 3, 'Peta sumber data', 'Buat daftar sumber data resmi Indonesia dan apa saja yang tersedia di masing-masing', 'Wajib', 4, 'BPS, Bank Indonesia, OJK, Kemenperin, Kemendag', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (35, 3, 'Peta sumber data', 'Latih unduh dan olah 1 tabel dari BPS sampai jadi grafik tren', 'Wajib', 3, 'bps.go.id', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (36, 3, 'Peta sumber data', 'Cari data lewat annual report, prospektus IPO, dan laporan asosiasi industri', 'Wajib', 4, 'idx.co.id, situs asosiasi (GAPMMI, AFTECH, dll)', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (37, 3, 'Peta sumber data', 'Kenali sumber sekunder global dan batasannya: Statista, Euromonitor, laporan konsultan versi publik', 'Penting', 2, 'Statista (gratis terbatas), McKinsey, Bain', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (38, 3, 'Market sizing', 'Metode top-down: dari angka makro turun ke segmen', 'Wajib', 3, 'Artikel market sizing', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (39, 3, 'Market sizing', 'Metode bottom-up: jumlah pelanggan x frekuensi x harga rata-rata', 'Wajib', 3, 'Artikel market sizing', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (40, 3, 'Market sizing', 'TAM / SAM / SOM dan cara menulis asumsi supaya bisa diaudit orang lain', 'Wajib', 3, 'Artikel + template', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (41, 3, 'Market sizing', 'TUGAS: selesaikan 5 soal sizing bertipe ''berapa besar pasar X di Indonesia'' (sering keluar di interview)', 'Wajib', 5, 'Latihan mandiri, case book konsultan', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (42, 3, 'Competitive intelligence', 'Susun competitor battlecard: positioning, harga, fitur, kanal, pesan pemasaran', 'Wajib', 4, 'Template battlecard', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (43, 3, 'Competitive intelligence', 'Google Trends: bandingkan minat pencarian antar brand dan baca musimannya', 'Wajib', 2, 'trends.google.com', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (44, 3, 'Competitive intelligence', 'Similarweb dan Meta Ad Library: trafik dan strategi iklan kompetitor', 'Wajib', 3, 'similarweb.com, facebook.com/ads/library', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (45, 3, 'Competitive intelligence', 'Google Alerts + RSS untuk memantau berita kompetitor otomatis', 'Penting', 2, 'google.com/alerts, Feedly', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (46, 3, 'Competitive intelligence', 'Sinyal dari App Store / Play Store (ranking, rating, isi review) dan dari lowongan kerja kompetitor', 'Penting', 3, 'Play Store, LinkedIn Jobs', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (47, 3, 'Riset primer', 'Desain kuesioner: hindari leading question, double-barreled, skala Likert yang benar', 'Wajib', 4, 'Artikel metodologi survei', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (48, 3, 'Riset primer', 'Teknik in-depth interview pelanggan dan dasar FGD', 'Penting', 3, 'Artikel + buku UX research', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (49, 3, 'Riset primer', 'Jalankan survei kecil (min. 30 responden) dan olah hasilnya', 'Penting', 5, 'Google Forms + Excel', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (50, 3, 'Otomasi data', 'Python dasar untuk data: pandas (read, filter, groupby, merge)', 'Penting', 6, 'Kaggle Learn Pandas', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (51, 3, 'Otomasi data', 'Web scraping sederhana: requests + BeautifulSoup. Cek dulu robots.txt dan Terms of Service situsnya', 'Penting', 6, 'Dokumentasi BeautifulSoup', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (52, 3, 'Output Fase 3', 'TUGAS: bangun tracker harga atau review 1 kategori produk, jalankan 3 minggu, catat temuannya', 'Wajib', 8, 'Output sendiri - simpan di folder portofolio', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (53, 4, 'Prinsip visual', 'Pilih chart yang tepat, satu pesan per grafik, hindari chart junk dan pie chart berlebihan', 'Wajib', 3, 'Storytelling with Data (blog)', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (54, 4, 'Tool BI', 'Looker Studio: connect data, chart, filter, date range, blending', 'Wajib', 6, 'Google Looker Studio Help + YouTube', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (55, 4, 'Tool BI', 'Power BI dasar + DAX sederhana (pilih ini kalau perusahaan targetmu memakai Microsoft stack)', 'Opsional', 8, 'Microsoft Learn', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (56, 4, 'Tool BI', 'TUGAS: bangun 1 dashboard yang memantau tren pasar atau kompetitor industri fokus', 'Wajib', 6, 'Looker Studio', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (57, 4, 'Komunikasi', 'Menulis executive summary: kesimpulan di depan, lalu bukti, lalu rekomendasi', 'Wajib', 4, 'Latihan menulis 1 halaman', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (58, 4, 'Komunikasi', 'Struktur deck riset: pertanyaan - metode - temuan - implikasi bisnis', 'Wajib', 3, 'Contoh deck riset publik', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (59, 4, 'Komunikasi', 'Slide design dasar: hierarki, satu ide per slide, judul yang berisi kesimpulan', 'Penting', 3, 'Artikel + latihan', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (60, 4, 'Komunikasi', 'TUGAS: presentasi 5 menit temuan risetmu, rekam diri sendiri, evaluasi, ulangi', 'Wajib', 4, 'Rekaman HP', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (61, 5, 'Portofolio', 'PORTOFOLIO 1: Market landscape report 10-15 halaman + estimasi ukuran pasar beserta asumsinya', 'Wajib', 15, 'Gabungan output Fase 1 dan 3', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (62, 5, 'Portofolio', 'PORTOFOLIO 2: Competitor battlecard untuk 3 kompetitor (2 halaman per kompetitor)', 'Wajib', 8, 'Template battlecard', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (63, 5, 'Portofolio', 'PORTOFOLIO 3: Dashboard interaktif + dokumentasi sumber dan metodologi datanya', 'Wajib', 6, 'Output Fase 4', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (64, 5, 'Portofolio', 'Publikasikan ketiganya (Notion / Google Drive publik / GitHub) dan pastikan link bisa dibuka orang lain', 'Wajib', 3, 'Notion, Drive, GitHub', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (65, 5, 'Personal branding', 'CV 1 halaman berbasis hasil kerja, bukan daftar mata kuliah. Sertakan link portofolio', 'Wajib', 4, 'Template CV ATS-friendly', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (66, 5, 'Personal branding', 'LinkedIn: headline, About, dan section Projects diisi portofolio', 'Wajib', 3, 'LinkedIn', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (67, 5, 'Melamar', 'Riset 20 perusahaan target dan catat nama divisi yang relevan di masing-masing', 'Wajib', 4, 'Isi di sheet ''Target Perusahaan''', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (68, 5, 'Melamar', 'Latihan interview teknis: case market sizing dan guesstimate, kerjakan sambil bicara', 'Wajib', 5, 'Case book, latihan berpasangan', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (69, 5, 'Melamar', 'Latihan interview behavioral dengan metode STAR, siapkan 6 cerita', 'Wajib', 4, 'Latihan mandiri', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (70, 5, 'Melamar', 'Kirim lamaran batch 1 (10 perusahaan) dan catat statusnya', 'Wajib', 5, 'Sheet ''Target Perusahaan''', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (71, 5, 'Melamar', 'Networking: hubungi 5 praktisi atau alumni untuk coffee chat / referral', 'Penting', 4, 'LinkedIn, alumni kampus', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (72, 5, 'Melamar', 'Evaluasi tiap penolakan, perbaiki 1 hal, kirim lamaran batch berikutnya', 'Wajib', 4, 'Refleksi mingguan', 'Belum', '', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');

-- 4. SEED FLASHCARDS
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('CAGR', 'Compound Annual Growth Rate — tingkat pertumbuhan tahunan majemuk suatu nilai selama periode tertentu, dihitung (Nilai Akhir/Nilai Awal)^(1/tahun) - 1.', 'Finance', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('TAM', 'Total Addressable Market — total permintaan pasar untuk suatu produk/layanan jika 100% market share tercapai.', 'Market Sizing', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('SAM', 'Serviceable Addressable Market — bagian dari TAM yang bisa dijangkau oleh model bisnis dan segmen target tertentu.', 'Market Sizing', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('SOM', 'Serviceable Obtainable Market — bagian dari SAM yang realistis bisa direbut dalam jangka pendek-menengah.', 'Market Sizing', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('PESTEL', 'Framework analisis makro: Political, Economic, Social, Technological, Environmental, Legal.', 'Framework', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Five Forces', 'Framework Porter untuk menganalisis daya saing industri: rivalitas kompetitor, ancaman pendatang baru, daya tawar pemasok, daya tawar pembeli, ancaman produk substitusi.', 'Framework', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('ARPU', 'Average Revenue Per User — rata-rata pendapatan yang dihasilkan per pengguna dalam periode tertentu.', 'Metrics', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Churn Rate', 'Persentase pelanggan yang berhenti menggunakan produk/layanan dalam periode tertentu.', 'Metrics', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Market Share', 'Persentase penjualan suatu perusahaan dibandingkan total penjualan industri.', 'Metrics', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('YoY', 'Year over Year — perbandingan suatu metrik pada periode yang sama antar tahun.', 'Metrics', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Unit Economics', 'Analisis profitabilitas per unit dasar bisnis (mis. per pelanggan, per transaksi).', 'Finance', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Gross Margin', 'Persentase pendapatan yang tersisa setelah dikurangi harga pokok penjualan (COGS).', 'Finance', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('STP', 'Segmentation, Targeting, Positioning — proses menentukan segmen pasar, target, dan posisi produk.', 'Framework', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('SWOT', 'Strengths, Weaknesses, Opportunities, Threats — analisis kekuatan, kelemahan, peluang, dan ancaman.', 'Framework', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Business Model Canvas', 'Template strategis 9 blok untuk memetakan model bisnis: value proposition, customer segments, channels, dsb.', 'Framework', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Top-down Sizing', 'Metode market sizing dari angka makro (total industri) diturunkan ke segmen yang relevan.', 'Market Sizing', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Bottom-up Sizing', 'Metode market sizing dari jumlah pelanggan x frekuensi pembelian x harga rata-rata.', 'Market Sizing', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Weighted Average', 'Rata-rata yang memperhitungkan bobot/kepentingan relatif dari tiap nilai.', 'Statistics', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Margin of Error', 'Rentang perkiraan seberapa jauh hasil survei sampel bisa berbeda dari populasi sebenarnya.', 'Statistics', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('Correlation vs Causation', 'Dua variabel yang berkorelasi belum tentu satu menyebabkan yang lain — perlu bukti tambahan untuk klaim kausalitas.', 'Statistics', 1, '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');

-- 5. SEED DATA SOURCES
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('Badan Pusat Statistik (BPS)', 'https://www.bps.go.id', 'Pemerintah', 'Data statistik resmi nasional: ekonomi, demografi, industri', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('Bank Indonesia', 'https://www.bi.go.id', 'Pemerintah', 'Data moneter, inflasi, nilai tukar, sistem pembayaran', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('OJK', 'https://www.ojk.go.id', 'Pemerintah', 'Data statistik perbankan, fintech, dan pasar modal', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('Katadata Insight Center', 'https://katadata.co.id', 'Riset & Media', 'Laporan riset dan berita berbasis data industri Indonesia', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('DSInnovate', 'https://dailysocial.id/research', 'Riset & Media', 'Laporan startup dan tren digital Indonesia', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('IDX (Bursa Efek Indonesia)', 'https://www.idx.co.id', 'Pasar Modal', 'Annual report dan prospektus emiten untuk data industri', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('Statista', 'https://www.statista.com', 'Global', 'Data pasar global, gratis terbatas untuk ringkasan statistik', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('Google Trends', 'https://trends.google.com', 'Competitive Intelligence', 'Membandingkan minat pencarian brand/topik dari waktu ke waktu', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('Similarweb', 'https://www.similarweb.com', 'Competitive Intelligence', 'Estimasi traffic dan sumber trafik kompetitor', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');
INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('e-Conomy SEA (Google-Temasek)', 'https://economysea.withgoogle.com', 'Riset & Media', 'Laporan tahunan ekonomi digital Asia Tenggara', '2026-10-03T20:17:22.059Z', '2026-10-03T20:17:22.059Z');

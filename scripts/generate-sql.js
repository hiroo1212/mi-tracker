const fs = require('fs');
const path = require('path');

const ddl = fs.readFileSync(path.join(__dirname, '../drizzle/0000_sour_night_nurse.sql'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-tasks-source.json'), 'utf8'));

let sql = `-- =========================================================
-- MI TRACKER - SUPABASE FULL INITIALIZATION SCRIPT
-- Paste this script into Supabase SQL Editor and click 'Run'
-- =========================================================

-- 1. CREATE ALL TABLES
` + ddl.replace(/--> statement-breakpoint/g, '') + `\n\n`;

sql += `-- 2. SEED PHASES\n`;
for (const p of data.phases) {
  const name = p.name.replace(/'/g, "''");
  const period = p.target_period.replace(/'/g, "''");
  sql += `INSERT INTO phases (id, name, target_period, "order") VALUES (${p.id}, '${name}', '${period}', ${p.order}) ON CONFLICT (id) DO NOTHING;\n`;
}

sql += `\n-- 3. SEED TASKS\n`;
const now = new Date().toISOString();
for (const t of data.tasks) {
  const title = (t.title || '').replace(/'/g, "''");
  const topic = (t.topic || '').replace(/'/g, "''");
  const notes = (t.resource_notes || '').replace(/'/g, "''");
  sql += `INSERT INTO tasks (no, phase_id, topic, title, priority, estimated_hours, resource_notes, status, notes, created_at, updated_at) VALUES (${t.no}, ${t.phase_id}, '${topic}', '${title}', '${t.priority}', ${t.estimated_hours}, '${notes}', 'Belum', '', '${now}', '${now}');\n`;
}

// Flashcards from seed.ts
const flashcards = [
  { term: "CAGR", definition: "Compound Annual Growth Rate — tingkat pertumbuhan tahunan majemuk suatu nilai selama periode tertentu, dihitung (Nilai Akhir/Nilai Awal)^(1/tahun) - 1.", category: "Finance" },
  { term: "TAM", definition: "Total Addressable Market — total permintaan pasar untuk suatu produk/layanan jika 100% market share tercapai.", category: "Market Sizing" },
  { term: "SAM", definition: "Serviceable Addressable Market — bagian dari TAM yang bisa dijangkau oleh model bisnis dan segmen target tertentu.", category: "Market Sizing" },
  { term: "SOM", definition: "Serviceable Obtainable Market — bagian dari SAM yang realistis bisa direbut dalam jangka pendek-menengah.", category: "Market Sizing" },
  { term: "PESTEL", definition: "Framework analisis makro: Political, Economic, Social, Technological, Environmental, Legal.", category: "Framework" },
  { term: "Five Forces", definition: "Framework Porter untuk menganalisis daya saing industri: rivalitas kompetitor, ancaman pendatang baru, daya tawar pemasok, daya tawar pembeli, ancaman produk substitusi.", category: "Framework" },
  { term: "ARPU", definition: "Average Revenue Per User — rata-rata pendapatan yang dihasilkan per pengguna dalam periode tertentu.", category: "Metrics" },
  { term: "Churn Rate", definition: "Persentase pelanggan yang berhenti menggunakan produk/layanan dalam periode tertentu.", category: "Metrics" },
  { term: "Market Share", definition: "Persentase penjualan suatu perusahaan dibandingkan total penjualan industri.", category: "Metrics" },
  { term: "YoY", definition: "Year over Year — perbandingan suatu metrik pada periode yang sama antar tahun.", category: "Metrics" },
  { term: "Unit Economics", definition: "Analisis profitabilitas per unit dasar bisnis (mis. per pelanggan, per transaksi).", category: "Finance" },
  { term: "Gross Margin", definition: "Persentase pendapatan yang tersisa setelah dikurangi harga pokok penjualan (COGS).", category: "Finance" },
  { term: "STP", definition: "Segmentation, Targeting, Positioning — proses menentukan segmen pasar, target, dan posisi produk.", category: "Framework" },
  { term: "SWOT", definition: "Strengths, Weaknesses, Opportunities, Threats — analisis kekuatan, kelemahan, peluang, dan ancaman.", category: "Framework" },
  { term: "Business Model Canvas", definition: "Template strategis 9 blok untuk memetakan model bisnis: value proposition, customer segments, channels, dsb.", category: "Framework" },
  { term: "Top-down Sizing", definition: "Metode market sizing dari angka makro (total industri) diturunkan ke segmen yang relevan.", category: "Market Sizing" },
  { term: "Bottom-up Sizing", definition: "Metode market sizing dari jumlah pelanggan x frekuensi pembelian x harga rata-rata.", category: "Market Sizing" },
  { term: "Weighted Average", definition: "Rata-rata yang memperhitungkan bobot/kepentingan relatif dari tiap nilai.", category: "Statistics" },
  { term: "Margin of Error", definition: "Rentang perkiraan seberapa jauh hasil survei sampel bisa berbeda dari populasi sebenarnya.", category: "Statistics" },
  { term: "Correlation vs Causation", definition: "Dua variabel yang berkorelasi belum tentu satu menyebabkan yang lain — perlu bukti tambahan untuk klaim kausalitas.", category: "Statistics" },
];

sql += `\n-- 4. SEED FLASHCARDS\n`;
for (const f of flashcards) {
  const term = f.term.replace(/'/g, "''");
  const def = f.definition.replace(/'/g, "''");
  const cat = f.category.replace(/'/g, "''");
  sql += `INSERT INTO flashcards (term, definition, category, confidence_level, created_at, updated_at) VALUES ('${term}', '${def}', '${cat}', 1, '${now}', '${now}');\n`;
}

// Data sources from seed.ts
const dataSources = [
  { name: "Badan Pusat Statistik (BPS)", url: "https://www.bps.go.id", category: "Pemerintah", personal_note: "Data statistik resmi nasional: ekonomi, demografi, industri" },
  { name: "Bank Indonesia", url: "https://www.bi.go.id", category: "Pemerintah", personal_note: "Data moneter, inflasi, nilai tukar, sistem pembayaran" },
  { name: "OJK", url: "https://www.ojk.go.id", category: "Pemerintah", personal_note: "Data statistik perbankan, fintech, dan pasar modal" },
  { name: "Katadata Insight Center", url: "https://katadata.co.id", category: "Riset & Media", personal_note: "Laporan riset dan berita berbasis data industri Indonesia" },
  { name: "DSInnovate", url: "https://dailysocial.id/research", category: "Riset & Media", personal_note: "Laporan startup dan tren digital Indonesia" },
  { name: "IDX (Bursa Efek Indonesia)", url: "https://www.idx.co.id", category: "Pasar Modal", personal_note: "Annual report dan prospektus emiten untuk data industri" },
  { name: "Statista", url: "https://www.statista.com", category: "Global", personal_note: "Data pasar global, gratis terbatas untuk ringkasan statistik" },
  { name: "Google Trends", url: "https://trends.google.com", category: "Competitive Intelligence", personal_note: "Membandingkan minat pencarian brand/topik dari waktu ke waktu" },
  { name: "Similarweb", url: "https://www.similarweb.com", category: "Competitive Intelligence", personal_note: "Estimasi traffic dan sumber trafik kompetitor" },
  { name: "e-Conomy SEA (Google-Temasek)", url: "https://economysea.withgoogle.com", category: "Riset & Media", personal_note: "Laporan tahunan ekonomi digital Asia Tenggara" },
];

sql += `\n-- 5. SEED DATA SOURCES\n`;
for (const d of dataSources) {
  const name = d.name.replace(/'/g, "''");
  const url = d.url.replace(/'/g, "''");
  const cat = d.category.replace(/'/g, "''");
  const pNote = d.personal_note.replace(/'/g, "''");
  sql += `INSERT INTO data_sources (name, url, category, personal_note, created_at, updated_at) VALUES ('${name}', '${url}', '${cat}', '${pNote}', '${now}', '${now}');\n`;
}

const outputPath = path.join(__dirname, '../supabase-init.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Successfully generated:', outputPath, 'Total characters:', sql.length);

// Static "cheat sheet" content for the /referensi page.
// Written in simple Bahasa Indonesia for someone brand new to Market Intelligence.
// Body strings use the same lightweight markdown supported by lib/markdown.ts.

export type ReferenceSection = {
  slug: string;
  title: string;
  body: string;
};

export type ReferenceGroup = {
  phaseNo: number;
  phaseName: string;
  intro: string;
  sections: ReferenceSection[];
};

export const REFERENCE_GROUPS: ReferenceGroup[] = [
  {
    phaseNo: 0,
    phaseName: "Fase 0 - Orientasi",
    intro:
      "Sebelum belajar tools dan framework, kenali dulu medan perangnya: apa itu Market Intelligence dan bedanya dengan istilah-istilah mirip yang sering bikin bingung.",
    sections: [
      {
        slug: "mi-vs-lainnya",
        title: "Market Intelligence vs istilah-istilah mirip",
        body: `Empat istilah ini sering ketuker. Bayangkan kamu kerja di perusahaan kopi kemasan:

- **Market Research** — riset spesifik untuk satu pertanyaan, biasanya sekali jalan. Contoh: "Apakah pasar suka rasa kopi baru kita?" lewat survei ke 200 orang.
- **Market Intelligence (MI)** — proses berkelanjutan memantau *pasar secara keseluruhan*: ukuran pasar, tren, regulasi, perilaku konsumen. Tidak berhenti setelah satu laporan, jalan terus tiap bulan/kuartal.
- **Competitive Intelligence (CI)** — bagian dari MI yang fokus ke kompetitor: harga mereka, produk baru mereka, strategi marketing mereka.
- **Business Intelligence (BI)** — lebih ke *data internal* perusahaan (penjualan, operasional) yang divisualisasikan jadi dashboard. MI lebih banyak lihat ke luar (eksternal), BI lebih banyak lihat ke dalam (internal).

**Analogi sederhana:** kalau perusahaan itu kapal, BI adalah radar mesin kapal (kondisi internal), MI adalah radar cuaca dan kapal lain di sekitar (kondisi luar), CI adalah teropong khusus mengintai kapal pesaing, dan Market Research adalah satu kali kamu kirim pengintai ke satu titik untuk jawab satu pertanyaan.`,
      },
      {
        slug: "baca-jd",
        title: "Cara baca job description MI",
        body: `Saat kamu kumpulkan 5 JD di tugas #1, perhatikan pola yang biasanya muncul:

- **Hard skill** yang sering diminta: Excel/Spreadsheet, SQL dasar, PowerPoint/slide, kadang Python atau tool BI (Power BI/Tableau/Looker Studio).
- **Soft skill**: analytical thinking, komunikasi tertulis (nulis laporan), rasa ingin tahu (curiosity).
- **Tanggung jawab** yang umum: riset pasar & kompetitor, bikin laporan/dashboard, dukung tim strategi/marketing dengan data.

Catat skill yang paling sering muncul di 5 JD kamu — itu yang harus paling diprioritaskan waktu belajar.`,
      },
    ],
  },
  {
    phaseNo: 1,
    phaseName: "Fase 1 - Fondasi Bisnis",
    intro:
      "Framework di fase ini adalah 'kacamata' yang dipakai analis MI untuk melihat industri. Tidak perlu hafal semua sekaligus — pahami konsepnya, lalu latih langsung ke industri fokus kamu.",
    sections: [
      {
        slug: "istilah-bisnis",
        title: "Istilah bisnis dasar (wajib hafal)",
        body: `- **Revenue** — total uang masuk dari penjualan, sebelum dikurangi biaya apa pun.
- **Gross Margin** — persentase revenue yang tersisa setelah dikurangi biaya produksi (COGS). Rumus: \`(Revenue - COGS) / Revenue x 100%\`.
- **Market Share** — porsi penjualan perusahaan dibanding total penjualan industri. Contoh: kalau total pasar kopi kemasan Rp 10 T dan penjualan brand kamu Rp 1 T, market share-nya 10%.
- **CAGR (Compound Annual Growth Rate)** — rata-rata pertumbuhan tahunan yang "dihaluskan" selama beberapa tahun. Rumus: \`(Nilai Akhir / Nilai Awal)^(1/jumlah tahun) - 1\`.
- **YoY (Year over Year)** — perbandingan angka tahun ini vs tahun lalu di periode yang sama. Contoh: "penjualan Q1 2026 naik 12% YoY" artinya naik 12% dibanding Q1 2025.
- **Unit Economics** — untung/rugi dihitung per satu unit (per pelanggan, per transaksi, per produk), bukan total perusahaan.
- **ARPU (Average Revenue Per User)** — rata-rata pendapatan per pengguna. Rumus: \`Total Revenue / Jumlah User\`.`,
      },
      {
        slug: "pestel",
        title: "PESTEL — memindai lingkungan makro",
        body: `PESTEL dipakai untuk melihat faktor-faktor besar di luar kendali perusahaan yang bisa mempengaruhi industri. Enam dimensinya:

- **Political** — kebijakan pemerintah, stabilitas politik, pajak, regulasi impor/ekspor.
- **Economic** — inflasi, suku bunga, nilai tukar, daya beli masyarakat.
- **Social** — tren gaya hidup, demografi, kebiasaan konsumen.
- **Technological** — adopsi teknologi baru, otomasi, disrupsi digital.
- **Environmental** — isu lingkungan, keberlanjutan (sustainability), regulasi emisi.
- **Legal** — undang-undang ketenagakerjaan, perlindungan konsumen, hak kekayaan intelektual.

**Cara latihan:** ambil industri fokus kamu, isi minimal 1-2 poin nyata di tiap dimensi. Kalau ada dimensi yang kosong, itu tandanya perlu riset lebih jauh, bukan berarti "tidak relevan".`,
      },
      {
        slug: "five-forces",
        title: "Porter's Five Forces — seberapa 'keras' persaingan industri",
        body: `Framework ini menjawab: seberapa mudah perusahaan di industri ini menghasilkan profit jangka panjang? Lima kekuatannya:

1. **Rivalitas kompetitor** — makin banyak pemain kuat yang mirip-mirip, makin sengit perang harga.
2. **Ancaman pendatang baru** — kalau gampang banget masuk industri ini (modal kecil, tidak butuh izin rumit), pemain lama gampang tergerus.
3. **Daya tawar pemasok (supplier)** — kalau bahan baku cuma bisa dari 1-2 supplier, mereka bisa dikte harga.
4. **Daya tawar pembeli (buyer)** — kalau pembeli gampang pindah ke kompetitor lain, mereka punya kuasa nekan harga.
5. **Ancaman produk substitusi** — produk beda tapi fungsinya mirip (mis. teh vs kopi buat "minuman penambah energi pagi").

**Latihan:** untuk industri fokus kamu, tentukan force mana yang paling menekan — itu biasanya jadi tantangan utama industri tersebut.`,
      },
      {
        slug: "swot-tows",
        title: "SWOT dan TOWS — dari analisis ke rekomendasi",
        body: `**SWOT** memetakan 4 hal:
- **Strengths** (kekuatan internal), **Weaknesses** (kelemahan internal) — dari dalam perusahaan.
- **Opportunities** (peluang eksternal), **Threats** (ancaman eksternal) — dari luar perusahaan (sering diambil dari hasil PESTEL & Five Forces kamu).

Masalahnya, SWOT sering cuma jadi daftar tanpa kesimpulan. Di sinilah **TOWS matrix** dipakai: silangkan tiap kombinasi jadi strategi konkret.

- Strength + Opportunity → strategi "menyerang" (pakai kekuatan untuk kejar peluang)
- Weakness + Opportunity → strategi "perbaikan" (benahi kelemahan supaya bisa ambil peluang)
- Strength + Threat → strategi "bertahan" (pakai kekuatan untuk redam ancaman)
- Weakness + Threat → strategi "defensif" (minimalkan risiko, hindari area rawan)`,
      },
      {
        slug: "stp",
        title: "STP — Segmentation, Targeting, Positioning",
        body: `- **Segmentation** — bagi pasar jadi kelompok-kelompok dengan kebutuhan mirip (mis. berdasarkan usia, pendapatan, gaya hidup, lokasi).
- **Targeting** — pilih segmen mana yang paling menguntungkan dan realistis untuk dilayani.
- **Positioning** — tentukan "posisi" produk di benak konsumen dibanding kompetitor — biasanya digambarkan lewat **positioning map**: 2 sumbu (mis. harga vs kualitas), lalu taruh brand kamu dan kompetitor di sana untuk lihat celah pasar yang belum terisi.`,
      },
      {
        slug: "bmc-4p",
        title: "Business Model Canvas & Marketing Mix (4P/7P)",
        body: `**Business Model Canvas (BMC)** — 9 blok yang memetakan cara perusahaan menghasilkan uang: Customer Segments, Value Proposition, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure.

**Marketing Mix 4P** (produk fisik) / **7P** (tambahan untuk jasa):
- Product, Price, Place, Promotion
- (7P menambah) People, Process, Physical Evidence

Kegunaannya di MI: dipakai untuk membedah *bagaimana* kompetitor menjalankan bisnisnya, bukan cuma *seberapa besar* pasar mereka.`,
      },
    ],
  },
  {
    phaseNo: 2,
    phaseName: "Fase 2 - Data & Spreadsheet",
    intro:
      "Ini fase paling teknis — anggap sebagai 'alat pertukangan' analis MI. Excel dan SQL dipakai hampir di setiap tugas riset nyata.",
    sections: [
      {
        slug: "excel-fungsi",
        title: "Cheat sheet fungsi Excel yang paling sering dipakai",
        body: `- \`=SUM(range)\` / \`=AVERAGE(range)\` — total dan rata-rata.
- \`=IF(kondisi, jika_benar, jika_salah)\` — logika sederhana. \`=IFS(...)\` untuk banyak kondisi sekaligus.
- \`=IFERROR(formula, nilai_jika_error)\` — sembunyikan error jadi nilai yang rapi.
- \`=COUNTIF(range, kriteria)\` / \`=SUMIF(range, kriteria, sum_range)\` — hitung/jumlah berdasarkan 1 syarat. Tambah "S" (\`COUNTIFS\`/\`SUMIFS\`) untuk banyak syarat.
- \`=INDEX(MATCH(...))\` — pengganti VLOOKUP yang lebih fleksibel karena bisa cari ke kiri dan tidak rusak kalau kolom digeser. Pola: \`=INDEX(kolom_hasil, MATCH(nilai_dicari, kolom_kunci, 0))\`.
- **Absolute reference** (\`$A$1\`) — kunci sel supaya tidak ikut bergeser saat formula di-drag/copy.
- **PivotTable** — cara tercepat merangkum ribuan baris data jadi tabel ringkas (mis. total penjualan per kategori per bulan) tanpa nulis formula sama sekali.`,
      },
      {
        slug: "statistik-dasar",
        title: "Statistik terapan yang wajib dipahami",
        body: `- **Mean vs Median** — mean (rata-rata) gampang "ditarik" outlier. Kalau ada 1 miliuner di antara 99 orang biasa, mean pendapatan jadi menyesatkan; median lebih jujur menggambarkan "orang di tengah".
- **Outlier** — data yang jauh beda dari yang lain; wajib dicek dulu apakah itu kesalahan input atau memang kondisi nyata sebelum dibuang.
- **Margin of Error** — rentang ketidakpastian hasil survei. Survei ke 30 orang punya margin of error jauh lebih besar daripada survei ke 1000 orang — jangan generalisasi berlebihan dari sampel kecil.
- **Korelasi ≠ Kausalitas** — dua hal bergerak bareng bukan berarti satu menyebabkan yang lain. Contoh klasik: penjualan es krim dan kasus tenggelam sama-sama naik di musim panas — bukan berarti es krim menyebabkan tenggelam (penyebab sebenarnya: cuaca panas).
- **Weighted Average** — rata-rata yang memperhitungkan bobot. Dipakai kalau tiap data punya "kepentingan" berbeda (mis. rata-rata harga tertimbang volume penjualan).`,
      },
      {
        slug: "sql-cheat-sheet",
        title: "Cheat sheet SQL dasar",
        body: `\`\`\`
SELECT kolom1, kolom2
FROM tabel
WHERE kondisi
GROUP BY kolom1
HAVING kondisi_setelah_grouping
ORDER BY kolom1 DESC
LIMIT 10;
\`\`\`

- **WHERE** menyaring baris *sebelum* dikelompokkan; **HAVING** menyaring *setelah* di-\`GROUP BY\`.
- **JOIN** menggabungkan 2 tabel berdasarkan kolom kunci yang sama:
\`\`\`
SELECT a.nama, b.total_transaksi
FROM pelanggan a
LEFT JOIN transaksi b ON a.id = b.pelanggan_id;
\`\`\`
- Selalu cek jumlah baris sebelum & sesudah JOIN — kalau baris tiba-tiba jadi lebih banyak, biasanya ada duplikat kunci di salah satu tabel.
- **Window function** (\`ROW_NUMBER()\`, \`RANK()\`, \`SUM() OVER (...)\`) berguna untuk hitung ranking atau running total tanpa menghilangkan baris detail — beda dengan \`GROUP BY\` yang meringkas jadi lebih sedikit baris.`,
      },
    ],
  },
  {
    phaseNo: 3,
    phaseName: "Fase 3 - Riset & Sumber Data",
    intro:
      "Inti pekerjaan MI ada di sini: dari mana data diambil, dan bagaimana mengubahnya jadi estimasi ukuran pasar yang bisa dipertanggungjawabkan.",
    sections: [
      {
        slug: "market-sizing",
        title: "Market Sizing: Top-down, Bottom-up, dan TAM/SAM/SOM",
        body: `**Top-down** — mulai dari angka besar (makro), lalu dipersempit ke segmen kamu.
Contoh: total belanja F&B Indonesia Rp 500 T → porsi kopi kemasan diperkirakan 4% → estimasi pasar kopi kemasan ≈ Rp 20 T.

**Bottom-up** — mulai dari unit terkecil, dikalikan naik.
Rumus: \`Jumlah pelanggan potensial x Frekuensi beli per tahun x Harga rata-rata\`.
Contoh: 5 juta target konsumen x 24x beli/tahun x Rp 15.000 = Rp 1,8 T.

**TAM / SAM / SOM** — corong 3 tingkat untuk mengukur peluang bisnis:
- **TAM (Total Addressable Market)** — total permintaan kalau kamu kuasai 100% pasar global/nasional untuk kategori itu.
- **SAM (Serviceable Addressable Market)** — bagian TAM yang benar-benar bisa dijangkau model bisnis & segmen kamu (mis. cuma kota besar, cuma platform online).
- **SOM (Serviceable Obtainable Market)** — bagian SAM yang realistis bisa direbut dalam 1-3 tahun ke depan, mempertimbangkan kompetitor dan kapasitas.

**Kunci audit-able:** setiap angka WAJIB disertai asumsi tertulis (dari mana angka itu, kenapa segitu) — supaya orang lain bisa mengecek dan mendebat asumsinya, bukan cuma percaya angka mentah-mentah. Ini persis kenapa Kalkulator Market Sizing di app ini mewajibkan kolom asumsi diisi.`,
      },
      {
        slug: "sumber-data-id",
        title: "Peta sumber data Indonesia",
        body: `- **BPS (bps.go.id)** — data statistik resmi paling lengkap: ekonomi, demografi, industri, harga.
- **Bank Indonesia** — data moneter: inflasi, suku bunga, nilai tukar.
- **OJK** — statistik perbankan, fintech, pasar modal.
- **IDX (idx.co.id)** — laporan tahunan (annual report) & prospektus emiten, sumber emas untuk data industri riil dari perusahaan publik.
- **Asosiasi industri** (GAPMMI untuk makanan-minuman, AFTECH untuk fintech, dll) — sering rilis laporan tren khusus industri mereka.
- **Katadata Insight Center / DSInnovate** — riset & berita berbasis data pasar Indonesia, biasanya lebih mudah dibaca daripada laporan pemerintah mentah.
- **Statista / McKinsey / Bain (versi publik)** — data & insight global, sebagian gratis terbatas, cocok untuk pembanding internasional.`,
      },
      {
        slug: "competitive-intelligence",
        title: "Tools competitive intelligence & sinyal tersembunyi",
        body: `- **Google Trends** — bandingkan volume pencarian antar brand dari waktu ke waktu, bagus untuk lihat musiman dan momentum brand.
- **Similarweb** — estimasi traffic website kompetitor dan dari mana traffic itu datang (search, sosial media, direct).
- **Meta Ad Library** — lihat semua iklan yang sedang tayang dari akun Facebook/Instagram kompetitor, termasuk pesan marketing yang mereka pakai.
- **Google Alerts + Feedly (RSS)** — pantau berita kompetitor otomatis tanpa harus cek manual tiap hari.
- **Sinyal "tersembunyi"** yang sering dilupakan pemula: rating & isi review di Play Store/App Store (menunjukkan keluhan produk nyata), dan lowongan kerja kompetitor di LinkedIn (perusahaan yang buka banyak posisi "growth" biasanya sedang ekspansi agresif).`,
      },
      {
        slug: "riset-primer",
        title: "Riset primer: kuesioner & wawancara",
        body: `- Hindari **leading question** (pertanyaan yang menggiring jawaban): "Bukankah produk kami lebih enak?" ❌ → "Bagaimana pendapatmu soal rasa produk kami?" ✅
- Hindari **double-barreled question** (2 pertanyaan digabung jadi 1): "Apakah harga dan kualitasnya bagus?" ❌ — pisahkan jadi 2 pertanyaan.
- **Skala Likert** yang benar: pakai skala ganjil (1-5) dengan label jelas di tiap ujung (mis. "Sangat Tidak Setuju" s/d "Sangat Setuju"), jangan cuma angka tanpa label.
- **In-depth interview** cocok untuk gali "kenapa" secara mendalam (kualitatif); **survei** cocok untuk mengukur "berapa banyak" (kuantitatif). Idealnya dipakai berdampingan.`,
      },
    ],
  },
  {
    phaseNo: 4,
    phaseName: "Fase 4 - Visualisasi & Storytelling",
    intro:
      "Riset sebagus apa pun percuma kalau tidak bisa disampaikan. Fase ini soal mengubah angka jadi keputusan yang dipahami orang lain dalam 30 detik pertama.",
    sections: [
      {
        slug: "prinsip-chart",
        title: "Prinsip memilih grafik",
        body: `- **Satu pesan per grafik** — kalau grafikmu butuh dijelaskan panjang lebar, biasanya itu tandanya grafiknya kurang tepat, bukan penjelasannya kurang panjang.
- **Kapan pakai apa:**
  - **Bar chart** — bandingkan antar kategori (mis. market share tiap brand).
  - **Line chart** — tunjukkan tren dari waktu ke waktu (mis. pertumbuhan pasar per tahun).
  - **Combo/dual axis** — dua metrik beda satuan dalam satu grafik (mis. revenue vs jumlah pelanggan), pakai hati-hati karena mudah menyesatkan.
- **Hindari pie chart** untuk lebih dari 4-5 kategori — mata manusia buruk membandingkan sudut, bar chart hampir selalu lebih jelas.
- Buang "chart junk": efek 3D, terlalu banyak warna, gridline berlebihan — semuanya cuma menambah noise, bukan informasi.`,
      },
      {
        slug: "executive-summary",
        title: "Struktur Executive Summary & deck riset",
        body: `Analis MI menulis dengan gaya **"kesimpulan dulu, baru bukti"** (top-down / pyramid principle) — kebalikan dari esai sekolah yang membangun argumen pelan-pelan.

**Struktur Executive Summary (1 halaman):**
1. Kesimpulan / rekomendasi utama (1-2 kalimat di paling atas)
2. Bukti pendukung (3-4 poin data kunci)
3. Rekomendasi tindak lanjut (apa yang harus dilakukan pembaca)

**Struktur deck riset:**
Pertanyaan (apa yang ingin dijawab) → Metode (bagaimana cara mencari tahu) → Temuan (apa hasilnya) → Implikasi bisnis (jadi apa artinya buat perusahaan).

**Tips judul slide:** judul slide sebaiknya sudah berisi *kesimpulan* slide itu, bukan cuma label topik. "Pasar kopi RTD tumbuh 18% tapi didominasi 2 brand" jauh lebih kuat daripada judul generik "Analisis Pasar Kopi RTD".`,
      },
    ],
  },
  {
    phaseNo: 5,
    phaseName: "Fase 5 - Portofolio & Melamar",
    intro:
      "Semua skill di fase sebelumnya sekarang dikemas jadi bukti nyata (portofolio) dan dijual ke recruiter. Ini fase paling dekat dengan tujuan akhir: dapat magang.",
    sections: [
      {
        slug: "guesstimate",
        title: "Cara menjawab soal 'guesstimate' / market sizing interview",
        body: `Soal seperti "Berapa besar pasar payung di Jakarta?" bukan tes menghafal angka — ini tes *cara berpikir terstruktur*. Langkah amannya:

1. **Klarifikasi** dulu cakupannya (payung untuk siapa? hujan atau semua musim? beli baru atau termasuk yang sudah punya?).
2. **Pilih pendekatan** — top-down (populasi Jakarta → persentase yang beli payung per tahun) atau bottom-up (jumlah toko yang jual payung x rata-rata penjualan per toko).
3. **Bulatkan angka** biar gampang dihitung di kepala (10 juta penduduk, bukan 10.564.321).
4. **Ucapkan asumsi keras-keras** sambil menghitung — interviewer menilai proses berpikirmu, bukan cuma angka akhir.
5. **Sanity check** — apakah hasil akhirnya masuk akal dibanding intuisi kasar? Kalau hasilnya "pasar payung Jakarta Rp 500 T", itu jelas kebesaran dan perlu dicek ulang asumsinya.`,
      },
      {
        slug: "star-method",
        title: "Metode STAR untuk interview behavioral",
        body: `Dipakai untuk jawab pertanyaan seperti "Ceritakan saat kamu menghadapi deadline ketat":

- **Situation** — konteks singkat (kapan, di mana, apa situasinya).
- **Task** — tanggung jawab/tantangan spesifik kamu di situasi itu.
- **Action** — langkah konkret yang KAMU lakukan (pakai "saya", bukan "kami").
- **Result** — hasil terukur kalau bisa (angka, waktu, dampak).

Siapkan 6 cerita STAR yang mencakup: kegagalan, konflik tim, deadline ketat, inisiatif tanpa diminta, belajar hal baru cepat, dan kepemimpinan/pengaruh ke orang lain.`,
      },
      {
        slug: "portofolio-cv",
        title: "Portofolio & CV yang dilirik recruiter MI",
        body: `**3 portofolio inti** yang paling relevan untuk role MI:
1. Market landscape report (ukuran pasar + framework analisis)
2. Competitor battlecard (perbandingan 2-3 kompetitor)
3. Dashboard interaktif dengan dokumentasi sumber data

**CV 1 halaman:** tulis berbasis *hasil kerja* ("Membuat estimasi TAM/SAM/SOM industri kopi RTD Indonesia menggunakan data BPS & IDX"), bukan daftar mata kuliah. Sertakan link ke portofolio di bagian paling atas CV supaya recruiter langsung bisa klik.`,
      },
    ],
  },
];

// Maps known source names (as written in the roadmap's "resource_notes" free text)
// to a real URL, so the Roadmap page can render clickable links instead of plain text.

const SOURCE_LINKS: Record<string, string> = {
  "linkedin jobs": "https://www.linkedin.com/jobs",
  "linkedin post": "https://www.linkedin.com",
  linkedin: "https://www.linkedin.com",
  glints: "https://glints.com",
  kalibrr: "https://www.kalibrr.com",
  dealls: "https://dealls.com",
  investopedia: "https://www.investopedia.com",
  "harvard business review": "https://hbr.org",
  "video porter": "https://www.youtube.com/results?search_query=porter+five+forces",
  strategyzer: "https://www.strategyzer.com",
  "artikel bmc": "https://www.strategyzer.com/canvas/business-model-canvas",
  "e-conomy sea": "https://economysea.withgoogle.com",
  "katadata insight center": "https://katadata.co.id",
  katadata: "https://katadata.co.id",
  dsinnovate: "https://dailysocial.id/research",
  "idx.co.id": "https://www.idx.co.id",
  "situs ir perusahaan": "https://www.idx.co.id",
  "excel is fun": "https://www.youtube.com/user/ExcelIsFun",
  "kelas excel": "https://www.youtube.com/results?search_query=kelas+excel+indonesia",
  "khan academy": "https://www.khanacademy.org/math/statistics-probability",
  sqlbolt: "https://sqlbolt.com",
  "mode sql tutorial": "https://mode.com/sql-tutorial/",
  "db fiddle": "https://www.db-fiddle.com",
  "bps.go.id": "https://www.bps.go.id",
  bps: "https://www.bps.go.id",
  kaggle: "https://www.kaggle.com",
  "data jakarta": "https://data.jakarta.go.id",
  "bank indonesia": "https://www.bi.go.id",
  ojk: "https://www.ojk.go.id",
  kemenperin: "https://kemenperin.go.id",
  kemendag: "https://www.kemendag.go.id",
  gapmmi: "https://gapmmi.or.id",
  aftech: "https://fintech.id",
  statista: "https://www.statista.com",
  mckinsey: "https://www.mckinsey.com",
  bain: "https://www.bain.com",
  "trends.google.com": "https://trends.google.com",
  "google trends": "https://trends.google.com",
  "similarweb.com": "https://www.similarweb.com",
  similarweb: "https://www.similarweb.com",
  "facebook.com/ads/library": "https://www.facebook.com/ads/library",
  "meta ad library": "https://www.facebook.com/ads/library",
  "google.com/alerts": "https://www.google.com/alerts",
  "google alerts": "https://www.google.com/alerts",
  feedly: "https://feedly.com",
  "play store": "https://play.google.com/store",
  "kaggle learn pandas": "https://www.kaggle.com/learn/pandas",
  beautifulsoup: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/",
  "looker studio": "https://lookerstudio.google.com",
  "google looker studio help": "https://support.google.com/looker-studio",
  "microsoft learn": "https://learn.microsoft.com",
  notion: "https://www.notion.so",
  "google drive": "https://drive.google.com",
  drive: "https://drive.google.com",
  github: "https://github.com",
  "google calendar": "https://calendar.google.com",
  "google forms": "https://forms.google.com",
};

export type ResourceChip = { label: string; url: string | null };

function findUrl(fragment: string): string | null {
  const key = fragment.toLowerCase().trim();
  if (!key) return null;
  if (SOURCE_LINKS[key]) return SOURCE_LINKS[key];
  const hit = Object.keys(SOURCE_LINKS).find((k) => key.includes(k));
  return hit ? SOURCE_LINKS[hit] : null;
}

// Splits a free-text resource_notes string ("LinkedIn, Glints, Kalibrr, Dealls")
// into chips, resolving a URL for each fragment when one is known.
export function resolveResourceLinks(text: string | null | undefined): ResourceChip[] {
  if (!text) return [];
  return text
    .split(/[,/]|(?:\s+\+\s+)/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label) => ({ label, url: findUrl(label) }));
}

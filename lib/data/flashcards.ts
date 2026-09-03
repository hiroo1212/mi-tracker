import { sqlite } from "@/lib/db/client";

export type FlashcardRow = {
  id: number;
  term: string;
  definition: string;
  category: string;
  last_reviewed_at: string | null;
  confidence_level: number;
};

export function getFlashcards(): FlashcardRow[] {
  return sqlite.prepare(`SELECT * FROM flashcards ORDER BY category ASC, term ASC`).all() as FlashcardRow[];
}

/** Cards prioritized by low confidence first, then oldest/never reviewed first. */
export function getStudyQueue(): FlashcardRow[] {
  const rows = getFlashcards();
  return [...rows].sort((a, b) => {
    if (a.confidence_level !== b.confidence_level) return a.confidence_level - b.confidence_level;
    const aTime = a.last_reviewed_at ? new Date(a.last_reviewed_at).getTime() : 0;
    const bTime = b.last_reviewed_at ? new Date(b.last_reviewed_at).getTime() : 0;
    return aTime - bTime;
  });
}

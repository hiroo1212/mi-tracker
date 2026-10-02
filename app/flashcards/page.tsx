import { getFlashcards, getStudyQueue } from "@/lib/data/flashcards";
import { FlashcardsView } from "./FlashcardsView";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
  const [cards, queue] = await Promise.all([getFlashcards(), getStudyQueue()]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Flashcards</h1>
        <p className="text-sm text-foreground-muted">Latih istilah Market Intelligence, prioritas otomatis untuk kartu yang belum kamu kuasai.</p>
      </div>
      <FlashcardsView cards={cards} queue={queue} />
    </div>
  );
}

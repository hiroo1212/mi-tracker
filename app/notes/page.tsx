import { getNotes, getTasksForLinking } from "@/lib/data/notes";
import { NotesView } from "./NotesView";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const [notes, tasks] = await Promise.all([getNotes(), getTasksForLinking()]);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bank Catatan</h1>
        <p className="text-sm text-foreground-muted">Catatan markdown, bisa dikaitkan ke tugas roadmap.</p>
      </div>
      <NotesView notes={notes} tasks={tasks} />
    </div>
  );
}

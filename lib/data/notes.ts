import { sqlite, ensureSeeded } from "@/lib/db/client";

export type NoteRow = {
  id: number;
  title: string;
  content: string;
  tags: string;
  related_task_id: number | null;
  task_title: string | null;
  created_at: string;
  updated_at: string;
};

export async function getNotes(query?: string): Promise<NoteRow[]> {
  await ensureSeeded();
  if (query && query.trim()) {
    const like = `%${query.trim()}%`;
    return (await sqlite
      .prepare(
        `SELECT n.*, t.title as task_title FROM notes n
         LEFT JOIN tasks t ON t.id = n.related_task_id
         WHERE n.title LIKE ? OR n.content LIKE ? OR n.tags LIKE ?
         ORDER BY n.updated_at DESC`
      )
      .all(like, like, like)) as NoteRow[];
  }
  return (await sqlite
    .prepare(
      `SELECT n.*, t.title as task_title FROM notes n
       LEFT JOIN tasks t ON t.id = n.related_task_id
       ORDER BY n.updated_at DESC`
    )
    .all()) as NoteRow[];
}

export async function getTasksForLinking() {
  return (await sqlite.prepare(`SELECT id, title FROM tasks ORDER BY no ASC`).all()) as { id: number; title: string }[];
}

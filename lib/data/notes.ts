import { sqlite } from "@/lib/db/client";

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

export function getNotes(query?: string): NoteRow[] {
  if (query && query.trim()) {
    const like = `%${query.trim()}%`;
    return sqlite
      .prepare(
        `SELECT n.*, t.title as task_title FROM notes n
         LEFT JOIN tasks t ON t.id = n.related_task_id
         WHERE n.title LIKE ? OR n.content LIKE ? OR n.tags LIKE ?
         ORDER BY n.updated_at DESC`
      )
      .all(like, like, like) as NoteRow[];
  }
  return sqlite
    .prepare(
      `SELECT n.*, t.title as task_title FROM notes n
       LEFT JOIN tasks t ON t.id = n.related_task_id
       ORDER BY n.updated_at DESC`
    )
    .all() as NoteRow[];
}

export function getTasksForLinking() {
  return sqlite.prepare(`SELECT id, title FROM tasks ORDER BY no ASC`).all() as { id: number; title: string }[];
}

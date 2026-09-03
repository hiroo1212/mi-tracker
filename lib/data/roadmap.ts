import { sqlite } from "@/lib/db/client";

export type RoadmapTask = {
  id: number;
  no: number;
  phase_id: number;
  topic: string;
  title: string;
  priority: string;
  estimated_hours: number;
  resource_notes: string;
  status: string;
  notes: string;
  note_count: number;
};

export type RoadmapPhase = {
  id: number;
  name: string;
  targetPeriod: string;
  order: number;
  tasks: RoadmapTask[];
};

export function getRoadmap(): RoadmapPhase[] {
  const phases = sqlite
    .prepare(`SELECT id, name, target_period as targetPeriod, "order" as "order" FROM phases ORDER BY "order" ASC`)
    .all() as { id: number; name: string; targetPeriod: string; order: number }[];

  const tasks = sqlite
    .prepare(
      `SELECT t.id, t.no, t.phase_id, t.topic, t.title, t.priority, t.estimated_hours, t.resource_notes,
              t.status, t.notes,
              (SELECT COUNT(*) FROM notes n WHERE n.related_task_id = t.id) as note_count
       FROM tasks t ORDER BY t.no ASC`
    )
    .all() as RoadmapTask[];

  return phases.map((p) => ({
    ...p,
    tasks: tasks.filter((t) => t.phase_id === p.id),
  }));
}

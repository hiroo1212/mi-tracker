import { getRoadmap } from "@/lib/data/roadmap";
import { RoadmapView } from "./RoadmapView";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const phases = await getRoadmap();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roadmap</h1>
        <p className="text-sm text-foreground-muted">72 tugas belajar Market Intelligence, dikelompokkan per fase.</p>
      </div>
      <RoadmapView phases={phases} />
    </div>
  );
}

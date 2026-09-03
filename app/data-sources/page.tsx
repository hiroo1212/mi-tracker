import { sqlite } from "@/lib/db/client";
import { DataSourcesView, type DataSourceRow } from "./DataSourcesView";

export const dynamic = "force-dynamic";

export default function DataSourcesPage() {
  const sources = sqlite.prepare(`SELECT * FROM data_sources ORDER BY category ASC, name ASC`).all() as DataSourceRow[];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Direktori Sumber Data</h1>
        <p className="text-sm text-foreground-muted">Sumber data riset yang sering dipakai, lengkap dengan catatan personal.</p>
      </div>
      <DataSourcesView sources={sources} />
    </div>
  );
}

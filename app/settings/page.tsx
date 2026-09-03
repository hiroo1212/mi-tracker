import { SettingsView } from "./SettingsView";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-foreground-muted">Backup dan restore data lokal kamu.</p>
      </div>
      <SettingsView />
    </div>
  );
}

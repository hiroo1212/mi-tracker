import { REFERENCE_GROUPS } from "@/lib/data/reference";
import { ReferensiView } from "./ReferensiView";

export default function ReferensiPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Referensi & Cheat Sheet</h1>
        <p className="text-sm text-foreground-muted">
          Ringkasan singkat framework dan istilah Market Intelligence, dikelompokkan per fase — buat kamu yang
          masih awam dan butuh penjelasan cepat tanpa keluar dari app.
        </p>
      </div>
      <ReferensiView groups={REFERENCE_GROUPS} />
    </div>
  );
}

import { getMarketSizingCalcs } from "@/lib/data/market-sizing";
import { MarketSizingView } from "./MarketSizingView";

export const dynamic = "force-dynamic";

export default function MarketSizingPage() {
  const calcs = getMarketSizingCalcs();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalkulator Market Sizing</h1>
        <p className="text-sm text-foreground-muted">
          Hitung TAM, SAM, dan SOM dengan pendekatan top-down atau bottom-up. Setiap angka wajib disertai asumsi agar bisa diaudit.
        </p>
      </div>
      <MarketSizingView calcs={calcs} />
    </div>
  );
}

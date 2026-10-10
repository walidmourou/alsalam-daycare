import { Suspense } from "react";
import { connection } from "next/server";
import ReservationApp from "@/app/components/ReservationApp";
import { getSlotCounts } from "@/lib/db";
import { getValidSaturdays } from "@/lib/holidays";
import type { SlotCount } from "@/lib/types";

async function Slots() {
  await connection();
  const dates = getValidSaturdays();
  const rows = dates.length
    ? await getSlotCounts(dates[0], dates[dates.length - 1])
    : [];

  const byDate = new Map<string, SlotCount>();
  for (const date of dates) byDate.set(date, { date, morning: 0, afternoon: 0 });
  for (const row of rows) {
    const info = byDate.get(row.slot_date);
    if (!info) continue;
    info[row.period] = Number(row.count);
  }

  return <ReservationApp slots={[...byDate.values()]} />;
}

export default function Page() {
  return (
    <main className="min-h-full flex-1 bg-emerald-50/40">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
          </div>
        }
      >
        <Slots />
      </Suspense>
    </main>
  );
}

import { formatDate, type Dict, type Lang } from "@/lib/i18n";
import type { SlotCount } from "@/lib/types";
import ReservationForm from "./ReservationForm";

export default function SlotCard({
  slot,
  lang,
  t,
}: {
  slot: SlotCount;
  lang: Lang;
  t: Dict;
}) {
  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-emerald-900">
        {formatDate(slot.date, lang)}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <ReservationForm
          date={slot.date}
          period="morning"
          count={slot.morning}
          label={t.morning}
          time={t.morningTime}
          t={t}
        />
        <ReservationForm
          date={slot.date}
          period="afternoon"
          count={slot.afternoon}
          label={t.afternoon}
          time={t.afternoonTime}
          t={t}
        />
      </div>
    </article>
  );
}

import { formatDate } from "@/lib/i18n";
import type { AdminReservation } from "@/lib/types";
import { deleteReservationAction, logoutAction } from "./actions";

const PERIOD_LABEL: Record<AdminReservation["period"], string> = {
  morning: "Vormittag 10:30–12:30",
  afternoon: "Nachmittag 14:30–16:30",
};

export default function ReservationsTable({
  rows,
}: {
  rows: AdminReservation[];
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-emerald-950">
            Reservierungen
          </h1>
          <p className="text-sm text-emerald-900/60">
            {rows.length} Reservierung{rows.length === 1 ? "" : "en"} insgesamt
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
          >
            Abmelden
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-emerald-100 bg-white px-4 py-8 text-center text-sm text-emerald-900/60">
          Noch keine Reservierungen.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-emerald-100 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Samstag</th>
                <th className="px-4 py-3 font-semibold">Zeit</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Telefon</th>
                <th className="px-4 py-3 font-semibold">Erfasst am</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {rows.map((row) => (
                <tr key={row.id} className="align-top">
                  <td className="px-4 py-3 text-emerald-950">
                    {formatDate(row.slot_date, "de")}
                  </td>
                  <td className="px-4 py-3 text-emerald-900/80">
                    {PERIOD_LABEL[row.period]}
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-950">
                    {row.name}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${row.phone.replace(/\s/g, "")}`}
                      className="text-emerald-700 hover:text-emerald-900 hover:underline"
                    >
                      {row.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-emerald-900/60">
                    {row.created_at}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteReservationAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Löschen
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { reserveAction } from "@/app/actions";
import type { Dict } from "@/lib/i18n";
import type { ActionState, Period } from "@/lib/types";

const initialState: ActionState = { ok: false };

function errorMessage(error: NonNullable<ActionState["error"]>, t: Dict): string {
  switch (error) {
    case "required":
      return t.errorRequired;
    case "phone":
      return t.errorPhone;
    case "full":
      return t.errorFull;
    case "duplicate":
      return t.errorDuplicate;
    case "invalidSlot":
      return t.errorInvalidSlot;
    default:
      return t.errorServer;
  }
}

export default function ReservationForm({
  date,
  period,
  count,
  label,
  time,
  t,
}: {
  date: string;
  period: Period;
  count: number;
  label: string;
  time: string;
  t: Dict;
}) {
  const [state, formAction, pending] = useActionState(reserveAction, initialState);

  const booked = state.count ?? count;
  const full = booked >= 2;
  const remaining = 2 - booked;
  const nameId = `${date}-${period}-name`;
  const phoneId = `${date}-${period}-phone`;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-emerald-900">{label}</h3>
        <span className="font-mono text-xs text-emerald-700/80">{time}</span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-white px-2.5 py-1 font-medium text-emerald-800 ring-1 ring-emerald-200">
          {t.count(booked)}
        </span>
        {!full && (
          <span className="text-emerald-700/80">{t.remaining(remaining)}</span>
        )}
      </div>

      {state.ok && (
        <p className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
          {t.success}
        </p>
      )}

      {full ? (
        <p className="rounded-lg bg-red-100 px-3 py-2 text-center text-sm font-semibold text-red-700">
          {t.full}
        </p>
      ) : state.ok ? null : (
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="period" value={period} />

          <div className="flex flex-col gap-1">
            <label htmlFor={nameId} className="text-xs font-medium text-emerald-900/70">
              {t.nameLabel}
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              required
              maxLength={120}
              placeholder={t.namePlaceholder}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={phoneId} className="text-xs font-medium text-emerald-900/70">
              {t.phoneLabel}
            </label>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              required
              inputMode="tel"
              maxLength={40}
              placeholder={t.phonePlaceholder}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {state.error && (
            <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
              {errorMessage(state.error, t)}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending ? t.sending : t.reserve}
          </button>
        </form>
      )}
    </section>
  );
}

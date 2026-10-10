"use client";

import { useEffect, useSyncExternalStore } from "react";
import { dictionaries, LANGS, type Lang } from "@/lib/i18n";
import type { SlotCount } from "@/lib/types";
import SlotCard from "./SlotCard";

const STORAGE_KEY = "lang";
const listeners = new Set<() => void>();
let cached: Lang | null = null;

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = () => {
    cached = null;
    callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Lang {
  if (cached === null) {
    cached = window.localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "de";
  }
  return cached;
}

function getServerSnapshot(): Lang {
  return "de";
}

function setLanguage(next: Lang) {
  cached = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

export default function ReservationApp({ slots }: { slots: SlotCount[] }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = dictionaries[lang];
  const isRtl = lang === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12"
    >
      <header className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-600">{t.orgName}</p>
            <p className="text-xs text-emerald-900/50">{t.tagline}</p>
          </div>
          <div
            role="group"
            aria-label={t.langSwitch}
            className="flex overflow-hidden rounded-full border border-emerald-200 bg-white text-sm"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                aria-pressed={lang === l.code}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  lang === l.code
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-emerald-900/80">{t.intro}</p>
        <p className="mt-2 text-sm font-medium text-emerald-700">{t.howTo}</p>
      </header>

      <div className="flex flex-col gap-5">
        {slots.map((slot) => (
          <SlotCard key={slot.date} slot={slot} lang={lang} t={t} />
        ))}
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-100/60 px-4 py-3 text-xs text-emerald-900/80">
        <span>{t.vacationNote}</span>
        <a
          href="/admin"
          className="font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-950"
        >
          Admin
        </a>
      </footer>
    </div>
  );
}

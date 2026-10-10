"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-bold text-emerald-950">Admin-Anmeldung</h1>
        <p className="mt-1 text-sm text-emerald-900/60">
          Bitte melden Sie sich an, um alle Reservierungen zu sehen.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-xs font-medium text-emerald-900/70">
              Benutzername
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-emerald-900/70">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {state.error && (
            <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
              Benutzername oder Passwort ist falsch.
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending ? "Anmelden …" : "Anmelden"}
          </button>
        </div>
      </form>
    </div>
  );
}

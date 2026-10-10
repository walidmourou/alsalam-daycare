"use server";

import { bookSlot, getSlotCount } from "@/lib/db";
import { isValidSaturday } from "@/lib/holidays";
import type { ActionState, Period } from "@/lib/types";

export async function reserveAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const date = String(formData.get("date") ?? "");
  const periodRaw = String(formData.get("period") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);

  if (periodRaw !== "morning" && periodRaw !== "afternoon") {
    return { ok: false, error: "invalidSlot" };
  }
  const period: Period = periodRaw;

  if (!name || !phone) {
    return { ok: false, error: "required" };
  }
  if (!/^[0-9+\-()/\s]{5,25}$/.test(phone)) {
    return { ok: false, error: "phone" };
  }
  if (!isValidSaturday(date)) {
    return { ok: false, error: "invalidSlot" };
  }

  try {
    const result = await bookSlot({ date, period, name, phone });
    const count = await getSlotCount(date, period);

    if (result === "ok") return { ok: true, count };
    if (result === "duplicate") return { ok: false, error: "duplicate", count };
    return { ok: false, error: "full", count };
  } catch {
    return { ok: false, error: "server" };
  }
}

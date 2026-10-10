"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyCredentials,
} from "@/lib/auth";
import { deleteReservation } from "@/lib/db";

export type LoginState = { error?: "invalid" };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    return { error: "invalid" };
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin");
}

export async function deleteReservationAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;

  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) {
    await deleteReservation(id);
    revalidatePath("/admin");
  }
}

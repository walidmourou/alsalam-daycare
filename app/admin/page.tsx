import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { getAllReservations } from "@/lib/db";
import LoginForm from "./LoginForm";
import ReservationsTable from "./ReservationsTable";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin – Al-Salam Lörrach",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return <LoginForm />;
  }

  const rows = await getAllReservations();
  return <ReservationsTable rows={rows} />;
}

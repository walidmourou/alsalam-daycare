export type Period = "morning" | "afternoon";

export type SlotCount = {
  date: string;
  morning: number;
  afternoon: number;
};

export type ActionError =
  | "required"
  | "phone"
  | "full"
  | "duplicate"
  | "invalidSlot"
  | "server";

export type ActionState = {
  ok: boolean;
  error?: ActionError;
  count?: number;
};

export type AdminReservation = {
  id: number;
  slot_date: string;
  period: Period;
  name: string;
  phone: string;
  created_at: string;
};

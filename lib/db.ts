import mysql from "mysql2/promise";
import type { AdminReservation, Period } from "./types";

let pool: mysql.Pool | undefined;
let schemaReady: Promise<void> | undefined;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT ?? 3306),
      waitForConnections: true,
      connectionLimit: 10,
      dateStrings: true,
      charset: "utf8mb4_unicode_ci",
    });
  }
  return pool;
}

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const p = getPool();
      await p.query(
        `CREATE TABLE IF NOT EXISTS slots (
           slot_date DATE NOT NULL,
           period VARCHAR(16) NOT NULL,
           max_bookings INT NOT NULL DEFAULT 2,
           booked INT NOT NULL DEFAULT 0,
           PRIMARY KEY (slot_date, period)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      );
      await p.query(
        `CREATE TABLE IF NOT EXISTS reservations (
           id INT AUTO_INCREMENT PRIMARY KEY,
           slot_date DATE NOT NULL,
           period VARCHAR(16) NOT NULL,
           name VARCHAR(120) NOT NULL,
           phone VARCHAR(40) NOT NULL,
           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
           INDEX idx_slot (slot_date, period)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
      );
    })().catch((err) => {
      schemaReady = undefined;
      throw err;
    });
  }
  return schemaReady;
}

export async function getSlotCounts(
  from: string,
  to: string,
): Promise<{ slot_date: string; period: Period; count: number }[]> {
  await ensureSchema();
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    `SELECT slot_date, period, COUNT(*) AS count
       FROM reservations
      WHERE slot_date BETWEEN ? AND ?
      GROUP BY slot_date, period`,
    [from, to],
  );
  return rows as { slot_date: string; period: Period; count: number }[];
}

export async function getSlotCount(
  date: string,
  period: Period,
): Promise<number> {
  await ensureSchema();
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS count
       FROM reservations
      WHERE slot_date = ? AND period = ?`,
    [date, period],
  );
  return Number((rows[0] as { count: number }).count);
}

export type BookResult = "ok" | "full" | "duplicate";

export async function bookSlot(input: {
  date: string;
  period: Period;
  name: string;
  phone: string;
}): Promise<BookResult> {
  await ensureSchema();
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO slots (slot_date, period, max_bookings, booked)
       VALUES (?, ?, 2, 0)
       ON DUPLICATE KEY UPDATE slot_date = slot_date`,
      [input.date, input.period],
    );

    const [dupes] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT id FROM reservations
        WHERE slot_date = ? AND period = ? AND phone = ?
        LIMIT 1`,
      [input.date, input.period, input.phone],
    );
    if (dupes.length > 0) {
      await connection.rollback();
      return "duplicate";
    }

    const [update] = await connection.execute<mysql.ResultSetHeader>(
      `UPDATE slots
          SET booked = booked + 1
        WHERE slot_date = ? AND period = ? AND booked < max_bookings`,
      [input.date, input.period],
    );
    if (update.affectedRows === 0) {
      await connection.rollback();
      return "full";
    }

    await connection.execute(
      `INSERT INTO reservations (slot_date, period, name, phone)
       VALUES (?, ?, ?, ?)`,
      [input.date, input.period, input.name, input.phone],
    );

    await connection.commit();
    return "ok";
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function getAllReservations(): Promise<AdminReservation[]> {
  await ensureSchema();
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    `SELECT id, slot_date, period, name, phone, created_at
       FROM reservations
      ORDER BY slot_date DESC, period, id`,
  );
  return rows as AdminReservation[];
}

export async function deleteReservation(id: number): Promise<void> {
  await ensureSchema();
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT slot_date, period FROM reservations WHERE id = ? FOR UPDATE`,
      [id],
    );
    const row = rows[0] as { slot_date: string; period: Period } | undefined;
    if (!row) {
      await connection.rollback();
      return;
    }
    await connection.execute(`DELETE FROM reservations WHERE id = ?`, [id]);
    await connection.execute(
      `UPDATE slots SET booked = GREATEST(booked - 1, 0)
        WHERE slot_date = ? AND period = ?`,
      [row.slot_date, row.period],
    );
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

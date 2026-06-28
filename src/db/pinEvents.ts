import { getDb, newId, nowMs } from './index';

/**
 * Max successful pins a user can do in a single week (Sunday → Saturday,
 * local time). The 6th attempt is rejected with a friendly explanation.
 */
export const WEEKLY_PIN_LIMIT = 5;

/**
 * Record a successful pin. Called only after the import actually saved a
 * recipe — failed extractions don't count toward the limit.
 *
 * We use an event log rather than counting saved recipes so the limit
 * stays honest even if the user deletes a recipe (deleting a recipe
 * doesn't restore a "slot" for that week).
 */
export async function recordPin(): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO pin_events (id, created_at) VALUES (?, ?)`,
    [newId('p'), nowMs()],
  );
}

/** Number of pins recorded since this Sunday at 00:00 local time. */
export async function countPinsThisWeek(): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) AS c FROM pin_events WHERE created_at >= ?`,
    [getStartOfWeekMs()],
  );
  return row?.c ?? 0;
}

/** ms timestamp for the start of the current week (Sunday 00:00 local). */
function getStartOfWeekMs(): number {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

/** Date for next Sunday 00:00 local — when the weekly count resets. */
export function getNextWeeklyReset(): Date {
  const now = new Date();
  const day = now.getDay();
  // If today is Sunday we still want NEXT Sunday (7 days out), not today.
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Format a Date as "Sunday, June 28". */
export function formatResetDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

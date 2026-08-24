import type { OpeningHours } from "@/types/place";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export interface OpenStatus { isOpen: boolean; label: string; closingTime?: string }

function jakartaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { day: dayMap[value("weekday")], minutes: Number(value("hour")) * 60 + Number(value("minute")) };
}

const asMinutes = (time: string) => { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; };

export function getPlaceOpenStatus(hours: OpeningHours, date = new Date()): OpenStatus {
  const now = jakartaNow(date);
  const schedule = hours[DAYS[now.day]];
  if (!schedule.closed) {
    const open = asMinutes(schedule.open);
    const close = asMinutes(schedule.close);
    const effectiveClose = close <= open ? close + 24 * 60 : close;
    const effectiveNow = now.minutes < open && close <= open ? now.minutes + 24 * 60 : now.minutes;
    if (effectiveNow >= open && effectiveNow < effectiveClose) {
      const remaining = effectiveClose - effectiveNow;
      return { isOpen: true, label: remaining <= 30 ? "Tutup 30 menit lagi" : `Buka sampai ${schedule.close}`, closingTime: schedule.close };
    }
  }
  for (let offset = 1; offset <= 7; offset += 1) {
    const next = hours[DAYS[(now.day + offset) % 7]];
    if (!next.closed) return { isOpen: false, label: offset === 1 ? `Buka besok ${next.open}` : `Buka ${DAYS[(now.day + offset) % 7]} ${next.open}` };
  }
  return { isOpen: false, label: "Tutup" };
}

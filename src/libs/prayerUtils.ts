import { PrayerTimings } from "./aladhan";

// Prayer duration in minutes for each prayer
export const PRAYER_DURATIONS: Record<string, number> = {
  Fajr: 30,
  Sunrise: 0, // Not a prayer time
  Dhuhr: 10,
  Asr: 10,
  Maghrib: 15,
  Isha: 20,
};

export interface ActivePrayer {
  name: string;
  arabicName: string;
  time: string;
  nextPrayer: string;
  nextPrayerArabic: string;
  nextPrayerTime: string;
  timeRemaining: string;
  minutesRemaining: number;
  isInPrayerTime: boolean; // Within the prayer duration
}

const PRAYER_NAMES: Record<string, { en: string; ar: string }> = {
  Fajr: { en: "Fajr", ar: "الفجر" },
  Sunrise: { en: "Sunrise", ar: "الشروق" },
  Dhuhr: { en: "Dhuhr", ar: "الظهر" },
  Asr: { en: "Asr", ar: "العصر" },
  Maghrib: { en: "Maghrib", ar: "المغرب" },
  Isha: { en: "Isha", ar: "العشاء" },
};

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes to HH:MM:SS or similar
 */
function formatTimeRemaining(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor(((minutes % 60) - mins) * 60);

  if (hours > 0) {
    return `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/**
 * Get the active prayer and next prayer info
 */
export function getActivePrayer(timings: PrayerTimings): ActivePrayer | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  // Prayer times in order (excluding Sunrise from prayer times but keeping it for transitions)
  const prayerOrder: (keyof PrayerTimings)[] = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
  ];

  // Convert all prayer times to minutes
  const prayerTimes = prayerOrder.map((name) => ({
    name,
    time: timings[name],
    minutes: timeToMinutes(timings[name]),
    duration: PRAYER_DURATIONS[name] || 0,
  }));

  // Find current position
  let currentPrayerIndex = -1;
  let isInPrayerTime = false;

  for (let i = 0; i < prayerTimes.length; i++) {
    const prayer = prayerTimes[i];
    const nextPrayer = prayerTimes[(i + 1) % prayerTimes.length];

    // Check if we're within prayer duration
    if (
      currentMinutes >= prayer.minutes &&
      currentMinutes < prayer.minutes + prayer.duration &&
      prayer.duration > 0
    ) {
      currentPrayerIndex = i;
      isInPrayerTime = true;
      break;
    }

    // Check if we're between this prayer (+ duration) and next prayer
    if (
      currentMinutes >= prayer.minutes + prayer.duration &&
      currentMinutes < nextPrayer.minutes
    ) {
      currentPrayerIndex = i;
      isInPrayerTime = false;
      break;
    }
  }

  // Handle after Isha (wrap around to Fajr)
  if (currentPrayerIndex === -1) {
    const ishaTime = prayerTimes[prayerTimes.length - 1];
    if (currentMinutes >= ishaTime.minutes + ishaTime.duration) {
      currentPrayerIndex = prayerTimes.length - 1;
      isInPrayerTime = false;
    } else if (currentMinutes < prayerTimes[0].minutes) {
      // Before Fajr
      currentPrayerIndex = prayerTimes.length - 1;
      isInPrayerTime = false;
    }
  }

  if (currentPrayerIndex === -1) {
    return null;
  }

  const currentPrayer = prayerTimes[currentPrayerIndex];
  const nextPrayerIndex = (currentPrayerIndex + 1) % prayerTimes.length;
  const nextPrayer = prayerTimes[nextPrayerIndex];

  // Calculate time remaining to next prayer
  let minutesRemaining: number;
  if (nextPrayer.minutes > currentMinutes) {
    minutesRemaining = nextPrayer.minutes - currentMinutes;
  } else {
    // Next prayer is tomorrow (after midnight)
    minutesRemaining = 24 * 60 - currentMinutes + nextPrayer.minutes;
  }

  return {
    name: currentPrayer.name,
    arabicName: PRAYER_NAMES[currentPrayer.name].ar,
    time: currentPrayer.time,
    nextPrayer: nextPrayer.name,
    nextPrayerArabic: PRAYER_NAMES[nextPrayer.name].ar,
    nextPrayerTime: nextPrayer.time,
    timeRemaining: formatTimeRemaining(minutesRemaining),
    minutesRemaining,
    isInPrayerTime,
  };
}

/**
 * Check if a specific prayer is currently active (including its duration)
 */
export function isPrayerActive(
  prayerName: keyof PrayerTimings,
  timings: PrayerTimings
): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  const prayerTime = timeToMinutes(timings[prayerName]);
  const duration = PRAYER_DURATIONS[prayerName] || 0;

  if (duration === 0) return false;

  return currentMinutes >= prayerTime && currentMinutes < prayerTime + duration;
}


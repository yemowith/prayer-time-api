"use client";

import { useEffect, useState } from "react";
import { useTimePrayer } from "@/providers/TimePrayerProvider";
import { getActivePrayer } from "@/libs/prayerUtils";

// Days of week in Arabic
const ARABIC_DAYS: Record<string, string> = {
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
  Sunday: "الأحد",
};

// Months in Arabic (Original Arabic names used in Levant region)
const ARABIC_MONTHS: Record<number, string> = {
  1: "كانون الثاني",
  2: "شباط",
  3: "آذار",
  4: "نيسان",
  5: "أيار",
  6: "حزيران",
  7: "تموز",
  8: "آب",
  9: "أيلول",
  10: "تشرين الأول",
  11: "تشرين الثاني",
  12: "كانون الأول",
};

export default function DateTimeDisplay() {
  const { prayerData, city, country } = useTimePrayer();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    // Remove AM/PM from the time string
    return timeString.replace(/\s?(AM|PM)/i, "");
  };

  const getPeriod = (date: Date): string => {
    return date
      .toLocaleTimeString("en-US", {
        hour12: true,
      })
      .split(" ")[1];
  };

  // Get active prayer info
  const activePrayerInfo = prayerData
    ? getActivePrayer(prayerData.timings)
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-12">
      <div className="grid grid-cols-2 gap-4 w-full items-center">
        {/* Gregorian Date */}
        <div className="space-y-2 text-center">
          <p className="text-xl opacity-70">التاريخ الميلادي</p>
          {prayerData && (
            <>
              <p className="text-4xl font-bold" dir="rtl">
                {prayerData.date.gregorian.day}{" "}
                {ARABIC_MONTHS[prayerData.date.gregorian.month.number]}{" "}
                {prayerData.date.gregorian.year}
              </p>
              <p className="text-4xl font-semibold" dir="rtl">
                {ARABIC_DAYS[prayerData.date.gregorian.weekday.en]}
              </p>
            </>
          )}
        </div>
        {/* Hijri Date */}
        <div className="space-y-2 text-center">
          <p className="text-xl opacity-70">التاريخ الهجري</p>
          {prayerData && (
            <>
              <p className="text-4xl font-bold" dir="rtl">
                {prayerData.date.hijri.date}
              </p>
              <p className="text-4xl font-semibold" dir="rtl">
                {prayerData.date.hijri.month.ar}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Current Time */}
      <div className="text-center">
        <p className="text-4xl opacity-70 mb-4">الوقت الحالي</p>
        <div className="flex items-start justify-center gap-4">
          <span className="text-4xl font-bold opacity-70 mt-4 ">
            {getPeriod(currentTime)}
          </span>
          <span className="text-8xl font-black tracking-wider min-w-[450px]">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Next Prayer Info */}
      {activePrayerInfo && (
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20 w-full max-w-md">
          <p className="text-xl opacity-70 mb-4">الصلاة القادمة</p>
          <p className="text-5xl font-bold mb-6" dir="rtl">
            {activePrayerInfo.nextPrayerArabic}
          </p>
          <div className="mt-6">
            <p className="text-xl opacity-70 mb-2">الوقت المتبقي</p>
            <p className="text-7xl font-black text-green-400 animate-pulse">
              {activePrayerInfo.timeRemaining}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

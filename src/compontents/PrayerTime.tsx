"use client";

import { useState, useEffect } from "react";
import { useTimePrayer } from "@/providers/TimePrayerProvider";
import { isPrayerActive } from "@/libs/prayerUtils";

interface PrayerTimeItemProps {
  name: string;
  time: string;
  isActive?: boolean;
}

function PrayerTimeItem({ name, time, isActive }: PrayerTimeItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-6 rounded-2xl transition-all ${
        isActive
          ? "bg-white/30 shadow-2xl scale-105 border-4 border-white/50"
          : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <span className={`text-4xl font-bold ${isActive ? "text-white" : ""}`}>
        {name}
      </span>
      <span
        className={`text-6xl font-black ${
          isActive ? "text-white animate-pulse" : ""
        }`}
      >
        {time}
      </span>
    </div>
  );
}

export default function PrayerTime() {
  const { prayerData, loading, error } = useTimePrayer();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second to check active prayer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white mx-auto mb-8"></div>
          <p className="text-4xl font-bold">Loading prayer times...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center bg-red-500/20 border-4 border-red-500 rounded-2xl p-12">
          <p className="text-5xl font-bold mb-4">Error</p>
          <p className="text-3xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!prayerData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-4xl font-bold">No prayer times available</p>
      </div>
    );
  }

  const { timings } = prayerData;

  // Main prayer times to display
  const mainPrayers: Array<{ name: string; time: string; key: string }> = [
    { name: "الفجر", time: timings.Fajr, key: "Fajr" },
    { name: "الشروق", time: timings.Sunrise, key: "Sunrise" },
    { name: "الظهر", time: timings.Dhuhr, key: "Dhuhr" },
    { name: "العصر", time: timings.Asr, key: "Asr" },
    { name: "المغرب", time: timings.Maghrib, key: "Maghrib" },
    { name: "العشاء", time: timings.Isha, key: "Isha" },
  ];

  return (
    <div className="flex flex-col justify-center h-full gap-4 w-full">
      {mainPrayers.map((prayer, index) => (
        <PrayerTimeItem
          key={index}
          name={prayer.name}
          time={prayer.time}
          isActive={isPrayerActive(prayer.key as keyof typeof timings, timings)}
        />
      ))}
    </div>
  );
}

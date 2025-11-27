"use client";

import { useState } from "react";
import Image from "next/image";
import { Zain } from "next/font/google";
import PrayerTime from "@/compontents/PrayerTime";
import DateTimeDisplay from "@/compontents/DateTimeDisplay";

const zain = Zain({
  weight: ["200", "300", "400", "700", "800", "900"],
  subsets: ["arabic", "latin"],
});

// Gradient color themes
const colorThemes = [
  {
    name: "أزرق",
    gradient: "radial-gradient(circle, #305F81, #00080B)",
    color: "#305F81",
  },
  {
    name: "أخضر",
    gradient: "radial-gradient(circle, #2D7A4E, #00080B)",
    color: "#2D7A4E",
  },
  {
    name: "برتقالي",
    gradient: "radial-gradient(circle, #D87A3A, #00080B)",
    color: "#D87A3A",
  },
  {
    name: "بنفسجي",
    gradient: "radial-gradient(circle, #6B4BA3, #00080B)",
    color: "#6B4BA3",
  },
  {
    name: "أحمر",
    gradient: "radial-gradient(circle, #A13D4D, #00080B)",
    color: "#A13D4D",
  },
];

export default function Home() {
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <div
        dir="rtl"
        className={`${zain.className} flex flex-col h-screen overflow-hidden`}
        style={{ background: colorThemes[activeThemeIndex].gradient }}
      >
        {/* Main Content */}
        <div className="grid grid-cols-2 flex-1">
          {/* Column 1: Prayer Times */}
          <div className="flex flex-col p-8 col-span-1">
            <PrayerTime />
          </div>

          {/* Column 2: Date, Time, and Next Prayer Info */}
          <div className="flex flex-col p-8 col-span-1">
            <DateTimeDisplay />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-3 px-8">
          <div className="flex items-center justify-between">
            {/* Publisher and Developer Info */}
            <div className="flex items-center gap-6 text-sm opacity-70">
              <div>
                <span className="font-semibold">الناشر:</span> مؤسسة الأوقاف
                الإسلامية
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div>
                <span className="font-semibold">المطور:</span> يمن التقنية
              </div>
            </div>

            {/* Color Theme Selector */}
            <div className="flex items-center gap-3 hidden ">
              <span className="text-sm opacity-70 font-semibold">اللون:</span>
              <div className="flex gap-2">
                {colorThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveThemeIndex(index)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      activeThemeIndex === index
                        ? "border-white shadow-lg scale-110"
                        : "border-white/30"
                    }`}
                    style={{ backgroundColor: theme.color }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg border border-white/30 bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
              title={
                isFullscreen ? "الخروج من وضع ملء الشاشة" : "وضع ملء الشاشة"
              }
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9V4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5m0-4.5h4.5m-4.5 0l5.25 5.25"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              )}
            </button>

            {/* Logo */}
            <div className="relative w-12 h-12">
              <Image
                src="/logo/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

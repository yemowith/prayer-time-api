"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getPrayerTimes,
  type AladhanResponse,
  type PrayerTimeData,
} from "@/libs/aladhan";

interface TimePrayerContextType {
  city: string;
  country: string;
  method: number;
  prayerData: PrayerTimeData | null;
  loading: boolean;
  error: string | null;
  setCity: (city: string) => void;
  setCountry: (country: string) => void;
  setMethod: (method: number) => void;
  refetch: () => void;
}

const TimePrayerContext = createContext<TimePrayerContextType | undefined>(
  undefined
);

interface TimePrayerProviderProps {
  children: ReactNode;
  defaultCity?: string;
  defaultCountry?: string;
  defaultMethod?: number;
}

export function TimePrayerProvider({
  children,
  defaultCity = "aleppo",
  defaultCountry = "syria",
  defaultMethod = 2,
}: TimePrayerProviderProps) {
  const [city, setCity] = useState(defaultCity);
  const [country, setCountry] = useState(defaultCountry);
  const [method, setMethod] = useState(defaultMethod);
  const [prayerData, setPrayerData] = useState<PrayerTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(getTodayDateString());

  // Function to get today's date in DD-MM-YYYY format
  function getTodayDateString(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Fetch prayer times
  const fetchPrayerTimes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AladhanResponse = await getPrayerTimes({
        city,
        country,
        date: currentDate,
        method,
      });

      if (response.code === 200) {
        setPrayerData(response.data);
      } else {
        setError(`API error: ${response.status}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch prayer times"
      );
    } finally {
      setLoading(false);
    }
  };

  // Refetch function
  const refetch = () => {
    setCurrentDate(getTodayDateString());
    fetchPrayerTimes();
  };

  // Fetch prayer times when dependencies change
  useEffect(() => {
    fetchPrayerTimes();
  }, [city, country, method, currentDate]);

  // Check for date change every minute
  useEffect(() => {
    const checkDateChange = () => {
      const newDate = getTodayDateString();
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
      }
    };

    // Check immediately
    checkDateChange();

    // Then check every minute
    const interval = setInterval(checkDateChange, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const value: TimePrayerContextType = {
    city,
    country,
    method,
    prayerData,
    loading,
    error,
    setCity,
    setCountry,
    setMethod,
    refetch,
  };

  return (
    <TimePrayerContext.Provider value={value}>
      {children}
    </TimePrayerContext.Provider>
  );
}

// Custom hook to use the prayer time context
export function useTimePrayer() {
  const context = useContext(TimePrayerContext);
  if (context === undefined) {
    throw new Error("useTimePrayer must be used within a TimePrayerProvider");
  }
  return context;
}

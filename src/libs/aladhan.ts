// Types based on Aladhan API response
export interface PrayerTimings {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Sunset: string
  Maghrib: string
  Isha: string
  Imsak: string
  Midnight: string
  Firstthird: string
  Lastthird: string
}

export interface HijriDate {
  date: string
  format: string
  day: string
  weekday: {
    en: string
    ar: string
  }
  month: {
    number: number
    en: string
    ar: string
    days: number
  }
  year: string
  designation: {
    abbreviated: string
    expanded: string
  }
  holidays: string[]
  adjustedHolidays: string[]
  method: string
}

export interface GregorianDate {
  date: string
  format: string
  day: string
  weekday: {
    en: string
  }
  month: {
    number: number
    en: string
  }
  year: string
  designation: {
    abbreviated: string
    expanded: string
  }
  lunarSighting: boolean
}

export interface DateInfo {
  readable: string
  timestamp: string
  hijri: HijriDate
  gregorian: GregorianDate
}

export interface Meta {
  latitude: number
  longitude: number
  timezone: string
  method: {
    id: number
    name: string
    params: {
      Fajr: number
      Isha: number
    }
    location: {
      latitude: number
      longitude: number
    }
  }
  latitudeAdjustmentMethod: string
  midnightMode: string
  school: string
  offset: {
    Imsak: number
    Fajr: number
    Sunrise: number
    Dhuhr: number
    Asr: number
    Maghrib: number
    Sunset: number
    Isha: number
    Midnight: number
  }
}

export interface PrayerTimeData {
  timings: PrayerTimings
  date: DateInfo
  meta: Meta
}

export interface AladhanResponse {
  code: number
  status: string
  data: PrayerTimeData
}

// API Configuration
const ALADHAN_BASE_URL = 'https://api.aladhan.com/v1'

export interface GetPrayerTimesParams {
  city: string
  country: string
  date?: string // Format: DD-MM-YYYY
  method?: number // Calculation method (default: 2)
}

/**
 * Fetches prayer times from Aladhan API
 * @param params - Parameters for fetching prayer times
 * @returns Promise with prayer time data
 */
export async function getPrayerTimes(
  params: GetPrayerTimesParams,
): Promise<AladhanResponse> {
  const { city, country, date, method = 2 } = params

  // Format date or use current date
  const dateParam = date || formatCurrentDate()

  const url = `${ALADHAN_BASE_URL}/timingsByCity/${dateParam}?city=${encodeURIComponent(
    city,
  )}&country=${encodeURIComponent(country)}&method=${method}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: AladhanResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    throw error
  }
}

/**
 * Formats current date to DD-MM-YYYY format
 */
function formatCurrentDate(): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${day}-${month}-${year}`
}

/**
 * Example usage:
 *
 * const prayerTimes = await getPrayerTimes({
 *   city: "aleppo",
 *   country: "syria",
 *   date: "14-11-2025",
 *   method: 2
 * });
 */

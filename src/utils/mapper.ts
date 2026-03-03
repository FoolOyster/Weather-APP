import type { CurrentWeather, DailyForecast } from '../types/weather'

export type OpenWeatherCurrentResponse = {
  dt: number
  timezone: number
  name: string
  sys: { country: string }
  weather: Array<{ main: string; description: string; icon: string }>
  main: { temp: number; temp_min: number; temp_max: number; humidity: number }
  wind: { speed: number }
}

type OpenWeatherForecastItem = {
  dt: number
  dt_txt: string
  weather: Array<{ main: string; description: string; icon: string }>
  main: { temp_min: number; temp_max: number }
}

export type OpenWeatherForecastResponse = {
  list: OpenWeatherForecastItem[]
}

// 将 OpenWeather 当前天气 DTO 映射到页面领域模型
export const mapCurrentWeather = (
  dto: OpenWeatherCurrentResponse,
  cityNameOverride?: string,
): CurrentWeather => ({
  cityName: cityNameOverride?.trim() || dto.name,
  countryCode: dto.sys.country,
  timezoneOffset: dto.timezone,
  timestamp: dto.dt,
  weatherMain: dto.weather[0]?.main ?? 'Unknown',
  weatherDescription: dto.weather[0]?.description ?? '未知天气',
  icon: dto.weather[0]?.icon ?? '01d',
  temp: dto.main.temp,
  tempMin: dto.main.temp_min,
  tempMax: dto.main.temp_max,
  humidity: dto.main.humidity,
  windSpeed: dto.wind.speed,
})

// 将 3 小时粒度预报聚合为最多 10 天的日维度高低温
export const mapDailyForecast = (dto: OpenWeatherForecastResponse): DailyForecast[] => {
  const grouped = new Map<
    string,
    { max: number; min: number; main: string; description: string; icon: string }
  >()

  dto.list.forEach((item) => {
    const dateKey = item.dt_txt.split(' ')[0]
    const existing = grouped.get(dateKey)

    if (!existing) {
      grouped.set(dateKey, {
        max: item.main.temp_max,
        min: item.main.temp_min,
        main: item.weather[0]?.main ?? 'Unknown',
        description: item.weather[0]?.description ?? '未知天气',
        icon: item.weather[0]?.icon ?? '01d',
      })
      return
    }

    grouped.set(dateKey, {
      ...existing,
      max: Math.max(existing.max, item.main.temp_max),
      min: Math.min(existing.min, item.main.temp_min),
    })
  })

  return Array.from(grouped.entries())
    .slice(0, 10)
    .map(([date, value]) => ({
      date,
      weatherMain: value.main,
      weatherDescription: value.description,
      icon: value.icon,
      tempMin: value.min,
      tempMax: value.max,
    }))
}

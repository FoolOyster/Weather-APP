import type { DailyForecast } from '../types/weather'

// 统一格式化温度显示
export const formatTemperature = (temp: number): string => `${Math.round(temp)}°C`

// 统一格式化风速显示
export const formatWindSpeed = (speed: number): string => `${speed.toFixed(1)} m/s`

// 统一格式化能见度（米转千米）
export const formatVisibility = (visibility: number): string => `${(visibility / 1000).toFixed(1)} km`

// 格式化日期为本地简短周几
export const formatDay = (date: string): string => {
  const parsed = new Date(date)
  return parsed.toLocaleDateString('zh-CN', { weekday: 'short', month: 'numeric', day: 'numeric' })
}

// 格式化时间戳为本地时分
export const formatTime = (timestamp: number): string =>
  new Date(timestamp * 1000).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

// 格式化时间区间
export const formatTimeRange = (start: number, end: number): string =>
  `${formatTime(start)} - ${formatTime(end)}`

// 计算未来预报中的最高/最低温，用于信息汇总
export const getForecastSummary = (
  forecast: DailyForecast[],
): { high: number; low: number } | null => {
  if (forecast.length === 0) {
    return null
  }

  const highs = forecast.map((item) => item.tempMax)
  const lows = forecast.map((item) => item.tempMin)

  return {
    high: Math.max(...highs),
    low: Math.min(...lows),
  }
}

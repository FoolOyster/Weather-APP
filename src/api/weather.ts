import type { AirQuality, HistoricalTrendPoint, WeatherAlert } from '../types/weather'
import {
  mapCurrentWeather,
  mapDailyForecast,
  type OpenWeatherCurrentResponse,
  type OpenWeatherForecastResponse,
} from '../utils/mapper'

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org'
const OPENWEATHER_ICON_BASE_URL = 'https://openweathermap.org/img/wn'

type OpenWeatherErrorResponse = {
  message?: string
}

type GeocodeItem = {
  name: string
  lat: number
  lon: number
  local_names?: Record<string, string>
}

type AirPollutionResponse = {
  list: Array<{
    main: { aqi: number }
    components: { pm2_5: number; pm10: number; o3: number }
  }>
}

type OneCallResponse = {
  current?: { uvi?: number }
  alerts?: Array<{
    sender_name?: string
    event?: string
    start?: number
    end?: number
    description?: string
    tags?: string[]
  }>
}

type TimeMachineResponse = {
  data?: Array<{ temp?: number }>
}

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!apiKey) {
    throw new Error('缺少 API Key，请在 .env.local 中配置 VITE_OPENWEATHER_API_KEY')
  }
  return apiKey
}

const requestJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    let errorMessage = '天气服务请求失败，请稍后重试'

    try {
      const errorPayload = (await response.json()) as OpenWeatherErrorResponse
      if (response.status === 404) {
        errorMessage = '找不到该城市，请输入正确的城市名称'
      } else if (response.status === 401) {
        errorMessage = 'API Key 无效，请检查 .env.local 配置'
      } else if (errorPayload.message) {
        errorMessage = errorPayload.message
      }
    } catch {
      if (response.status === 404) {
        errorMessage = '找不到该城市，请输入正确的城市名称'
      }
    }

    throw new Error(errorMessage)
  }
  return (await response.json()) as T
}

export const getWeatherIconUrl = (icon: string): string =>
  `${OPENWEATHER_ICON_BASE_URL}/${icon}@2x.png`

const pickLocalizedCityName = (item: GeocodeItem): string =>
  item.local_names?.zh || item.local_names?.zh_cn || item.local_names?.['zh-CN'] || item.name

const getLocalizedCityNameByCoordinates = async (lat: number, lon: number): Promise<string | null> => {
  const apiKey = getApiKey()
  const reverseGeocodeUrl = `${OPENWEATHER_BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`

  try {
    const reverseGeocode = await requestJson<GeocodeItem[]>(reverseGeocodeUrl)
    if (reverseGeocode.length === 0) {
      return null
    }
    return pickLocalizedCityName(reverseGeocode[0])
  } catch {
    return null
  }
}

const parseAqi = (aqi: number): Pick<AirQuality, 'level' | 'suggestion'> => {
  if (aqi <= 1) {
    return { level: '优', suggestion: '空气质量优秀，适宜户外运动。' }
  }
  if (aqi === 2) {
    return { level: '良', suggestion: '空气质量良好，普通人群可正常外出。' }
  }
  if (aqi === 3) {
    return { level: '轻度污染', suggestion: '敏感人群建议减少长时间户外活动。' }
  }
  if (aqi === 4) {
    return { level: '中度污染', suggestion: '建议减少外出并佩戴防护口罩。' }
  }
  return { level: '重度污染', suggestion: '不建议户外活动，尽量留在室内。' }
}

const getAlertSeverity = (event: string): WeatherAlert['severity'] => {
  const normalized = event.toLowerCase()
  if (normalized.includes('storm') || normalized.includes('typhoon') || normalized.includes('tornado')) {
    return 'high'
  }
  if (normalized.includes('rain') || normalized.includes('snow') || normalized.includes('wind')) {
    return 'medium'
  }
  return 'low'
}

const fetchAirQuality = async (lat: number, lon: number): Promise<AirQuality | null> => {
  const apiKey = getApiKey()
  const url = `${OPENWEATHER_BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`

  try {
    const data = await requestJson<AirPollutionResponse>(url)
    const item = data.list?.[0]
    if (!item) {
      return null
    }

    const { level, suggestion } = parseAqi(item.main.aqi)
    return {
      aqi: item.main.aqi,
      level,
      suggestion,
      pm2_5: item.components.pm2_5,
      pm10: item.components.pm10,
      o3: item.components.o3,
    }
  } catch {
    return null
  }
}

const fetchOneCallExtras = async (
  lat: number,
  lon: number,
): Promise<{ uvIndex: number | null; alerts: WeatherAlert[] }> => {
  const apiKey = getApiKey()
  const url = `${OPENWEATHER_BASE_URL}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&units=metric&lang=zh_cn&appid=${apiKey}`

  try {
    const data = await requestJson<OneCallResponse>(url)
    const alerts = (data.alerts ?? []).map((alert) => ({
      senderName: alert.sender_name || '官方气象部门',
      event: alert.event || '天气提示',
      start: alert.start || 0,
      end: alert.end || 0,
      description: alert.description || '请关注最新天气变化',
      severity: getAlertSeverity(alert.event || ''),
    }))

    return {
      uvIndex: typeof data.current?.uvi === 'number' ? data.current.uvi : null,
      alerts,
    }
  } catch {
    return {
      uvIndex: null,
      alerts: [],
    }
  }
}

const fetchHistoricalTrend = async (lat: number, lon: number): Promise<HistoricalTrendPoint[]> => {
  const apiKey = getApiKey()
  const nowTimestamp = Math.floor(Date.now() / 1000)
  const daySeconds = 24 * 60 * 60

  const requests = [1, 2, 3].map(async (daysAgo) => {
    const target = nowTimestamp - daysAgo * daySeconds
    const url = `${OPENWEATHER_BASE_URL}/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${target}&units=metric&appid=${apiKey}`

    try {
      const data = await requestJson<TimeMachineResponse>(url)
      const temp = data.data?.[0]?.temp
      if (typeof temp !== 'number') {
        return null
      }

      const date = new Date(target * 1000)
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        temp,
      }
    } catch {
      return null
    }
  })

  const points = await Promise.all(requests)
  return points.filter((item): item is HistoricalTrendPoint => item !== null).reverse()
}

const buildFallbackAlerts = (weatherMain: string): WeatherAlert[] => {
  const riskMap: Record<string, { event: string; description: string; severity: WeatherAlert['severity'] }> = {
    Thunderstorm: {
      event: '雷暴风险提醒',
      description: '当前存在雷暴风险，请避免在空旷区域停留。',
      severity: 'high',
    },
    Rain: {
      event: '降雨提醒',
      description: '外出建议携带雨具，注意道路湿滑。',
      severity: 'medium',
    },
    Snow: {
      event: '降雪提醒',
      description: '注意保暖与路面结冰风险，谨慎出行。',
      severity: 'medium',
    },
  }

  const risk = riskMap[weatherMain]
  if (!risk) {
    return []
  }

  const now = Math.floor(Date.now() / 1000)
  return [
    {
      senderName: '系统风险分析',
      event: risk.event,
      start: now,
      end: now + 12 * 60 * 60,
      description: risk.description,
      severity: risk.severity,
    },
  ]
}

export const fetchWeatherByCity = async (city: string) => {
  const apiKey = getApiKey()
  const geocodeUrl = `${OPENWEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`

  const geocode = await requestJson<GeocodeItem[]>(geocodeUrl)
  if (geocode.length === 0) {
    throw new Error('找不到该城市，请输入正确的城市名称')
  }

  return fetchWeatherByCoordinates(geocode[0].lat, geocode[0].lon, pickLocalizedCityName(geocode[0]))
}

export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number,
  cityNameOverride?: string,
) => {
  const apiKey = getApiKey()
  const currentUrl = `${OPENWEATHER_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${apiKey}`
  const forecastUrl = `${OPENWEATHER_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${apiKey}`

  const [currentDto, forecastDto, oneCallExtras, airQuality, history] = await Promise.all([
    requestJson<OpenWeatherCurrentResponse>(currentUrl),
    requestJson<OpenWeatherForecastResponse>(forecastUrl),
    fetchOneCallExtras(lat, lon),
    fetchAirQuality(lat, lon),
    fetchHistoricalTrend(lat, lon),
  ])

  const localizedCityName = cityNameOverride ?? (await getLocalizedCityNameByCoordinates(lat, lon))
  const current = mapCurrentWeather(currentDto, localizedCityName ?? undefined, oneCallExtras.uvIndex)

  return {
    current,
    forecast: mapDailyForecast(forecastDto),
    airQuality,
    alerts: oneCallExtras.alerts.length > 0 ? oneCallExtras.alerts : buildFallbackAlerts(current.weatherMain),
    history,
  }
}

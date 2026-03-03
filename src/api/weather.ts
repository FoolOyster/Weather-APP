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

// 优先提取中文城市名，不存在时回退默认名称
const pickLocalizedCityName = (item: GeocodeItem): string =>
  item.local_names?.zh || item.local_names?.zh_cn || item.local_names?.['zh-CN'] || item.name

// 通过反向地理编码补充城市中文名
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
    // 反向解析失败时不阻断天气主流程
    return null
  }
}

// 城市名查询：先地理编码再拉取天气数据
export const fetchWeatherByCity = async (city: string) => {
  const apiKey = getApiKey()
  const geocodeUrl = `${OPENWEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`

  const geocode = await requestJson<GeocodeItem[]>(geocodeUrl)
  if (geocode.length === 0) {
    throw new Error('找不到该城市，请输入正确的城市名称')
  }

  return fetchWeatherByCoordinates(geocode[0].lat, geocode[0].lon, pickLocalizedCityName(geocode[0]))
}

// 经纬度查询：同时拉取当前天气和预报
export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number,
  cityNameOverride?: string,
) => {
  const apiKey = getApiKey()
  const currentUrl = `${OPENWEATHER_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${apiKey}`
  const forecastUrl = `${OPENWEATHER_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${apiKey}`

  const [currentDto, forecastDto] = await Promise.all([
    requestJson<OpenWeatherCurrentResponse>(currentUrl),
    requestJson<OpenWeatherForecastResponse>(forecastUrl),
  ])

  const localizedCityName = cityNameOverride ?? (await getLocalizedCityNameByCoordinates(lat, lon))

  return {
    current: mapCurrentWeather(currentDto, localizedCityName ?? undefined),
    forecast: mapDailyForecast(forecastDto),
  }
}

import {
  mapCurrentWeather,
  mapDailyForecast,
  type OpenWeatherCurrentResponse,
  type OpenWeatherForecastResponse,
} from '../utils/mapper'

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org'
const OPENWEATHER_ICON_BASE_URL = 'https://openweathermap.org/img/wn'

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
    throw new Error('天气服务请求失败，请稍后重试')
  }
  return (await response.json()) as T
}

export const getWeatherIconUrl = (icon: string): string =>
  `${OPENWEATHER_ICON_BASE_URL}/${icon}@2x.png`

// 城市名查询：先地理编码再拉取天气数据
export const fetchWeatherByCity = async (city: string) => {
  const apiKey = getApiKey()
  const geocodeUrl = `${OPENWEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`

  const geocode = await requestJson<Array<{ lat: number; lon: number }>>(geocodeUrl)
  if (geocode.length === 0) {
    throw new Error('未找到该城市，请检查输入后重试')
  }

  return fetchWeatherByCoordinates(geocode[0].lat, geocode[0].lon)
}

// 经纬度查询：同时拉取当前天气和预报
export const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
  const apiKey = getApiKey()
  const currentUrl = `${OPENWEATHER_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${apiKey}`
  const forecastUrl = `${OPENWEATHER_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${apiKey}`

  const [currentDto, forecastDto] = await Promise.all([
    requestJson<OpenWeatherCurrentResponse>(currentUrl),
    requestJson<OpenWeatherForecastResponse>(forecastUrl),
  ])

  return {
    current: mapCurrentWeather(currentDto),
    forecast: mapDailyForecast(forecastDto),
  }
}

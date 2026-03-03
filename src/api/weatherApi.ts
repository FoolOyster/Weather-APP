const API_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0'
const DEFAULT_UNITS = 'metric'
const DEFAULT_LANG = 'zh_cn'

export type WeatherQueryParams = {
  cityName?: string
  lat?: number
  lon?: number
}

type ApiErrorPayload = {
  cod?: string | number
  message?: string
}

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!apiKey) {
    throw new Error('缺少 API Key，请在 .env.local 中配置 VITE_OPENWEATHER_API_KEY')
  }
  return apiKey
}

// 校验查询参数，确保城市名和经纬度至少有一种可用
const validateQueryParams = (params: WeatherQueryParams): void => {
  const hasCityName = Boolean(params.cityName?.trim())
  const hasCoordinates = typeof params.lat === 'number' && typeof params.lon === 'number'

  if (!hasCityName && !hasCoordinates) {
    throw new Error('查询参数无效：请提供城市名称或经纬度')
  }
}

// 将城市名解析为经纬度，便于统一查询逻辑
const resolveCoordinates = async (
  params: WeatherQueryParams,
): Promise<{ lat: number; lon: number }> => {
  if (typeof params.lat === 'number' && typeof params.lon === 'number') {
    return { lat: params.lat, lon: params.lon }
  }

  const cityName = params.cityName?.trim()
  if (!cityName) {
    throw new Error('缺少城市名称，无法解析经纬度')
  }

  const apiKey = getApiKey()
  const url = `${GEO_BASE_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('城市解析失败，请稍后重试')
  }

  const data = (await response.json()) as Array<{ lat: number; lon: number }>
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('未找到该城市，请检查城市名称后重试')
  }

  return { lat: data[0].lat, lon: data[0].lon }
}

const requestWeatherApi = async <T>(path: string, lat: number, lon: number): Promise<T> => {
  const apiKey = getApiKey()
  const url = `${API_BASE_URL}${path}?lat=${lat}&lon=${lon}&units=${DEFAULT_UNITS}&lang=${DEFAULT_LANG}&appid=${apiKey}`

  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('网络异常，无法连接天气服务')
  }

  let payload: T | ApiErrorPayload
  try {
    payload = (await response.json()) as T | ApiErrorPayload
  } catch {
    throw new Error('天气服务返回了无法解析的数据')
  }

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload
    const apiMessage = errorPayload.message?.trim()
    throw new Error(apiMessage || '天气服务请求失败，请稍后重试')
  }

  return payload as T
}

// 获取当前天气，支持城市名或经纬度查询
export const getCurrentWeather = async <T = unknown>(
  params: WeatherQueryParams,
): Promise<T> => {
  validateQueryParams(params)
  const { lat, lon } = await resolveCoordinates(params)
  return requestWeatherApi<T>('/weather', lat, lon)
}

// 获取未来天气预报，支持城市名或经纬度查询
export const getForecast = async <T = unknown>(params: WeatherQueryParams): Promise<T> => {
  validateQueryParams(params)
  const { lat, lon } = await resolveCoordinates(params)
  return requestWeatherApi<T>('/forecast', lat, lon)
}

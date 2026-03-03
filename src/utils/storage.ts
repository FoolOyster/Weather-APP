export const STORAGE_KEYS = {
  FAVORITE_CITIES: 'weather_app_favorite_cities',
  LAST_QUERY_CITY: 'weather_app_last_query_city',
} as const

// 封装 localStorage 读取，统一异常兜底
export const readStorage = <T>(key: string, fallbackValue: T): T => {
  try {
    const rawValue = localStorage.getItem(key)
    if (!rawValue) {
      return fallbackValue
    }

    return JSON.parse(rawValue) as T
  } catch {
    return fallbackValue
  }
}

// 封装 localStorage 写入，避免页面崩溃
export const writeStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 本地存储不可用时静默失败，不阻断主流程
  }
}

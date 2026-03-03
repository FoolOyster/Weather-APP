import { useCallback, useEffect, useState } from 'react'
import { fetchWeatherByCity, fetchWeatherByCoordinates } from '../api/weather'
import type {
  AirQuality,
  CurrentWeather,
  DailyForecast,
  HistoricalTrendPoint,
  WeatherAlert,
} from '../types/weather'
import type { RequestStatus } from '../types/common'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'

interface UseWeatherState {
  status: RequestStatus
  current: CurrentWeather | null
  forecast: DailyForecast[]
  airQuality: AirQuality | null
  alerts: WeatherAlert[]
  history: HistoricalTrendPoint[]
  errorMessage: string | null
}

const DEFAULT_CITY = 'Shanghai'

export const useWeather = () => {
  const [state, setState] = useState<UseWeatherState>({
    status: 'idle',
    current: null,
    forecast: [],
    airQuality: null,
    alerts: [],
    history: [],
    errorMessage: null,
  })

  const fetchByCity = useCallback(async (city: string) => {
    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null }))

    try {
      const weather = await fetchWeatherByCity(city)
      setState({
        status: 'success',
        current: weather.current,
        forecast: weather.forecast,
        airQuality: weather.airQuality,
        alerts: weather.alerts,
        history: weather.history,
        errorMessage: null,
      })
      writeStorage(STORAGE_KEYS.LAST_QUERY_CITY, city)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : '天气查询失败，请稍后重试',
      }))
    }
  }, [])

  const fetchByLocation = useCallback(async (lat: number, lon: number) => {
    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null }))

    try {
      const weather = await fetchWeatherByCoordinates(lat, lon)
      setState({
        status: 'success',
        current: weather.current,
        forecast: weather.forecast,
        airQuality: weather.airQuality,
        alerts: weather.alerts,
        history: weather.history,
        errorMessage: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : '定位天气查询失败，请稍后重试',
      }))
    }
  }, [])

  const fetchComparisonCity = useCallback(async (city: string): Promise<CurrentWeather | null> => {
    try {
      const weather = await fetchWeatherByCity(city)
      return weather.current
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const lastCity = readStorage<string>(STORAGE_KEYS.LAST_QUERY_CITY, DEFAULT_CITY)
    fetchByCity(lastCity)
  }, [fetchByCity])

  return {
    ...state,
    fetchByCity,
    fetchByLocation,
    fetchComparisonCity,
  }
}

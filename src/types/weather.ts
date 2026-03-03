export type TemperatureUnit = 'metric'

export interface WeatherQuery {
  city?: string
  lat?: number
  lon?: number
  unit: TemperatureUnit
}

export interface CurrentWeather {
  cityName: string
  countryCode: string
  timezoneOffset: number
  timestamp: number
  weatherMain: string
  weatherDescription: string
  icon: string
  temp: number
  tempMin: number
  tempMax: number
  humidity: number
  windSpeed: number
}

export interface DailyForecast {
  date: string
  weatherMain: string
  weatherDescription: string
  icon: string
  tempMin: number
  tempMax: number
}

export interface FavoriteCity {
  id: string
  cityName: string
  countryCode: string
  lat?: number
  lon?: number
  addedAt: number
}

export type FavoriteCityList = FavoriteCity[]

export interface WeatherViewState {
  status: 'idle' | 'loading' | 'success' | 'error'
  query: WeatherQuery
  current: CurrentWeather | null
  forecast: DailyForecast[]
  favorites: FavoriteCityList
  errorMessage: string | null
}

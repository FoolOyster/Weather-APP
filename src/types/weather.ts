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
  lat: number
  lon: number
  timezoneOffset: number
  timestamp: number
  sunrise: number
  sunset: number
  weatherMain: string
  weatherDescription: string
  icon: string
  temp: number
  feelsLike: number
  dewPoint: number
  tempMin: number
  tempMax: number
  humidity: number
  visibility: number
  windSpeed: number
  uvIndex: number | null
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

export interface AirQuality {
  aqi: number
  level: string
  suggestion: string
  pm2_5: number
  pm10: number
  o3: number
}

export interface WeatherAlert {
  senderName: string
  event: string
  start: number
  end: number
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface HistoricalTrendPoint {
  date: string
  temp: number
}

export interface WeatherViewState {
  status: 'idle' | 'loading' | 'success' | 'error'
  query: WeatherQuery
  current: CurrentWeather | null
  forecast: DailyForecast[]
  airQuality: AirQuality | null
  alerts: WeatherAlert[]
  history: HistoricalTrendPoint[]
  favorites: FavoriteCityList
  errorMessage: string | null
}

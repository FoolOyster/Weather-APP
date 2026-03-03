import { useEffect, useMemo, useState } from 'react'
import { getBrowserLocation } from './api/geolocation'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { ErrorState } from './components/ErrorState'
import { FavoriteCities } from './components/FavoriteCities'
import { ForecastList } from './components/ForecastList'
import { LoadingState } from './components/LoadingState'
import { SearchBar } from './components/SearchBar'
import { useFavorites } from './hooks/useFavorites'
import { useWeather } from './hooks/useWeather'
import { getForecastSummary } from './utils/format'

function App() {
  const { status, current, forecast, errorMessage, fetchByCity, fetchByLocation } = useWeather()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  const [locationTip, setLocationTip] = useState<string | null>(null)

  const currentId = useMemo(() => {
    if (!current) {
      return ''
    }
    return `${current.cityName}-${current.countryCode}`.toLowerCase()
  }, [current])

  const forecastSummary = useMemo(() => getForecastSummary(forecast), [forecast])

  const handleLocate = async () => {
    try {
      const location = await getBrowserLocation()
      await fetchByLocation(location.lat, location.lon)
      setLocationTip(null)
    } catch (error) {
      setLocationTip(error instanceof Error ? error.message : '定位失败，请稍后重试')
    }
  }

  useEffect(() => {
    const autoLocate = async () => {
      try {
        const location = await getBrowserLocation()
        await fetchByLocation(location.lat, location.lon)
        setLocationTip(null)
      } catch (error) {
        setLocationTip(error instanceof Error ? error.message : '自动定位失败，请手动输入城市查询')
      }
    }

    void autoLocate()
  }, [fetchByLocation])

  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-50 text-slate-800">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-60 w-60 rounded-full bg-blue-300/25 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <header className="animate-fade-in-up space-y-2">
          <p className="text-sm font-medium text-sky-700">天气查询应用</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            天气查询应用
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            输入城市或使用定位，快速查看当前天气与未来预报，并支持收藏常用城市。
          </p>
          {forecastSummary ? (
            <p className="text-sm text-slate-500">
              近期温度区间：{Math.round(forecastSummary.low)}°C ~ {Math.round(forecastSummary.high)}
              °C
            </p>
          ) : null}
        </header>

        <SearchBar
          onSearch={fetchByCity}
          onLocate={handleLocate}
          isLoading={status === 'loading'}
        />

        {locationTip ? (
          <div className="animate-fade-in-up rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
            {locationTip}
          </div>
        ) : null}

        {status === 'loading' ? <LoadingState /> : null}
        {status === 'error' && errorMessage ? <ErrorState message={errorMessage} /> : null}

        {current ? (
          <CurrentWeatherCard
            current={current}
            onFavorite={() => addFavorite(current.cityName, current.countryCode)}
            isFavorite={isFavorite(currentId)}
          />
        ) : null}

        {forecast.length > 0 ? <ForecastList forecast={forecast} /> : null}

        <FavoriteCities favorites={favorites} onPick={fetchByCity} onRemove={removeFavorite} />
      </main>
    </div>
  )
}

export default App

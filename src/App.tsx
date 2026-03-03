import { useEffect, useMemo, useState } from 'react'
import { getBrowserLocation } from './api/geolocation'
import { AirQualityCard } from './components/AirQualityCard'
import { CityComparePanel } from './components/CityComparePanel'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { ErrorState } from './components/ErrorState'
import { FavoriteCities } from './components/FavoriteCities'
import { ForecastList } from './components/ForecastList'
import { HistoryTrendCard } from './components/HistoryTrendCard'
import { LoadingState } from './components/LoadingState'
import { SearchBar } from './components/SearchBar'
import { WeatherAlertsPanel } from './components/WeatherAlertsPanel'
import { WeatherDetailsPanel } from './components/WeatherDetailsPanel'
import { WeatherScene } from './components/WeatherScene'
import { useFavorites } from './hooks/useFavorites'
import { useWeather } from './hooks/useWeather'
import { getForecastSummary } from './utils/format'

function App() {
  const {
    status,
    current,
    forecast,
    airQuality,
    alerts,
    history,
    errorMessage,
    fetchByCity,
    fetchByLocation,
    fetchComparisonCity,
  } = useWeather()

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
    <div className="relative min-h-screen overflow-hidden text-slate-800">
      <WeatherScene weatherMain={current?.weatherMain ?? 'Clear'} />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <header className="animate-fade-in-up rounded-3xl border border-white/50 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-700">Weather Intelligence</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">天气查询应用</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
            已支持动态天气主题、AQI 健康建议、详细气象指标、多城市对比、预警与历史趋势。
          </p>
          {forecastSummary ? (
            <p className="mt-2 text-sm text-slate-500">
              近期温度区间：{Math.round(forecastSummary.low)}°C ~ {Math.round(forecastSummary.high)}°C
            </p>
          ) : null}
        </header>

        <SearchBar onSearch={fetchByCity} onLocate={handleLocate} isLoading={status === 'loading'} />

        {locationTip ? (
          <div className="animate-fade-in-up rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
            {locationTip}
          </div>
        ) : null}

        {status === 'loading' ? <LoadingState /> : null}
        {status === 'error' && errorMessage ? <ErrorState message={errorMessage} /> : null}

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
          <div className="space-y-4">
            {current ? (
              <CurrentWeatherCard
                current={current}
                onFavorite={() => addFavorite(current.cityName, current.countryCode, current.lat, current.lon)}
                isFavorite={isFavorite(currentId)}
              />
            ) : null}

            {current ? <WeatherDetailsPanel current={current} /> : null}
            {forecast.length > 0 ? <ForecastList forecast={forecast} /> : null}
            <FavoriteCities favorites={favorites} onPick={fetchByCity} onRemove={removeFavorite} />
          </div>

          <div className="space-y-4">
            <AirQualityCard airQuality={airQuality} />
            <WeatherAlertsPanel alerts={alerts} />
            <HistoryTrendCard history={history} />
            <CityComparePanel
              favorites={favorites}
              fetchComparisonCity={fetchComparisonCity}
              currentCityName={current?.cityName}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

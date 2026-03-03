import { useEffect, useState } from 'react'
import type { CurrentWeather, FavoriteCity } from '../types/weather'
import { formatTemperature } from '../utils/format'

interface CityComparePanelProps {
  favorites: FavoriteCity[]
  fetchComparisonCity: (city: string) => Promise<CurrentWeather | null>
  currentCityName?: string
}

export const CityComparePanel = ({
  favorites,
  fetchComparisonCity,
  currentCityName,
}: CityComparePanelProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [data, setData] = useState<CurrentWeather[]>([])

  useEffect(() => {
    const load = async () => {
      if (selectedIds.length === 0) {
        setData([])
        return
      }

      const selectedCities = favorites.filter((city) => selectedIds.includes(city.id)).slice(0, 3)
      const results = await Promise.all(selectedCities.map((city) => fetchComparisonCity(city.cityName)))
      setData(results.filter((item): item is CurrentWeather => item !== null))
    }

    void load()
  }, [favorites, fetchComparisonCity, selectedIds])

  const toggleCity = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, id]
    })
  }

  return (
    <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">多城市对比</h3>
      <p className="mt-1 text-xs text-slate-500">最多选择 3 个收藏城市与当前城市对比温度。</p>

      {favorites.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">请先收藏城市后再进行对比。</p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {favorites.map((city) => {
              const checked = selectedIds.includes(city.id)
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => toggleCity(city.id)}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
                    checked
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {city.cityName}
                </button>
              )
            })}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            {currentCityName ? (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sky-800">
                当前城市：{currentCityName}
              </div>
            ) : null}
            {data.map((item) => (
              <div
                key={`${item.cityName}-${item.countryCode}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                {item.cityName}：{formatTemperature(item.temp)}，{item.weatherDescription}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

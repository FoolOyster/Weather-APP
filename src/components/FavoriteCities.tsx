import { useState } from 'react'
import type { FavoriteCity } from '../types/weather'

interface FavoriteCitiesProps {
  favorites: FavoriteCity[]
  onPick: (cityName: string) => void
  onRemove: (id: string) => void
}

export const FavoriteCities = ({ favorites, onPick, onRemove }: FavoriteCitiesProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  return (
    <section className="animate-fade-in-up rounded-3xl border border-sky-100 bg-white/85 p-6 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">收藏城市</h3>

      {favorites.length === 0 ? (
        <p className="text-sm text-slate-500">还没有收藏城市，先查询并收藏一个吧。</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {favorites.map((city) => {
            const isPendingDelete = pendingDeleteId === city.id

            return (
              <div
                key={city.id}
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm"
              >
                <button
                  type="button"
                  onClick={() => onPick(city.cityName)}
                  className="cursor-pointer font-medium text-sky-700 transition-colors duration-200 hover:text-sky-900"
                >
                  {city.cityName}, {city.countryCode}
                </button>

                {!isPendingDelete ? (
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(city.id)}
                    className="cursor-pointer rounded-full px-1 text-slate-500 transition-colors duration-200 hover:text-red-500"
                    aria-label={`删除${city.cityName}`}
                  >
                    ×
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-red-500">确认删除？</span>
                    <button
                      type="button"
                      onClick={() => {
                        onRemove(city.id)
                        setPendingDeleteId(null)
                      }}
                      className="cursor-pointer rounded-md bg-red-100 px-2 py-0.5 text-red-600 transition-colors duration-200 hover:bg-red-200"
                    >
                      确认
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
                      className="cursor-pointer rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 transition-colors duration-200 hover:bg-slate-200"
                    >
                      取消
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

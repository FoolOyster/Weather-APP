import type { FavoriteCity } from '../types/weather'

interface FavoriteCitiesProps {
  favorites: FavoriteCity[]
  onPick: (cityName: string) => void
  onRemove: (id: string) => void
}

export const FavoriteCities = ({ favorites, onPick, onRemove }: FavoriteCitiesProps) => (
  <section className="animate-fade-in-up rounded-3xl border border-sky-100 bg-white/85 p-6 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
    <h3 className="mb-4 text-lg font-semibold text-slate-900">收藏城市</h3>

    {favorites.length === 0 ? (
      <p className="text-sm text-slate-500">还没有收藏城市，先查询并收藏一个吧。</p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {favorites.map((city) => (
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
            <button
              type="button"
              onClick={() => onRemove(city.id)}
              className="cursor-pointer rounded-full px-1 text-slate-500 transition-colors duration-200 hover:text-red-500"
              aria-label={`删除${city.cityName}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
)

import { getWeatherIconUrl } from '../api/weather'
import type { CurrentWeather } from '../types/weather'
import { formatTemperature, formatWindSpeed } from '../utils/format'

interface CurrentWeatherCardProps {
  current: CurrentWeather
  onFavorite: () => void
  isFavorite: boolean
}

export const CurrentWeatherCard = ({
  current,
  onFavorite,
  isFavorite,
}: CurrentWeatherCardProps) => (
  <section className="animate-fade-in-up rounded-3xl border border-sky-100 bg-white/85 p-6 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-sky-700">
          {current.cityName}, {current.countryCode}
        </p>
        <h2 className="text-4xl font-semibold text-slate-900">{formatTemperature(current.temp)}</h2>
        <p className="text-slate-600">{current.weatherDescription}</p>
      </div>
      <div className="flex items-center gap-2">
        <img
          src={getWeatherIconUrl(current.icon)}
          alt={current.weatherDescription}
          className="h-20 w-20"
        />
        <button
          type="button"
          onClick={onFavorite}
          className="h-11 cursor-pointer rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-medium text-orange-600 transition-colors duration-200 hover:bg-orange-100"
        >
          {isFavorite ? '已收藏' : '收藏城市'}
        </button>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700 sm:grid-cols-4">
      <div className="rounded-xl bg-sky-50 p-3">
        <p className="text-slate-500">最低温</p>
        <p className="mt-1 font-medium">{formatTemperature(current.tempMin)}</p>
      </div>
      <div className="rounded-xl bg-sky-50 p-3">
        <p className="text-slate-500">最高温</p>
        <p className="mt-1 font-medium">{formatTemperature(current.tempMax)}</p>
      </div>
      <div className="rounded-xl bg-sky-50 p-3">
        <p className="text-slate-500">湿度</p>
        <p className="mt-1 font-medium">{current.humidity}%</p>
      </div>
      <div className="rounded-xl bg-sky-50 p-3">
        <p className="text-slate-500">风速</p>
        <p className="mt-1 font-medium">{formatWindSpeed(current.windSpeed)}</p>
      </div>
    </div>
  </section>
)

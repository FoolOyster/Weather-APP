import { getWeatherIconUrl } from '../api/weather'
import type { DailyForecast } from '../types/weather'
import { formatDay, formatTemperature } from '../utils/format'

interface ForecastListProps {
  forecast: DailyForecast[]
}

export const ForecastList = ({ forecast }: ForecastListProps) => (
  <section className="animate-fade-in-up rounded-3xl border border-sky-100 bg-white/85 p-6 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">未来天气</h3>
      <span className="text-sm text-slate-500">最多 10 天</span>
    </div>

    <div className="space-y-3">
      {forecast.map((item) => (
        <article
          key={item.date}
          className="flex items-center justify-between rounded-2xl bg-sky-50/80 px-4 py-3 transition-colors duration-200 hover:bg-sky-100"
        >
          <div className="min-w-24 text-sm font-medium text-slate-700">{formatDay(item.date)}</div>
          <div className="flex items-center gap-2">
            <img
              src={getWeatherIconUrl(item.icon)}
              alt={item.weatherDescription}
              className="h-10 w-10"
            />
            <p className="text-sm text-slate-600">{item.weatherDescription}</p>
          </div>
          <div className="text-sm font-medium text-slate-800">
            {formatTemperature(item.tempMin)} / {formatTemperature(item.tempMax)}
          </div>
        </article>
      ))}
    </div>
  </section>
)

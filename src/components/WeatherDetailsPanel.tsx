import type { CurrentWeather } from '../types/weather'
import { formatTemperature, formatTime, formatVisibility, formatWindSpeed } from '../utils/format'

interface WeatherDetailsPanelProps {
  current: CurrentWeather
}

export const WeatherDetailsPanel = ({ current }: WeatherDetailsPanelProps) => (
  <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900">今日详细数据</h3>
    <div className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-3">
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">体感温度</p>
        <p className="mt-1 font-semibold text-slate-900">{formatTemperature(current.feelsLike)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">露点</p>
        <p className="mt-1 font-semibold text-slate-900">{formatTemperature(current.dewPoint)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">能见度</p>
        <p className="mt-1 font-semibold text-slate-900">{formatVisibility(current.visibility)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">日出时间</p>
        <p className="mt-1 font-semibold text-slate-900">{formatTime(current.sunrise)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">日落时间</p>
        <p className="mt-1 font-semibold text-slate-900">{formatTime(current.sunset)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">紫外线 UV</p>
        <p className="mt-1 font-semibold text-slate-900">
          {current.uvIndex !== null ? current.uvIndex.toFixed(1) : '暂不可用'}
        </p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">风速</p>
        <p className="mt-1 font-semibold text-slate-900">{formatWindSpeed(current.windSpeed)}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-slate-500">湿度</p>
        <p className="mt-1 font-semibold text-slate-900">{current.humidity}%</p>
      </div>
    </div>
  </section>
)

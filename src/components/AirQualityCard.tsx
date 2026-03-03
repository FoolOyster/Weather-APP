import type { AirQuality } from '../types/weather'

interface AirQualityCardProps {
  airQuality: AirQuality | null
}

export const AirQualityCard = ({ airQuality }: AirQualityCardProps) => {
  if (!airQuality) {
    return (
      <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">空气质量</h3>
        <p className="mt-2 text-sm text-slate-500">暂无法获取 AQI 数据，请稍后重试。</p>
      </section>
    )
  }

  return (
    <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">空气质量</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">AQI 指数</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{airQuality.aqi} ({airQuality.level})</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-slate-500">今日建议</p>
          <p className="mt-1 text-slate-700">{airQuality.suggestion}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
        <p className="rounded-lg bg-slate-50 px-2 py-1">PM2.5: {airQuality.pm2_5.toFixed(0)}</p>
        <p className="rounded-lg bg-slate-50 px-2 py-1">PM10: {airQuality.pm10.toFixed(0)}</p>
        <p className="rounded-lg bg-slate-50 px-2 py-1">O3: {airQuality.o3.toFixed(0)}</p>
      </div>
    </section>
  )
}

import type { HistoricalTrendPoint } from '../types/weather'
import { formatTemperature } from '../utils/format'

interface HistoryTrendCardProps {
  history: HistoricalTrendPoint[]
}

export const HistoryTrendCard = ({ history }: HistoryTrendCardProps) => {
  if (history.length === 0) {
    return (
      <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">历史天气趋势</h3>
        <p className="mt-2 text-sm text-slate-500">
          当前 API 套餐下历史天气可能不可用，已自动降级显示为空。
        </p>
      </section>
    )
  }

  const high = Math.max(...history.map((point) => point.temp))
  const low = Math.min(...history.map((point) => point.temp))

  return (
    <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">历史天气趋势（近 3 天）</h3>
      <div className="mt-3 space-y-2">
        {history.map((point) => {
          const ratio = high === low ? 100 : ((point.temp - low) / (high - low)) * 100
          return (
            <div key={point.date}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                <span>{point.date}</span>
                <span>{formatTemperature(point.temp)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.max(ratio, 8)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

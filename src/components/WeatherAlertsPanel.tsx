import type { WeatherAlert } from '../types/weather'
import { formatTimeRange } from '../utils/format'

interface WeatherAlertsPanelProps {
  alerts: WeatherAlert[]
}

const severityClassMap: Record<WeatherAlert['severity'], string> = {
  low: 'border-blue-200 bg-blue-50 text-blue-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  high: 'border-red-200 bg-red-50 text-red-800',
}

export const WeatherAlertsPanel = ({ alerts }: WeatherAlertsPanelProps) => (
  <section className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900">天气预警</h3>
    {alerts.length === 0 ? (
      <p className="mt-2 text-sm text-slate-500">当前暂无官方预警，出行请持续关注天气变化。</p>
    ) : (
      <div className="mt-3 space-y-2">
        {alerts.slice(0, 3).map((alert, index) => (
          <article
            key={`${alert.event}-${index}`}
            className={`rounded-xl border p-3 text-sm ${severityClassMap[alert.severity]}`}
          >
            <p className="font-semibold">{alert.event}</p>
            <p className="mt-1 text-xs opacity-80">发布方：{alert.senderName}</p>
            <p className="mt-1 text-xs opacity-80">{formatTimeRange(alert.start, alert.end)}</p>
            <p className="mt-2 line-clamp-2">{alert.description}</p>
          </article>
        ))}
      </div>
    )}
  </section>
)

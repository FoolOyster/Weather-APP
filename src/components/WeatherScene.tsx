interface WeatherSceneProps {
  weatherMain: string
  weatherDescription?: string
}

const sceneClassMap: Record<string, string> = {
  Clear: 'bg-[radial-gradient(circle_at_top,#bfdbfe_0%,#dbeafe_45%,#f8fafc_100%)]',
  Clouds: 'bg-[radial-gradient(circle_at_top,#cbd5e1_0%,#e2e8f0_45%,#f8fafc_100%)]',
  Rain: 'bg-[radial-gradient(circle_at_top,#334155_0%,#64748b_40%,#cbd5e1_100%)]',
  Drizzle: 'bg-[radial-gradient(circle_at_top,#94a3b8_0%,#cbd5e1_45%,#f1f5f9_100%)]',
  Thunderstorm: 'bg-[radial-gradient(circle_at_top,#64748b_0%,#94a3b8_45%,#e2e8f0_100%)]',
  Snow: 'bg-[radial-gradient(circle_at_top,#e2e8f0_0%,#f1f5f9_45%,#ffffff_100%)]',
  Mist: 'bg-[radial-gradient(circle_at_top,#cbd5e1_0%,#e2e8f0_45%,#f8fafc_100%)]',
}

const isHeavyRain = (description?: string): boolean => {
  if (!description) {
    return false
  }

  return (
    description.includes('大雨') ||
    description.includes('暴雨') ||
    description.includes('强降雨') ||
    description.includes('heavy')
  )
}

export const WeatherScene = ({ weatherMain, weatherDescription }: WeatherSceneProps) => {
  const heavyRain = weatherMain === 'Rain' && isHeavyRain(weatherDescription)
  const sceneClass = heavyRain
    ? 'bg-[radial-gradient(circle_at_top,#0f172a_0%,#334155_40%,#94a3b8_100%)]'
    : (sceneClassMap[weatherMain] ?? sceneClassMap.Clear)
  const showRainDrops = ['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMain)
  const rainCount = heavyRain ? 44 : weatherMain === 'Drizzle' ? 18 : 30
  const rainOpacityClass = heavyRain ? 'bg-slate-100/70' : 'bg-slate-300/55'
  const dropHeightClass = heavyRain ? 'h-9' : 'h-6'

  return (
    <>
      <div className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-700 ${sceneClass}`} />
      <div className="pointer-events-none absolute -top-20 left-10 h-52 w-52 rounded-full bg-white/35 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
      {showRainDrops ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: rainCount }).map((_, index) => (
            <span
              key={index}
              className={`absolute w-[2px] animate-rain ${dropHeightClass} ${rainOpacityClass}`}
              style={{
                left: `${(index + 1) * (100 / rainCount)}%`,
                animationDelay: `${(index % 9) * 0.12}s`,
                animationDuration: `${heavyRain ? 0.55 + (index % 4) * 0.08 : 0.9 + (index % 4) * 0.18}s`,
                transform: `rotate(${heavyRain ? -18 : -10}deg)`,
              }}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

interface WeatherSceneProps {
  weatherMain: string
}

const sceneClassMap: Record<string, string> = {
  Clear: 'bg-[radial-gradient(circle_at_top,#bfdbfe_0%,#dbeafe_45%,#f8fafc_100%)]',
  Clouds: 'bg-[radial-gradient(circle_at_top,#cbd5e1_0%,#e2e8f0_45%,#f8fafc_100%)]',
  Rain: 'bg-[radial-gradient(circle_at_top,#94a3b8_0%,#cbd5e1_45%,#f8fafc_100%)]',
  Drizzle: 'bg-[radial-gradient(circle_at_top,#94a3b8_0%,#d1d5db_45%,#f8fafc_100%)]',
  Thunderstorm: 'bg-[radial-gradient(circle_at_top,#64748b_0%,#94a3b8_45%,#e2e8f0_100%)]',
  Snow: 'bg-[radial-gradient(circle_at_top,#e2e8f0_0%,#f1f5f9_45%,#ffffff_100%)]',
  Mist: 'bg-[radial-gradient(circle_at_top,#cbd5e1_0%,#e2e8f0_45%,#f8fafc_100%)]',
}

export const WeatherScene = ({ weatherMain }: WeatherSceneProps) => {
  const sceneClass = sceneClassMap[weatherMain] ?? sceneClassMap.Clear
  const showRainDrops = ['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMain)

  return (
    <>
      <div className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-700 ${sceneClass}`} />
      <div className="pointer-events-none absolute -top-20 left-10 h-52 w-52 rounded-full bg-white/30 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 h-40 w-40 rounded-full bg-white/25 blur-2xl" />
      {showRainDrops ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-4 w-px animate-rain bg-slate-500/30"
              style={{
                left: `${(index + 1) * 5}%`,
                animationDelay: `${(index % 5) * 0.2}s`,
                animationDuration: `${0.8 + (index % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}

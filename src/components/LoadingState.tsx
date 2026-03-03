export const LoadingState = () => (
  <div className="animate-fade-in-up flex items-center gap-3 rounded-2xl border border-sky-100 bg-white/80 p-4 text-sm text-sky-700 shadow-sm">
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600"
      aria-hidden="true"
    />
    <span>正在查询天气，请稍候...</span>
  </div>
)

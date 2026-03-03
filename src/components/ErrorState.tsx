interface ErrorStateProps {
  message: string
}

export const ErrorState = ({ message }: ErrorStateProps) => (
  <div className="animate-fade-in-up rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
    {message}
  </div>
)

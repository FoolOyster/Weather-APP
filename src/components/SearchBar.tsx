import { useState } from 'react'
import type { FormEvent } from 'react'

interface SearchBarProps {
  onSearch: (city: string) => void
  onLocate: () => void
  isLoading: boolean
}

export const SearchBar = ({ onSearch, onLocate, isLoading }: SearchBarProps) => {
  const [city, setCity] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!city.trim()) {
      return
    }
    onSearch(city.trim())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row"
    >
      <label className="sr-only" htmlFor="city-input">
        输入城市名
      </label>
      <input
        id="city-input"
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="输入城市名，例如：Shanghai"
        className="h-11 flex-1 rounded-xl border border-sky-200 px-4 text-slate-800 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-blue-500"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 flex-1 cursor-pointer rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          查询天气
        </button>
        <button
          type="button"
          onClick={onLocate}
          disabled={isLoading}
          className="h-11 cursor-pointer rounded-xl border border-sky-200 bg-white px-4 text-sm font-medium text-sky-700 transition-colors duration-200 hover:bg-sky-50 disabled:cursor-not-allowed"
        >
          使用定位
        </button>
      </div>
    </form>
  )
}

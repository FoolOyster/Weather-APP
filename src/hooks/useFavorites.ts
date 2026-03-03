import { useEffect, useMemo, useState } from 'react'
import type { FavoriteCity } from '../types/weather'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'

// 统一管理收藏城市的读取与持久化
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() =>
    readStorage(STORAGE_KEYS.FAVORITE_CITIES, []),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEYS.FAVORITE_CITIES, favorites)
  }, [favorites])

  const favoriteIdSet = useMemo(() => new Set(favorites.map((city) => city.id)), [favorites])

  const addFavorite = (cityName: string, countryCode: string, lat?: number, lon?: number) => {
    const id = `${cityName}-${countryCode}`.toLowerCase()
    if (favoriteIdSet.has(id)) {
      return
    }

    setFavorites((prev) => [{ id, cityName, countryCode, lat, lon, addedAt: Date.now() }, ...prev])
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite: (id: string) => favoriteIdSet.has(id.toLowerCase()),
  }
}

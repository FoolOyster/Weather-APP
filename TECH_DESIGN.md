# 天气查询应用技术设计

## 技术栈
- 前端：React + TypeScript + Vite
- 样式：Tailwind CSS
- 存储：LocalStorage
- 天气 API：OpenWeatherMap API

## 项目结构
```txt
weather-app/
├─ public/
├─ src/
│  ├─ api/
│  │  ├─ weather.ts                # 天气/空气质量/预警/历史趋势接口封装
│  │  ├─ weatherApi.ts             # 通用天气 API 工具（保留）
│  │  └─ geolocation.ts            # 浏览器定位封装
│  ├─ components/
│  │  ├─ SearchBar.tsx
│  │  ├─ CurrentWeatherCard.tsx
│  │  ├─ WeatherDetailsPanel.tsx
│  │  ├─ ForecastList.tsx
│  │  ├─ AirQualityCard.tsx
│  │  ├─ WeatherAlertsPanel.tsx
│  │  ├─ HistoryTrendCard.tsx
│  │  ├─ CityComparePanel.tsx
│  │  ├─ FavoriteCities.tsx
│  │  ├─ WeatherScene.tsx
│  │  ├─ LoadingState.tsx
│  │  └─ ErrorState.tsx
│  ├─ hooks/
│  │  ├─ useWeather.ts
│  │  └─ useFavorites.ts
│  ├─ types/
│  │  ├─ weather.ts
│  │  └─ common.ts
│  ├─ utils/
│  │  ├─ format.ts
│  │  ├─ storage.ts
│  │  └─ mapper.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env.local
├─ .env.example
├─ README.md
└─ TECH_DESIGN.md
```

## 数据模型（核心）

### 查询与状态
```ts
type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

interface WeatherQuery {
  city?: string
  lat?: number
  lon?: number
  unit: 'metric'
}
```

### 当前天气
```ts
interface CurrentWeather {
  cityName: string
  countryCode: string
  lat: number
  lon: number
  timezoneOffset: number
  timestamp: number
  sunrise: number
  sunset: number
  weatherMain: string
  weatherDescription: string
  icon: string
  temp: number
  feelsLike: number
  dewPoint: number
  tempMin: number
  tempMax: number
  humidity: number
  visibility: number
  windSpeed: number
  uvIndex: number | null
}
```

### 预报与扩展模块
```ts
interface DailyForecast {
  date: string
  weatherMain: string
  weatherDescription: string
  icon: string
  tempMin: number
  tempMax: number
}

interface AirQuality {
  aqi: number
  level: string
  suggestion: string
  pm2_5: number
  pm10: number
  o3: number
}

interface WeatherAlert {
  senderName: string
  event: string
  start: number
  end: number
  description: string
  severity: 'low' | 'medium' | 'high'
}

interface HistoricalTrendPoint {
  date: string
  temp: number
}
```

### 收藏城市
```ts
interface FavoriteCity {
  id: string
  cityName: string
  countryCode: string
  lat?: number
  lon?: number
  addedAt: number
}
```

### 聚合视图状态
```ts
interface WeatherViewState {
  status: RequestStatus
  query: WeatherQuery
  current: CurrentWeather | null
  forecast: DailyForecast[]
  airQuality: AirQuality | null
  alerts: WeatherAlert[]
  history: HistoricalTrendPoint[]
  favorites: FavoriteCity[]
  errorMessage: string | null
}
```

## LocalStorage Key
```ts
const STORAGE_KEYS = {
  FAVORITE_CITIES: 'weather_app_favorite_cities',
  LAST_QUERY_CITY: 'weather_app_last_query_city',
} as const
```

## 关键实现说明
1. 城市查询与定位查询共用同一套天气聚合流程。
2. 城市名优先中文显示（地理编码 `local_names` + 反向地理编码补充）。
3. 页面采用信息分区布局：核心天气、详情、预报、AQI、预警、历史趋势、多城市对比。
4. 动态背景主题根据天气类型切换，并在雨天显示雨滴动画。
5. 对 OpenWeather 3.0 能力（UV/官方预警/历史）做降级处理，保证主流程稳定。
6. 收藏城市持久化到 LocalStorage，支持快捷查询与二次确认删除。

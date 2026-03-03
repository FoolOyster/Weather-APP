# 天气查询应用技术设计

## 技术栈
- 前端：React + TypeScript + Vite
- 样式：Tailwind CSS
- 存储：LoaclStroage
- 天气查询API：OpenWeatherMap API

## 项目结构
```txt
weather-app/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ api/
│  │  ├─ weather.ts            # OpenWeatherMap API 请求封装
│  │  └─ geolocation.ts        # 浏览器定位 + 经纬度转天气查询参数
│  ├─ components/
│  │  ├─ SearchBar.tsx         # 城市搜索输入与触发查询
│  │  ├─ CurrentWeatherCard.tsx# 当天天气卡片（温度/湿度/风速等）
│  │  ├─ ForecastList.tsx      # 未来10天天气列表
│  │  ├─ FavoriteCities.tsx    # 收藏城市列表
│  │  ├─ LoadingState.tsx      # 加载态
│  │  └─ ErrorState.tsx        # 错误提示
│  ├─ hooks/
│  │  ├─ useWeather.ts         # 查询天气与状态管理
│  │  └─ useFavorites.ts       # 收藏城市的增删改查（LocalStorage）
│  ├─ store/
│  │  └─ weatherStore.ts       # 可选：集中管理查询状态（如后续复杂化）
│  ├─ types/
│  │  ├─ weather.ts            # 领域模型与 API DTO 类型
│  │  └─ common.ts             # 通用类型（加载状态、错误类型）
│  ├─ utils/
│  │  ├─ format.ts             # 温度、日期、风速等格式化
│  │  ├─ storage.ts            # LocalStorage 读写工具
│  │  └─ mapper.ts             # API 响应 -> 前端领域模型映射
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env.local                  # VITE_OPENWEATHER_API_KEY=xxx（不提交）
├─ .env.example
├─ package.json
└─ TECH_DESIGN.md
```


## 数据模型
1. 查询参数与通用状态
```ts
type TemperatureUnit = "metric"; // MVP 固定摄氏度

interface WeatherQuery {
  city?: string;        // 城市名查询
  lat?: number;         // 定位查询
  lon?: number;
  unit: TemperatureUnit;
}

type RequestStatus = "idle" | "loading" | "success" | "error";
```

2. 当前天气（页面主卡片）
```ts
interface CurrentWeather {
  cityName: string;
  countryCode: string;
  timezoneOffset: number;
  timestamp: number;
  weatherMain: string;        // 如 Clear / Rain
  weatherDescription: string; // 如 clear sky
  icon: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
}
```

3. 十天预报（列表展示）
```ts
interface DailyForecast {
  date: string;    // YYYY-MM-DD（本地格式化前）
  weatherMain: string;
  weatherDescription: string;
  icon: string;
  tempMin: number;
  tempMax: number;
}
```

4. 收藏城市（LocalStorage 持久化）
```ts
interface FavoriteCity {
  id: string;          // `${cityName}-${countryCode}` 或 uuid
  cityName: string;
  countryCode: string;
  lat?: number;
  lon?: number;
  addedAt: number;     // 时间戳
}

type FavoriteCityList = FavoriteCity[];
```

5. 页面聚合状态（建议）
```ts
interface WeatherViewState {
  status: RequestStatus;
  query: WeatherQuery;
  current: CurrentWeather | null;
  forecast: DailyForecast[];
  favorites: FavoriteCityList;
  errorMessage: string | null;
}
```

6. LocalStorage Key 约定
```ts
const STORAGE_KEYS = {
  FAVORITE_CITIES: "weather_app_favorite_cities",
  LAST_QUERY_CITY: "weather_app_last_query_city"
} as const;
```


## 关键技术点
1. 处理好API调用，做好可能的错误处理，给出友好的提示
2. 请求过程中显示加载动画
3. 保证API key的安全，使用环境变量。把 API Key 放进.env.local文件，代码中通过环境变量读取
4. 规划好界面设计，提供的信息可能会有点多，不要使界面显得太杂乱

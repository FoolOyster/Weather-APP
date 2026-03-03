# 天气查询应用

基于 `React + TypeScript + Vite + Tailwind CSS` 的明亮主题天气查询应用。

## 功能

- 城市天气查询（当前温度、最高/最低温、湿度、风速）
- 未来天气预报（按天聚合，最多显示 10 天）
- 收藏城市（LocalStorage 持久化）
- 浏览器定位查询

## 本地启动

```bash
npm install
cp .env.example .env.local
# 在 .env.local 中填写 OpenWeatherMap API Key
npm run dev
```

## 环境变量

- `VITE_OPENWEATHER_API_KEY`：OpenWeatherMap API Key

## 技术说明

- 使用函数式组件与 Hooks
- 使用 Tailwind CSS（通过 `@tailwindcss/vite` 接入）
- 代码结构遵循 `TECH_DESIGN.md` 的分层设计

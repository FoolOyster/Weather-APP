# 天气查询应用

基于 `React + TypeScript + Vite + Tailwind CSS` 的天气查询应用，支持多维天气信息展示与城市对比。

## 当前功能

- 城市天气查询（输入城市名搜索）
- 浏览器自动定位与手动定位查询
- 当前天气信息展示：温度、体感、湿度、风速、能见度、露点、日出日落、紫外线（可用时）
- 未来天气预报（按天聚合，最多显示 10 天）
- 空气质量展示（AQI、PM2.5、PM10、O3）与健康建议
- 天气预警展示（优先官方预警，失败时回退到风险提示）
- 历史天气趋势（近 3 天，接口不可用时自动降级提示）
- 多城市温度对比（基于收藏城市，最多选择 3 个）
- 收藏城市（LocalStorage 持久化、快捷查询、删除二次确认）
- 根据天气动态切换背景主题，并提供雨天动效

## 本地启动

```bash
npm install
cp .env.example .env.local
# 在 .env.local 中填写 OpenWeatherMap API Key
npm run dev
```

## 环境要求

- Node.js 18+（建议使用当前 LTS）
- OpenWeatherMap API Key

## 环境变量

- `VITE_OPENWEATHER_API_KEY`：OpenWeatherMap API Key

## 接口说明与降级策略

- 当前天气与预报：使用 OpenWeather `2.5` 接口
- 空气质量：使用 OpenWeather `air_pollution` 接口
- 紫外线、官方预警、历史趋势：使用 OpenWeather `3.0 onecall` 相关接口
- 若 `3.0` 接口受套餐限制或失败：
  - 紫外线显示为“暂不可用”
  - 预警模块回退为基于天气类型的风险提示
  - 历史趋势模块显示降级提示，不影响主流程

## 技术说明

- 使用函数式组件与 Hooks
- 使用 Tailwind CSS（通过 `@tailwindcss/vite` 接入）
- 代码结构遵循 `TECH_DESIGN.md` 的分层设计

export interface GeoLocationResult {
  lat: number
  lon: number
}

// 浏览器定位封装，统一 Promise 化便于 hooks 调用
export const getBrowserLocation = (): Promise<GeoLocationResult> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('当前浏览器不支持定位功能'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => {
        reject(new Error('定位失败，请检查浏览器权限设置'))
      },
      {
        timeout: 8000,
      },
    )
  })

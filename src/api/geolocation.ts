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
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('你已拒绝定位权限，请在浏览器设置中允许定位后重试'))
          return
        }

        if (error.code === error.TIMEOUT) {
          reject(new Error('定位超时，请检查网络或稍后重试'))
          return
        }

        reject(new Error('定位失败，当前无法获取你的位置信息'))
      },
      {
        timeout: 8000,
      },
    )
  })

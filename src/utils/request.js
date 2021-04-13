// 导入axios
import store from '@/store'
import axios from 'axios'
import router from '@/router'
import { getTimeStamp } from './auth'
import { Message } from 'element-ui'
const TimeOut = 3600 // 时间存放为1个小时 3600秒
// 创建axios实例
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置基础路径地址 process.env环境变量
  timeout: 6000 // 设置超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 只有token才有时间戳
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      router.push('/login') // 进入登录页面
      return Promise.reject(new Error('Token超时了'))
    }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  // 返回执行的错误对象
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // 为axios默认加了一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进 then ？ 不能！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息 里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout') // 登出操作
    router.push('/login') // 进入登录页面
  } else {
    Message.error(error.message) // 提示错误消息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch
})

// 调用token超时的函数 当前的时间戳 减去进去的时间戳 如果大于token的存放时间 那就超时
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
// 默认导出axios实例
export default service

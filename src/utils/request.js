/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-24 13:51:45
 */
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth.js'
import store from '@/store'
import router from '@/router'
// 定义token超时时间
const TimeOut = 3600 // 秒
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置基础地址
  timeout: 15000 // 设置超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 注入token
    // 判断sotre下的token是否存在
    if (store.getters.token) {
      // 主动检查token时间戳是否超时
      if (IsCheckTimeOut()) {
        // token超时
        store.dispatch('user/logout')
        // 跳转到登录页
        router.push('/login')
        // return
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须要返回
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  function(response) {
    const { success, message, data } = response.data
    // 根据success的成功与否执行下面的操作
    if (success) {
      return data
    }
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message)) // 进入catch
  },
  function(error) {
    // 判断token是否超时 -- 被动检查token是否超时
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // code=10002 token超时
      store.dispatch('user.logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  })
// 是否超时
// 超时逻辑 当前时间-缓存时间 是否大于 时间差
function IsCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service

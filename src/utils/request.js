/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-16 15:38:05
 */
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置基础地址
  timeout: 5000 // 设置超时时间
})
service.interceptors.request.use()

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
    Message.error(error.message)
    return Promise.reject(error)
  }
)
export default service

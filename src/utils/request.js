/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-15 15:53:30
 */
import axios from 'axios'

const service = axios.create()
service.interceptors.request.use()
service.interceptors.response.use()
export default service

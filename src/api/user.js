/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-28 09:52:17
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

// 获取用户资料的接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
// 获取用户的基本信息 ---显示头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

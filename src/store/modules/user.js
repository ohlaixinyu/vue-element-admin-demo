/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-17 18:34:16
 */

import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user.js'

const state = {
  token: getToken(), // 设置token为共享状态
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, result) {
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
const actions = {
  // 登录
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    // 拿到token说明登录成功
    setTimeStamp()
  },

  // 获取用户信息
  async getUserInfo(context) {
    const res = await getUserInfo()
    // 执行获取用户详情接口
    const baseInfo = await getUserDetailById(res.userId)
    // 合并数据
    const baseResult = { ...res, ...baseInfo }
    context.commit('setUserInfo', baseResult)
    return res // 这里是给我们做权限的时候留下伏笔
  },
  // 登出操作
  logout(context) {
    context.commit('removeToken') // 不仅删除Vuex中的 还删除了缓存中的
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

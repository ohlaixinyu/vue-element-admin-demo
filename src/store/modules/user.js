/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-16 15:40:29
 */

import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user.js'

const state = {
  token: getToken() // 设置token为共享状态
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
const actions = {

  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

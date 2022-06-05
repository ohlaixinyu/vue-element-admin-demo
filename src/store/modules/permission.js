/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-06-02 10:20:42
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-02 10:54:34
 */

// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router/'

const state = {
  // 用户拥有的的静态路由权限
  routes: constantRoutes
}
const mutations = {
  // 修改routes方法
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
// 筛选权限路由
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出动态路由中和menus中能对上的路由
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 将动态路由提交给mutaitions  用于左侧菜单
    context.commit('setRoutes', routes)
    // 用于路由
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

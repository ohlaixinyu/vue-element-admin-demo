/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-16 16:55:48
 */

// 权限拦截 导航守卫
import router from '@/router'
import store from '@/store'
// 进度条插件
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 白名单
const whiteList = ['/login', '/404']

// 前置守卫
router.beforeEach((to, from, next) => {
  // 开启进度条显示
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // 跳到主页
    }
    next()
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 在百名单中
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 关闭进度条
})

// 后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})

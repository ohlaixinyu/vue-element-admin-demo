/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-15 13:35:28
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-02 13:01:08
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
router.beforeEach(async(to, from, next) => {
  // 开启进度条显示
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      // 如果当前vuex中有用户的id 已经有资料了 不需要再获取
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // routes就是筛选得到的动态路由
        // 添加到路由表中
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        /**
         * 注意 添加动态权限后 要用next(to.path) 这是一个已知的错误
         * **/
        next(to.path)
      }
      next()
    }
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

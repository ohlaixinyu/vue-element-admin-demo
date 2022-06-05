/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-06-02 13:19:29
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-02 13:23:39
 */

import store from '@/store'
// 混入对象
export default {
  methods: {
    // 检查权限 key=>要检查的点
    checkPermission(key) {
      // 去用户的信息里找points中有没有key
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}

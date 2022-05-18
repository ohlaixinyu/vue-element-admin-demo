/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-18 14:18:58
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-18 16:09:52
 */
// 导出员工的路由规则
import Layout from '@/layout'
export default {
// 路由规则
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '', // 这里不用写
      component: () => import('@/views/employees'),
      // 路由元信息
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    }
  ]
}

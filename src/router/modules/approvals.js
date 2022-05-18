/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-18 14:18:58
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-18 16:12:10
 */
// 导出员工的路由规则
import Layout from '@/layout'

export default {
  // 路由规则
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: '', // 这里不用写
      component: () => import('@/views/approvals'),
      // 路由元信息
      meta: {
        title: '审批',
        icon: 'tree-table'
      }
    }
  ]
}


<!--
 * @Description
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-18 14:14:00
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-20 17:37:45
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="false">
          <!-- 传入插槽内容 -->
          <tree-tools slot-scope="{data}" :tree-node="data" @ @delDepts="getDeparments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- dialog -->
    <add-depts ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDeparments" />
  </div>
</template>

<script>
// components
import TreeTools from '@/views/departments/components/tree-tools.vue'
import AddDepts from '@/views/departments/components/add-dept.vue'

// api
import { getDeparments } from '@/api/departments'

// js
import { tranListToTreeData } from '@/utils/'

export default {
  components: {
    TreeTools,
    AddDepts
  },
  data() {
    return {
      company: { name: '', manager: '宇哥' },
      departs: [],
      defaultProps: { // 默认值 树形组件内容解析
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      node: null // 记录当前点击的部门
    }
  },
  created() {
    this.getDeparments()
  },
  mounted() {

  },
  methods: {
    async getDeparments() {
      try {
        const res = await getDeparments()
        this.company = { name: res.companyName, manager: '负责人', id: '' }
        // 转化树形结构
        this.departs = tranListToTreeData(res.depts, '')
      } catch (error) {
        console.log(error)
      }
    },
    // 添加子部门
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    // 编辑部门
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 调用子组件获取部门详情的方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped lang='scss'>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>

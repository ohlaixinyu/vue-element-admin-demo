<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-06-01 14:14:27
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-01 15:09:00
-->
<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center" style="width:100%">
      <el-col :span="100">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// api
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employess'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      list: [], // 角色列表
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  mounted() {

  },
  methods: {
    // 获取所有的角色
    async getRoleList() {
      const { rows } = await getRoleList({
        page: 1, pagesize: 20
      })
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds === null ? [] : roleIds
      console.log(roleIds)
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      // 重置数据
      this.roleIds = []
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped lang="less">

</style>

<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-18 15:29:22
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-02 10:08:59
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <!-- 审核 -->
            <el-table border :data="list">
              <el-table-column type="index" align="center" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{row}">
                  <el-button type="success" icon="el-icon-plus" size="small" @click="getPermissionList(row.id)">分配权限</el-button>
                  <el-button type="primary" icon="el-icon-plus" size="small" @click="editRole(row.id)">编辑权限</el-button>
                  <el-button type="danger" icon="el-icon-plus" size="small" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              />
              <el-row />
            </el-row></el-tab-pane>

          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹层 -->
    <el-dialog title="编辑" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- footer -->
      <el-row type="flex" justify="center">
        <el-col :span="5">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个弹层 -->
    <el-dialog title="分配权限" :visible="showPerDialog" @close="btnPerCancel">
      <!-- 树形组件 -->
      <el-tree
        ref="permTree"
        :data="perData"
        :props="defaultProps"
        :default-checked-keys="selectCheck"
        node-key="id"
        :show-checkbox="true"
        :check-strictly="true"
      />
      <!-- 底部确认取消 -->
      <el-row type="flex" justify="center">
        <el-col :span="100">
          <el-button type="primary" size="small" @click="btnPerOk">确定</el-button>
          <el-button size="small" @click="btnPerCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// api
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'

export default {
  data() {
    return {
      list: [], // 角色数据
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false, // 新增编辑
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPerDialog: false, // 控制先分配权限弹层
      perData: [], // 分配权限数据
      defaultProps: {
        label: 'name'
      }, // 树形组件默认设置
      roleId: null,
      selectCheck: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // 当前点击的页码 newpage
      this.page.page = newPage // 更新页码
      this.getRoleList()
    },
    async  getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id)
        this.$message.success('删除角色成功')
        // 重载数据 更新视图
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 实现数据回写
      this.showDialog = true // 显示弹层
    },
    async btnOk() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增功能
          await addRole(this.roleForm)
        }
        this.$message.success('操作成功')
        this.getRoleList() // 重载数据
        this.showDialog = false
      } catch (error) {
        this.$message.fail('格式校验失败')
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
      this.$refs.roleForm.restFields()
    },
    // 获取树形结构数据
    async getPermissionList(id) {
      // 拉取权限点列表数据
      const result = await getPermissionList()
      this.perData = tranListToTreeData(result, '0')
      // 获取当前编辑的用户id
      this.roleId = id
      // 回写数据
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPerDialog = true
    },
    async btnPerOk() {
      // 获取选择的数据并且发送
      console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPerDialog = false
    },
    btnPerCancel() {
      this.showPerDialog = false
      this.selectCheck = []
    }

  }
}
</script>

<style scoped lang="less">

</style>

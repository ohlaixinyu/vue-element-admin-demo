<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-18 14:14:25
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-01 14:42:59
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示 excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-card>
        <el-table v-loading="loading" :data="list" border>
          <el-table-column type="index" align="center" label="序号" sortable="" width="100" />
          <el-table-column label="姓名" prop="username" sortable="" width="100" />
          <el-table-column label="头像" align="center">
            <template v-slot="{row}">
              <img v-imagerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" alt="" style="width:50px" @click="showqr(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" />
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-pagination
            layout="prev,pager,next"
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync 修饰符 是 子组件去改变父组件得数据的一个语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showDialogqr">
      <el-row type="flex" justify="center">
        <canvas ref="mycanvs" />
      </el-row>
    </el-dialog>
    <!-- 权限分配弹层 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
// api
import { getEmployeeList, delEmployee } from '@/api/employess'
import EmployeeEnum from '@/api/constant/employees'

// components
import AddEmployee from '@/views/employees/components/add-employee.vue'
import AssignRole from '@/views/employees/components/assign-role.vue'

// utils
import QrCode from 'qrcode'

export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [], // 员工信息
      page: {
        page: 1, // 当前页码
        size: 10, // 每页数量
        total: 0 // 总数
      },
      showDialogqr: false, // 二维码显示弹层
      showRoleDialog: false, // 角色显示弹层
      loading: false, // 遮罩层
      showDialog: false, // 弹层显示控制
      userId: ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  mounted() {

  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      // 赋值最新页码
      this.page.page = newPage
      console.log(newPage)
      // 重新拉取数据
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, colum, cellValue, index) {
      // 去找cellValue对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗？')
        await delEmployee(id)
        this.$message.success('删除员工成功')
        // 更新数据
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // excel导出
    async exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 获取所有的数据
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.page.total
      })
      // 格式化数据
      const data = this.formatJson(rows, headers)
      // 复杂表头处理
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      // 合并单元格
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      // 懒加载模块
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          multiHeader,
          header: Object.keys(headers), // 导出的数据表头
          data, // 导出的数据
          filename: 'talk', // 导出文件名
          merges,
          bookType: 'xlsx' // 导出的文件类型
        })
      })
    },
    // 格式化数据
    formatJson(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 显示二维码
    showqr(url) {
      if (url) {
        this.showDialogqr = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.mycanvs, url)
        })
      } else {
        this.$message.warning('该用户还未上传二维码')
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }

}
</script>

<style scoped lang="scss">

</style>

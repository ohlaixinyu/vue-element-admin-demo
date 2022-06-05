<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-18 14:14:51
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-02 08:59:46
-->
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1,0)">
            添加权限
          </el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <!-- 添加按钮只在 访问权限层级显示 当type===1 时才显示 -->
            <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑弹窗 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form ref="formdata" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
            style="width:90%"
          />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row type="flex" justify="center">
        <el-col :span="100">
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

// api
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
// utils
import { tranListToTreeData } from '@/utils/index'

export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      // 有id就是编辑 没有id就是新增
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除
    async delPermission(id) {
      this.$confirm('确定要删除吗?').then(() => {
        return delPermission(id)
      }).then(() => {
        // 删除成功
        this.$message.success('删除成功')
        // 重新拉取数据
        this.getPermissionList()
      })
    },
    // 添加
    async addPermission(type, pid) {
      // type=1 访问权 type=2 按钮操作权
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 确定
    btnOk() {
      // 验证表单
      this.$refs.formdata.validate().then(async() => {
        if (this.formData.id) {
          // 更新
          return await updatePermission(this.formData)
        }
        // 新增
        return await addPermission(this.formData)
      }).then(() => {
        // 清除数据
        this.formData = {
          name: '', // 名称
          code: '', // 标识
          description: '', // 描述
          type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
          pid: '', // 因为做的是树 需要知道添加到哪个节点下了
          enVisible: '0' // 开启
        }
        this.$refs.formdata.resetFields()
        // 关闭弹层
        this.showDialog = false
        // 添加成功
        this.$message.success('操作成功')
        // 更新视图
        this.getPermissionList()
      })
    },
    // 取消
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.formdata.resetFields()
      this.showDialog = false
    },
    // 编辑
    async editPermission(id) {
      // 回写数据
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style scoped lang="less">

</style>

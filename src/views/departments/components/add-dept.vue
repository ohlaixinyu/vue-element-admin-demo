<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-19 18:43:00
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-20 18:27:15
-->
<template>
  <div>
    <el-dialog :visible="showDialog" :title="showTitle" @close="btnCancel">
      <!-- 表单数据 -->
      <!-- 表单验证的前置条件 form=> model rules   form-item=>prop   input=> v-model -->
      <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
            <el-option v-for="item in peoples" :key="item.id" :value="item.username" :label="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <!-- footer -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
// api
import { getDeparments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employess'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDeparments()
      // 去找同级部门下 有没有和value相同的数据
      let isReapt = false
      if (this.formData.id) {
        // 有id就是编辑模式
        //  同级部门下 我的名字不能和其他部门的名字进行重复
        isReapt = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 否则就是新增模式
        isReapt = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      // 如果返回true 则找到了一样的名字
      isReapt ? callback(new Error(`同级部门下已经存在【${value}】这个名字了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDeparments()
      // 要求编码 和所有部门的都不能重复
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`部门编码【${value}】已经存在了`)) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      },
      peoples: [] // 下拉框数据
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门 '
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    btnOk() {
      // 手校验表单
      this.$refs.deptForm.validate(async isOk => {
        // 说明表单校验成功
        if (isOk) {
          if (this.formData.id) {
            // 编辑部门
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 告诉父组件 更新数据
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      // 重置数据 因为resetFields 只能重置表单上的数据 非表单上的 比如 编辑的id 是无法清除的
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验 并且还原了绑定的表单数据
      this.$refs.deptForm.resetFields()
    },
    // 获取部门详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

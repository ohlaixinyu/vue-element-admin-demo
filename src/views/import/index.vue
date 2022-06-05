<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-22 16:34:08
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-24 15:22:08
-->
<template>
  <upload-excel :on-success="success" />
</template>

<script>
// api
import { importEmployee } from '@/api/employess'

export default {
  methods: {
    async success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 方法1
      // const arr = []
      // results.forEach(item => {
      //   const userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     // 现在key是中文
      //     userInfo[userRelations[key]] = item[key]
      //   })
      //   arr.push(userInfo)
      // })

      // 方法2
      const newArr = results.map(item => {
        const userinfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userinfo[userRelations[key]] = this.formatJson(item[key], '-') // 必须为时间格式才能入库
          } else {
            userinfo[userRelations[key]] = item[key]
          }
        })
        return userinfo
      })
      await importEmployee(newArr)
      this.$message.success('导入成功')
      this.$router.push('/employees')
    },
    // 转换excel日期格式
    formatJson(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped lang="scss">

</style>

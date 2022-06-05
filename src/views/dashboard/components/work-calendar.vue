<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-06-04 09:56:24
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-04 10:40:59
-->
<template>
  <div>
    <!-- 年月 -->
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <el-select
        v-model="currentyear"
        size="small"
        style="width:120px"
        @change="changeDate"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}</el-option>
      </el-select>
      <!-- 月 -->
      <el-select
        v-model="currentMonth"
        size="small"
        style="width:120px;margin-left:10px"
        @change="changeDate"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{date,data}">
        <div class="date-content">
          <span class="text"> {{ data.day|getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(val) {
      const day = val.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default() {
        return new Date()
      } // 如果没有传递 就取当前时间
    }
  },
  data() {
    return {
      yearList: [], // 要遍历的年的数组
      currentyear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null// 当前的时间
    }
  },
  created() {
    // 获取当前年份
    this.currentyear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (v, i) => i + this.currentyear - 5)
    this.changeDate()
  },
  methods: {
    changeDate() {
      this.currentDate = new Date(`${this.currentyear}-${this.currentMonth}-1`)
    },
    // 判断是否休息
    isWeek(date) {
      return date.getDay() === 0 || date.getDay() === 6
    }
  }
}
</script>

<style scoped>
/deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>

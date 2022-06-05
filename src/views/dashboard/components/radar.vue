<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-06-04 10:49:01
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-04 11:11:38
-->
<template>
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 按需引入echarts
// 引入echarts主模块
const echarts = require('echarts/lib/echarts')
// 引入雷达图
require('echarts/lib/chart/radar')
// 引入标题和提示框
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  data() {
    return {

    }
  },
  mounted() {
    const myEcharts = echarts.init(this.$refs.myDiv)

    // 配置项
    const option = {
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: 'Sales', max: 6500 },
          { name: 'Administration', max: 16000 },
          { name: 'Information Technology', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending'
            }
          ]
        }
      ]
    }
    // 启动
    option && myEcharts.setOption(option)
  },
  methods: {

  }
}
</script>

<style scoped >
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>

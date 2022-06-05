<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-06-04 11:38:53
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-04 11:47:57
-->
<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff;width:20px;height:20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

export default {
  data() {
    return {

    }
  },
  methods: {
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        this.$message.warning('当前全屏不可用')
        return
      }
      ScreenFull.toggle()
    }
  }
}
</script>

<style scoped lang="less">

</style>

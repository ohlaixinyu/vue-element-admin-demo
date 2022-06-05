<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-28 10:55:54
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-31 19:50:19
-->
<template>
  <div>
    <el-upload
      list-type="picture-card"
      action="#"
      :limit="1"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
      :on-preview="preview"
      :on-remove="remove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i
        class="
      el-icon-plus"
      />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percentage" style="width:180px" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" style="width:100%">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'

// 创建上传实例
const cos = new COS({
  SecretId: 'AKIDwgANK0PYR3OTHo43lEQLzMRFm32meFad', // 身份识别ID
  SecretKey: 'oLccMp1xc192ez3sQhgOq2xby4tRjkUx' // 身份密钥
})

export default {
  data() {
    return {
      showPercent: false,
      showDialog: false,
      imgUrl: '',
      percentage: 0,
      currentFileUid: null, // 记录当前正在上传的uid
      fileList: []
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 预览图片
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除图片
    remove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 增加图片
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传图片
    beforeUpload(file) {
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传格式只能是jpeg、gif、bmp、png格式')
        return false
      }
      // 检查文件大小 限制图片大小为 5M以内
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 超过限制文件大小
        this.$message.error('超出文件大小限制')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后一定到return true
    },
    // 上传图片
    upload(params) {
      if (params) {
        cos.putObject({
          Bucket: 'laixinyu-1308078892', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-chengdu', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: (params) => {
            this.percentage = params.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            // 文件上传成功
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                console.log(1)
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percentage = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
  display: none !important;
}
</style>

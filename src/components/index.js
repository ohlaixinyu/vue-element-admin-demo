/*
 * @Description:负责所有全局自定义组件的注册
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-22 09:40:49
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-04 17:34:23
 */
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import imageUpload from '@/components/imageUpload/index.vue'
import ScreenFull from '@/components/screenFull/index.vue'
import ThemePicker from '@/components/ThemePicker'
import LangSelect from '@/components/lang/index.vue'
import TagsView from '@/components/TagsView'

export default {
  install(Vue) {
  //  组件的注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('imageUpload', imageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('LangSelect', LangSelect)
    Vue.component('TagsView', TagsView)
  }
}

/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-17 17:51:14
 * @LastEditors: Marvin
 * @LastEditTime: 2022-05-17 18:04:46
 */

export const imagerror = {
// 指令对象
  inserted(dom, option) {
    // dom当前指令作用的dom对象
    // option 指令中变量的解释
    // 当图片有地址 但没有加载成功 会触发一个图片的一个事件 onerror
    dom.onerror = function() {
      dom.src = option.value // 不能写死
    }
  }
}

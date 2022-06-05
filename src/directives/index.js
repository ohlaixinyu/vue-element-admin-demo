/*
 * @Description:
 * @Version: 2.0
 * @Autor: Marvin
 * @Date: 2022-05-17 17:51:14
 * @LastEditors: Marvin
 * @LastEditTime: 2022-06-01 13:27:09
 */

export const imagerror = {
// 指令对象 该指令会在当前的dom元素插入到节点之后执行
  inserted(dom, option) {
    // dom当前指令作用的dom对象
    // option 指令中变量的解释
    dom.src = dom.src || option.value // 初始化的时候 如果有值 则赋值 如果没值 则需要进行默认值赋值
    // 当图片有地址 但没有加载成功 会触发一个图片的一个事件 onerror
    dom.onerror = function() {
      dom.src = option.value // 不能写死
    }
  },
  // 这也是一个钩子函数
  componentUpdated(dom, option) {
    // 该钩子函数会在当前指令作用的组件 更新数据完毕之后执行
    // inserted只会执行一次
    // 组件初始化 一旦更新就会再进入 inserted函数 会进去 componentUpdated
    dom.src = dom.src || option.value
  }
}

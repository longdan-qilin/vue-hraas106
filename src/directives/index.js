// 负责管理所有的自定义指令

// 自定义指令 => 多个页面中的DOM元素需要做同样的操作的时候可以考虑封装一个指令,可以实现逻辑复用

export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options是 指令中的变量的解释 其中有一个属性叫做  value
    // dom 表示当前指令作用的dom对象
    // dom认为此时就是图片
    // 如果图片可以加载那么就用加载的图片如果不行 请求不了 那么就用后面获取的
    dom.src = dom.src || options.value // 初始化的时候 如果有值 则赋值 如果没值 则需要进行默认赋值

    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 =》 onerror
    dom.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为改图片的内存
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  },
  // 组件跟新API
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

// <img v-imageerror='img' />
// data() { return  { img: 'a.png' } }

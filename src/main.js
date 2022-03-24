import Vue from 'vue'
import Component from '@/components'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import i18n from '@/lang'
import checkPermission from '@/mixin/checkPermission'
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
// 注册自定义指令
import * as directives from '@/directives'
// 注册自定义过滤器
import * as filters from '@/filters'
import storage from '@/utils/storage'

// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.prototype.$storage = storage
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale }) // 注册自已的插件
// 如果想要中文版 element-ui，按如下方式声明

/*
  element 本身支持i18n的处理
  此时 i18n就会根据当前的locale属性去寻找对应的显示内容
  t方法 会去对应的语言包里寻找对应的内容
*/
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(Component)
Vue.mixin(checkPermission) // 全局拥有了这个方法
Vue.config.productionTip = false // 控制台不会出现提示生产模式的消息 如果打包了  就没了 主要是说在开发模式

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

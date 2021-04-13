// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import Lang from './Lang'
import TagsView from './TagsView'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象 前面的组件的名称 后面组件的对象
    Vue.component('PageTools', PageTools) // 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册导入全屏组件
    Vue.component('ThemePicker', ThemePicker) // 注册导入动态主题组件
    Vue.component('Lang', Lang) // 注册导入切换语言组件
    Vue.component('TagsView', TagsView) // 注册导入切换语言组件
    Vue.use(Print) // 注册打印组件
  }
}

import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)
/*
  自动去svg目录下找 false代表不去子目录找 最后面正则是只找以svg结尾的文件来导入
  带有上下文的require
*/
// req是一个带有上下文的require 并且它有一个属性叫keys()
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
/*
  console.log(req.keys())
  req.keys().forEach(item => req(item))
*/

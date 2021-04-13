// 导入动态 静态路由
import { asyncRoutes, constantRoutes } from '@/router/index'

const state = {
  // 默认静态路由权限
  routes: constantRoutes
}

const mutations = {
  // 修改路由状态
  setRoutes(state, newRoutes) {
    // 在静态路由去修改 而不是在上次路由去修改 每个用户的路由权限不同的
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  // 异步调用 因为用户信息上有该用户的权限标识
  // 权限标识（数量少） = 拥有的路由权限（左侧的 菜单是所有的路由 如果拥有所有权限 菜单全部显示）
  // 因此只需要判断一下 和所有动态路由对比下 一样的就拿出来 返回就是该用户的权限
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      // 得到一个数组 有可能 有元素 也有可能是空数组
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', routes)
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}

// 导出vuex模块对象
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

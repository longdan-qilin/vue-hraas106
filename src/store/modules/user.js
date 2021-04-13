import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router/index'
// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  /* 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name */
  userInfo: {} // 定义一个空的对象 获取用户信息的初始状态
}
// 修改状态
const mutations = {
  // 把获取的token 跟新到state中
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 移除token 且清空缓存的token
  removeToken() {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    // 用浅拷贝的方式来依次解构赋值给state的数据对象中 这样数据更新之后才会触发组件的更新
    state.userInfo = { ...userInfo }
  },
  // 删除用户信息
  removeUserInfo() {
    state.userInfo = {}
  }
}
// 异步修改状态
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async getLogin(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // 写入时间戳 将当前最新的时间写入缓存
    setTimeStamp()
  },

  // 获取用户资料 action
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...baseInfo, ...result } // 将2个 得到的结果解构合并
    context.commit('setUserInfo', baseResult) // 将获取的值信息对象 设置到用户的vuex数据当中
    return baseResult // 返回这个结果 为后面埋下伏笔
  },

  // 登出功能
  async logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅删除了vuex中的 还删除了缓存中的token
    context.commit('removeUserInfo') // 删除用户资料
    // 路由重置
    resetRouter()
    // 清空permission中state数据
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

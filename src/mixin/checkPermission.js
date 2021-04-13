import store from '@/store'
export default {
  // 导出这个混入的对象 公共的代码 提高复用性
  methods: {
    checkPermission(key) {
      // 如果传入的 标识 用户拥有这个 就认定该用户有这个权限
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}

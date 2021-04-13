import request from '@/utils/request'

// 用户登录模块
export const login = data => {
  return request({
    // 返回一个axios对象 => promise  // 返回了一个promise对象
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'POST',
    data
  })
}
// 用户信息模块
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 员工基本信息模块 主要是为了显示头像 通过用户信息模块 获取id
export function getUserDetailById(id) {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}
export function logout() {

}

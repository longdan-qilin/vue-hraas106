import request from '@/utils/request'

// 获取角色列表 params是查询参数，里面需要携带分页信息
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

// 根据id查询企业信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
    method: 'GET'
  })
}

// 根据ID删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

// 根据ID获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

// 根据ID更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: `/sys/role`,
    method: 'POST',
    data
  })
}

// 角色分配权限的 api
export function assignPerm(data) {
  return request({
    url: `/sys/role/assignPrem`,
    method: 'PUT',
    data
  })
}

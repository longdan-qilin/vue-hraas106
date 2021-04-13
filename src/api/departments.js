/* 组织架构模块 */
import request from '@/utils/request'

/* 获取组织架构的请求** */
export function getDepartMents() {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export function delDepartMents(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

// 新增部门
export function addDepartMents(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

// 根据ID查询部门详情
export function getDepartDetail(id) {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}

// 根据ID修改部门详情
export function updateDepartments(data) {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}

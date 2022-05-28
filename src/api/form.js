import request from '@/utils/request'

// 查询流程表单列表
export function listForm(query) {
  return request({
    url: '/flowable/form/list',
    method: 'get',
    params: query
  })
}

// 查询自定义流程表单列表
export function listCustomForm(query) {
  return request({
    url: '/flowable/sysCustomForm/list',
    method: 'get',
    params: query
  })
}


// 根据选择关联的流程定义，更新自定义流程表单列表
export function updateCustom(data) {
  return request({
    url: '/flowable/sysCustomForm/updateCustom',
    method: 'post',
    data: data
  })
}

// 查询流程表单详细
export function getForm(formId) {
  return request({
    url: '/flowable/form/' + formId,
    method: 'get'
  })
}

// 查询流程自定义表单详细
export function getCustomForm(formId) {
  return request({
    url: '/flowable/sysCustomForm/' + formId,
    method: 'get'
  })
}

// 新增流程表单
export function addForm(data) {
  return request({
    url: '/flowable/form/add',
    method: 'post',
    data: data
  })
}

// 修改流程表单
export function updateForm(data) {
  return request({
    url: '/flowable/form/edit',
    method: 'put',
    data: data
  })
}
// 挂载表单
export function addDeployForm(data) {
  return request({
    url: '/flowable/sysDeployForm/add',
    method: 'post',
    data: data
  })
}

// 删除流程表单
export function delForm(formId) {
  return request({
    url: '/flowable/form/' + formId,
    method: 'delete'
  })
}

// 导出流程表单
export function exportForm(query) {
  return request({
    url: '/flowable/form/export',
    method: 'get',
    params: query
  })
}

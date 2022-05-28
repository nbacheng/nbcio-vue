import {axios as request} from '@/utils/request'

// 所有流程任务，管理用
export function allProcessList(query) {
  return request({
    url: '/flowable/task/allProcess',
    method: 'get',
    params: query
  })
}

// 我的发起的流程
export function myProcessList(query) {
  return request({
    url: '/flowable/task/myProcess',
    method: 'get',
    params: query
  })
}

// 我的发起的流程
export function myProcessNewList(query) {
  return request({
    url: '/flowable/task/myProcessNew',
    method: 'get',
    params: query
  })
}

// 取消申请
export function stopProcess(data) {
  return request({
    url: '/flowable/task/stopProcess',
    method: 'post',
    data: data
  })
}

// 取消申请
export function deleteByDataId(instanceId,deleteReason,dataId) {
  const data = {
    instanceId:instanceId,
    deleteReason:deleteReason,
    dataId:dataId
  }
  return request({
    url: '/flowable/instance/delete',
    method: 'delete',
    params: data
  })
}


// 部署流程实例
export function deployStart(deployId) {
  return request({
    url: '/flowable/process/startFlow/' + deployId,
    method: 'get',
  })
}

// 查询流程定义详细
export function getDeployment(id) {
  return request({
    url: '/system/deployment/' + id,
    method: 'get'
  })
}

// 新增流程定义
export function addDeployment(data) {
  return request({
    url: '/system/deployment',
    method: 'post',
    data: data
  })
}

// 修改流程定义
export function updateDeployment(data) {
  return request({
    url: '/system/deployment',
    method: 'put',
    data: data
  })
}

// 删除流程实例
export function delDeployment(id,dataid) {
  return request({
    url: '/flowable/instance/delete/?instanceId=' + id + '&dataid=' + dataid,
    method: 'delete'
  })
}

// 导出流程定义
export function exportDeployment(query) {
  return request({
    url: '/system/deployment/export',
    method: 'get',
    params: query
  })
}

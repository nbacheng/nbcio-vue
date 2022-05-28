import {axios as request} from '@/utils/request'

// 查询待办任务列表
export function todoList(query) {
  return request({
    url: '/flowable/task/todoList',
    method: 'get',
    params: query
  })
}


// 查询待办任务列表
export function todoListNew(query) {
  return request({
    url: '/flowable/task/todoListNew',
    method: 'get',
    params: query
  })
}

// 完成任务
export function complete(data) {
  return request({
    url: '/flowable/task/complete',
    method: 'post',
    data: data
  })
}

// 完成任务
export function completeTask(data) {
  return request({
    url: '/flowable/task/complete',
    method: 'post',
    data: data
  })
}

// 委派任务
export function delegateTask(data) {
  return request({
    url: '/flowable/task/delegate',
    method: 'post',
    data: data
  })
}

//转办任务
export function assignTask(data) {
  return request({
    url: '/flowable/task/assign',
    method: 'post',
    data: data
  })
}

// 退回任务
export function returnTask(data) {
  return request({
    url: '/flowable/task/return',
    method: 'post',
    data: data
  })
}

// 驳回任务
export function rejectTask(data) {
  return request({
    url: '/flowable/task/reject',
    method: 'post',
    data: data
  })
}

// 可退回任务列表
export function returnList(data) {
  return request({
    url: '/flowable/task/returnList',
    method: 'post',
    data: data
  })
}

// 下一节点 todo 目前直接自动分配到候选人，不用主动选人，如有需要再开发
export function getNextFlowNode(data) {
  return request({
    url: '/flowable/task/nextFlowNode',
    method: 'post',
    data: data
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
    url: '/flowable/instance/delete/?instanceId=' + id + '&dataId=' + dataid,
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

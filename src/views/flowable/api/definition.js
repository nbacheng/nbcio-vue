import {axios as request} from '@/utils/request'

// 查询流程定义列表
export function listDefinition(query) {
  return request({
    url: '/flowable/definition/list',
    method: 'get',
    params: query
  })
}

// 部署流程实例,流程定义id
export function definitionStartByDefId(procDefId,data) {
  return request({
    url: '/flowable/definition/startByProcDefId/' + procDefId,
    method: 'post',
    data: data
  })
}


// 部署流程实例，流程定义key
export function definitionStartByDefKey(procDefKey,data) {
  return request({
    url: '/flowable/definition/startByProcDefKey/' + procDefKey,
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 部署流程实例,业务数据dataid

export function definitionStartByDataId(dataId,serviceName,data) {
  return request({
    url: '/flowable/definition/startByDataId/' + dataId + '/' + serviceName,
    method: 'post',
    data: data
  })
}

// 获取流程变量
export function getProcessVariables(taskId) {
  return request({
    url: '/flowable/task/processVariables/' + taskId,
    method: 'get'
  })
}

// 激活/挂起流程
export function updateState(params) {
  return request({
    url: '/flowable/definition/updateState',
    method: 'put',
    params: params
  })
}

// 指定流程办理人员列表
export function userList(query) {
  return request({
    url: '/flowable/definition/userList',
    method: 'get',
    params: query
  })
}

// 指定流程办理组列表
export function roleList(query) {
  return request({
    url: '/flowable/definition/roleList',
    method: 'get',
    params: query
  })
}
// 指定流程分类列表
export function categoryList(query) {
  return request({
    url: '/flowable/definition/categoryList',
    method: 'get',
    params: query
  })
}

// 读取xml文件
export function readXml(deployId) {
  return request({
    url: '/flowable/definition/readXml/' + deployId,
    method: 'get'
  })
}
// 读取xml文件
export function readXmlByDataId(dataId) {
  return request({
    url: '/flowable/definition/readXmlByDataId/' + dataId,
    method: 'get'
  })
}

// 读取xml文件
export function readXmlByName(processDefinitionName) {
  return request({
    url: '/flowable/definition/readXmlByName/' + processDefinitionName,
    method: 'get'
  })
}

// 读取image文件
export function readImage(deployId) {
  return request({
    url: '/flowable/definition/readImage/' + deployId,
    method: 'get'
  })
}

// 读取image文件
export function getFlowViewer(procInsId) {
  return request({
    url: '/flowable/task/flowViewer/' + procInsId,
    method: 'get'
  })
}
// 读取image文件
export function getFlowViewerByDataId(dataId) {
  return request({
    url: '/flowable/task/flowViewerByDataId/' + dataId,
    method: 'get'
  })
}

// 读取image文件
export function getFlowViewerByName(processDefinitionName) {
  return request({
    url: '/flowable/task/flowViewerByName/' + processDefinitionName,
    method: 'get'
  })
}

// 读取xml文件
export function saveXml(data) {
  return request({
    url: '/flowable/definition/save',
    method: 'post',
    data: data
  })
}

// 删除流程定义
export function delDeployment(query) {
  return request({
    url: '/flowable/definition/delete/',
    method: 'delete',
    params: query
  })
}

// 删除流程定义
export function listallnode(processName) {
  return request({
    url: '/flowable/definition/listallnode/',
    method: 'post',
    params: processName
  })
}

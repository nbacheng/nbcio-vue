<template>
  <div>
    <a-form style="max-width: 1024px; margin: 40px auto 0;">   
       <a-card>
         <a-row>
           <a-col :sm="8" :xs="24">审批流程名称：{{flow_title}}</a-col>
         </a-row>
       </a-card>
        <a-card>
        <a-timeline>
            <a-timeline-item color="green">
              发起人：{{originatorUserid}}
            </a-timeline-item>
            <a-timeline-item :key="index" color="blue" v-for="(item,index) in tasks">
              <div v-if="item.taskResult == 'AGREE'">
                <p>{{index+1}} - {{item.userid}} , 已完成   {{item.finishTime}}</p>
                <div v-for="(oper,index) in operationRecords">
                  <div v-if="item.userid == oper.userid">
                     <p> {{oper.remark}} </p>
                  </div>   
                </div>
              </div>
              <div v-else-if="item.taskResult == 'REFUSE'">
                 <p>{{index+1}} - {{item.userid}} , 已拒绝  {{item.finishTime}}</p>
              </div>
              <div v-else-if="item.taskResult == 'NONE'">
                <div v-if="item.taskStatus == 'RUNNING'">
                   <p>{{index+1}} - {{item.userid}}, 审批中  </p> 
                </div>
                <div v-else-if="item.taskStatus == 'NEW'">
                   <p>{{index+1}} - {{item.userid}}  </p> 
                </div> 
              </div>
            </a-timeline-item>
        </a-timeline>
        </a-card>
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">抄送人员:</a-col>
            <a-col :sm="16" :xs="24">{{ccUserids}}</a-col>
          </a-row>
        </div>
        <a-card>
          <p slot="title">
            <span>流程图</span>
          </p>
          <a-row style="position: relative"> 
            <bpmnModeler ref="bpm" :xml="xmlData" :is-view="true"></bpmnModeler>
          </a-row> 
        </a-card>
    </a-form>
  </div>
</template>

<script>
  /*
  desc:  从钉钉api接口中获取薪资审批流程详细信息
  author: nbacheng
  date:   2022-04-01
  */
  import { postAction, getAction, postActionForDingDing } from '@/api/manage'
  import Vue from 'vue'
  import store from '@/store/'
  import {getFlowViewerByName, readXmlByName} from "@views/flowable/api/definition";
  import bpmnModeler from "workflow-bpmn-modeler";
  import moment from 'moment';
  
  export default {
    name: "OaFlowList",
    components: {
      bpmnModeler
    },
  
    data () {
      return {
        xmlData:'',
        loadingImg: false,
        processId: '', //薪资审批流程表id
        processDefinitionName: '',  //流程名称
        process_instance_id: '',  //流程实例id
        loading: false,
        flow_title: '',   //流程标题
        originatorUserid: '',  //发起人
        tasks: '',  //任务列表
        operationRecords: '',  //操作人员列表
        ccUserids: '',   //抄送人员列表
        processStatus: 0,  //流程状态
        processResult: '', //流程结果
        endTime: new Date(),
        url: {
          processinstancegetdetail: "/processinstance/getdetail",
        },
      }
    },
    created() {   
      this.processDefinitionName = this.$route.query.name;
      this.process_instance_id = this.$route.query.processInstanceId;
      this.GetProcessInstance();
    },
    computed: {
      //token header
      tokenHeader() {
        let head = {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
        let tenantid = Vue.ls.get(TENANT_ID)
        if (tenantid) {
          head['tenant-id'] = tenantid
        }
        return head;
      }
    },
    watch: {
      processDefinitionName: function(newval, oldName) {
            this.getModelDetail();
        }
    },
    methods: {
      GetProcessInstance: function(){ 
        var that = this;
        const params = {
          instanceId: that.process_instance_id
        }
        that.loading = true;
        console.log("params=" , params);
        postActionForDingDing(that.url.processinstancegetdetail, params).then((res) => {
          if (res.success) {
            console.log(res.result);
            that.flow_title = res.result.title;
            that.originatorUserid = res.result.originatorUserid;
            that.tasks = res.result.tasks;
            that.operationRecords = res.result.operationRecords;
            that.ccUserids = res.result.ccUserids;
            
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.loading = false
        })
      },
      /** xml 文件 */
      getModelDetail() {
        // 发送请求，获取xml
        readXmlByName(this.processDefinitionName).then(res => {
          this.xmlData = res.result
          this.getFlowViewer()
        })
      },
      // 流程进行情况
      getFlowViewer() {
        getFlowViewerByName(this.processDefinitionName).then(res => {
          this.taskList = res.result || []
          this.fillColor();
        })
      },
      fillColor() {
        const modeler = this.$refs.bpm.modeler;
        const canvas = modeler.get('canvas')
        modeler._definitions.rootElements[0].flowElements.forEach(n => {
          const completeTask = this.taskList.find(m => m.key === n.id)
          const todoTask = this.taskList.find(m => !m.completed)
          const endTask = this.taskList[this.taskList.length - 1]
          if (n.$type === 'bpmn:UserTask') {
            if (completeTask) {
              canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
              n.outgoing.forEach(nn => {
                const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
                if (targetTask) {
                  if (todoTask && completeTask.key === todoTask.key && !todoTask.completed){
                    canvas.addMarker(nn.id, todoTask.completed ? 'highlight' : 'highlight-todo')
                    canvas.addMarker(nn.targetRef.id, todoTask.completed ? 'highlight' : 'highlight-todo')
                  }else {
                    canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                    canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                  }
                }
              })
            }
          }
          // 排他网关
          else if (n.$type === 'bpmn:ExclusiveGateway') {
            if (completeTask) {
              canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
              n.outgoing.forEach(nn => {
                const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
                if (targetTask) {
      
                  canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                  canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                }
      
              })
            }
      
          }
          // 并行网关
          else if (n.$type === 'bpmn:ParallelGateway') {
            if (completeTask) {
              canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
              n.outgoing.forEach(nn => {
                debugger
                const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
                if (targetTask) {
                  canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                  canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                }
              })
            }
          }
          else if (n.$type === 'bpmn:StartEvent') {
            n.outgoing.forEach(nn => {
              const completeTask = this.taskList.find(m => m.key === nn.targetRef.id)
              if (completeTask) {
                canvas.addMarker(nn.id, 'highlight')
                canvas.addMarker(n.id, 'highlight')
                return
              }
            })
          }
          else if (n.$type === 'bpmn:EndEvent') {
            if (endTask.key === n.id && endTask.completed) {
              canvas.addMarker(n.id, 'highlight')
              return
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
  //below for flowable
  .highlight.djs-shape .djs-visual > :nth-child(1) {
    fill: green !important;
    stroke: green !important;
    fill-opacity: 0.2 !important;
  }
  .highlight.djs-shape .djs-visual > :nth-child(2) {
    fill: green !important;
  }
  .highlight.djs-shape .djs-visual > path {
    fill: green !important;
    fill-opacity: 0.2 !important;
    stroke: green !important;
  }
  .highlight.djs-connection > .djs-visual > path {
    stroke: green !important;
  }
  // .djs-connection > .djs-visual > path {
  //   stroke: orange !important;
  //   stroke-dasharray: 4px !important;
  //   fill-opacity: 0.2 !important;
  // }
  // .djs-shape .djs-visual > :nth-child(1) {
  //   fill: orange !important;
  //   stroke: orange !important;
  //   stroke-dasharray: 4px !important;
  //   fill-opacity: 0.2 !important;
  // }
  .highlight-todo.djs-connection > .djs-visual > path {
    stroke: orange !important;
    stroke-dasharray: 4px !important;
    fill-opacity: 0.2 !important;
  }
  .highlight-todo.djs-shape .djs-visual > :nth-child(1) {
    fill: orange !important;
    stroke: orange !important;
    stroke-dasharray: 4px !important;
    fill-opacity: 0.2 !important;
  }
  .overlays-div {
    font-size: 10px;
    color: red;
    width: 100px;
    top: -20px !important;
  }
</style>
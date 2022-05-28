<template>
  <div>
    <a-form style="max-width: 1024px; margin: 40px auto 0;">
      <result title="操作结果" :is-success="true" description="请通知审批人员到钉钉进行审批">
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">审批实例ID：</a-col>
            <a-col :sm="16" :xs="24">{{process_instance_id}}</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">是否成功：</a-col>
            <a-col :sm="16" :xs="24">{{success}}</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">返回描述：</a-col>
            <a-col :sm="16" :xs="24">{{message}}</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">返回码：</a-col>
            <a-col :sm="16" :xs="24">{{code}}</a-col>
          </a-row>
        </div>
        <div slot="action">
          <a-button type="primary" @click="finish">再提交审批一笔</a-button>
          <a-button style="margin-left: 8px" @click="toSalaryApprovalList">查看审批单</a-button>
        </div>
      </result>
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
  desc:  第三步，从store里取出选择部门与年月，调用后端接口提交钉钉审批，成功后返回审批id号
  author: nbacheng
  date:   2022-02-28
  */
  import { postAction, putAction } from '@/api/manage'
  import Vue from 'vue'
  import store from '@/store/'
  import Result from '../../result/Result'
  import {getFlowViewerByName, readXmlByName} from "@views/flowable/api/definition";
  import bpmnModeler from "workflow-bpmn-modeler";

  const ruleBaseURL = '/sys/fillRule/executeRuleByCode/'
  export default {
    name: "Step3",
    components: {
      bpmnModeler,
      Result
    },
  
    data () {
      return {
        xmlData:'',
        type: 0,
        loadingImg: false,
        processDefinitionName: '',
        operesult: '',
        process_instance_id: '',
        success: '',
        message: '',
        code: '',
        loading: false,
        applyNum: {
          applyNum: '',
        },
        url: {
          rule: {
                    applyNum: ruleBaseURL + 'oa_xz_code'
          },
          salaryapprove: "/estar/oaGzspb/salaryapprove",
          salaryapprovalAdd: "/estar/oaSalaryapproval/add"
        },
      }
    },
    created() {
      let params = {};
      params.salaryyear = Vue.ls.get("yearmonth").trim().substring(0, 4);
      params.salarymonth = Vue.ls.get("yearmonth").trim().substring(4, 6);
      params.depno = Vue.ls.get("depno");
      this.submitApproval(this.url.salaryapprove, params);
      
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
      salaryApprovalAdd(url, params) {
        if (!url) {
          this.$message.error("请设置url属性!")
          return
        }
        //this.loading = true;
        console.log("addparams" , params);
        postAction(url, params).then((res) => {
          if (res.success) {
            //this.operesult = '操作成功';
      
          } else {
            //this.operesult = '操作失败';
            this.$message.warning(res.message);
          }
        }).finally(() => {
          //this.loading = false
        })
      },
      submitApproval(url, params) {
        if (!url) {
          this.$message.error("请设置url属性!")
          return
        }
        this.loading = true;
        console.log(params);
        postAction(url, params).then((res) => {
          if (res.success) {
            this.operesult = '操作成功';
            this.process_instance_id = res.result;
            this.success = res.success;
            this.message = res.message;
            this.code = res.code;
            // 成功后调用流程图信息
            this.processDefinitionName = Vue.ls.get("depname");

            putAction (this.url.rule.applyNum, this.applyNum).then(res => {
            // 执行成功，获取返回的值，并赋到页面上
              if (res.success) {
                //成功后插入薪资审批申请单里
                let addparams = {};
                addparams.no = res.result;
                addparams.processInstanceId = this.process_instance_id;
                addparams.processStatus = 1;
                addparams.name = Vue.ls.get("depname");
                addparams.reason = Vue.ls.get("yearmonth") + "薪资审批";
                this.$options.methods.salaryApprovalAdd(this.url.salaryapprovalAdd, addparams);  
              }
            })          
          } else {
            this.operesult = '操作失败';
            this.$message.warning(res.message);
            this.message = res.message;
            this.code = res.code;
          }
        }).finally(() => {
          this.loading = false
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
      },
      finish () {
        this.$emit('finish')
      },
      toSalaryApprovalList () {
        this.$router.push('/estar/OaSalaryapprovalList')
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
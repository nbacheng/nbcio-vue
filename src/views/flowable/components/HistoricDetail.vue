<style lang="less">
</style>
<template>
  <div class="search">
    <a-card style="margin-bottom:10px;">
      <p slot="title">
        <span>流程审批进度历史</span>
      </p>
      <a-row style="position:relative">
        <div class="block">
          <a-timeline>
            <a-timeline-item
              v-for="(item,index ) in flowRecordList"
              :key="index"
              :color="setColor(item.finishTime)"
            >
              <p style="font-weight: 700">{{item.taskName}}<i v-if="!item.finishTime">(待办中。。。)</i></p>

              <a-card :body-style="{ padding: '10px' }">
                <label v-if="item.assigneeName&&item.finishTime" style="font-weight: normal;margin-right: 30px;">实际办理人： {{item.assigneeName}} <a-tag type="info" size="mini">{{item.deptName}}</a-tag></label>
                <label v-if="item.candidate" style="font-weight: normal;margin-right: 30px;">候选办理人： {{item.candidate}}</label>
                <label style="font-weight: normal">接收时间： </label><label style="color:#8a909c;font-weight: normal">{{item.createTime}}</label>
                <label v-if="item.finishTime" style="margin-left: 30px;font-weight: normal">办结时间： </label><label style="color:#8a909c;font-weight: normal">{{item.finishTime}}</label>
                <label v-if="item.duration" style="margin-left: 30px;font-weight: normal">耗时： </label><label style="color:#8a909c;font-weight: normal">{{item.duration}}</label>

                <!--<p  v-if="item.comment">
                
                  <a-tag color="green" v-if="item.comment.type === '1'">通过：  {{item.comment.comment}}</a-tag>
                  <a-tag color="orange" v-if="item.comment.type === '2'">退回：  {{item.comment.comment}}</a-tag>
                  <a-tag color="red" v-if="item.comment.type === '3'">驳回：  {{item.comment.comment}}</a-tag>
                </p>-->
                 <!--  1 正常意见  2 退回意见 3 驳回意见   4-委派  5-转办             -->
                <p v-if="item.listFlowCommentDto" v-for="(commentitem,index ) in item.listFlowCommentDto" :key="index">
                   <a-tag color="green" v-if="commentitem.type === '1'">通过 {{commentitem.comment}}</a-tag>
                   <a-tag color="orange" v-if="commentitem.type === '2'">退回 {{commentitem.comment}}</a-tag>
                   <a-tag color="red" v-if="commentitem.type === '3'">驳回  {{commentitem.comment}}</a-tag>
                   <a-tag color="green" v-if="commentitem.type === '4'">委派  {{commentitem.comment}}</a-tag>
                   <a-tag color="green" v-if="commentitem.type === '5'">转办   {{commentitem.comment}}</a-tag>
                 </p>
              </a-card>
            </a-timeline-item>
          </a-timeline>
        </div>
      </a-row>
    </a-card>

    <a-card>
      <p slot="title">
        <span>流程图</span>
      </p>
      <a-row style="position:relative">
        <bpmnModeler ref="bpm" :xml="xmlData" :is-view="true"></bpmnModeler>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import {flowRecordBydataid} from "@views/flowable/api/finished";
import {getFlowViewerByDataId, readXmlByDataId} from "@views/flowable/api/definition";
import bpmnModeler from "workflow-bpmn-modeler";

export default {
    name: 'HistoricDetail',
  components: {
    bpmnModeler,
  },
    props: {
    /**/
        dataId: {
            type: String,
            default: '',
            required: true
        }
    },
    data() {
        return {
            taskList:[],
            flowRecordList: [], // 流程流转数据
            formData:{},
            xmlData:'',
            type: 0,
            loading: false, // 表单加载状态
            loadingImg: false,
            data: [],
            id: '',
            imgUrl: '',
            backRoute: ''
        };
    },
    created() {
        this.init();
    },
    watch: {
      dataId: function(newval, oldName) {
            this.init();
        }
    },

    methods: {
        init() {
          this.getFlowRecordList()
          this.getModelDetail()
        },
      /** xml 文件 */
      getModelDetail() {
        // 发送请求，获取xml
        readXmlByDataId(this.dataId).then(res => {
          this.xmlData = res.result
          this.getFlowViewer()
        })
      },
      // 流程进行情况
      getFlowViewer() {
        getFlowViewerByDataId(this.dataId).then(res => {
          this.taskList = res.result || []
          this.fillColor();
        })
      },
      /** 流程流转记录 */
      getFlowRecordList() {
        const params = {dataId: this.dataId}
        flowRecordBydataid(params).then(res => {
          // console.log(res)
          this.flowRecordList = res.result.flowList;
          // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
          if (res.result.formData) {
            this.formData = res.result.formData;
          }
        }).catch(res => {
          console.log(res)
        })
      },
        setColor(val) {
          if (val) {
            return "#2bc418";
          } else {
            return "#b3bdbb";
          }
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

};
</script>
<style lang="less">
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
<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="el-icon-document">基础信息</span>
        <el-button style="float: right;" type="primary" @click="goBack">返回</el-button>
      </div>

      <!--初始化流程加载自定义表单信息-->
      <el-col :span="16" :offset="4" v-if="customForm.visible">
        <div>
            <component :disabled="customForm.disabled" v-bind:is="customForm.formComponent" :model="customForm.model"
                        :customFormData="customForm.customFormData" :isNew = "customForm.isNew"></component> 
        </div>
      </el-col>

      <!--流程处理表单设计器模块,从flowable表里获取表单数据-->
      <el-col :span="16" :offset="4" v-if="variableOpen">
        <!--<div > <!--处理流程过程中显示formgenerator表单信息
          <parser :key="new Date().getTime()" :form-conf="variablesData" />
        </div>-->
          <div > <!--处理流程过程中显示formdesigner表单信息-->
            <form-viewer ref="formViewer" v-model="formVal" :buildData="formViewData"></form-viewer>
		      </div>
        <div style="margin-left:10%;margin-bottom: 20px">
           <!--对上传文件进行显示处理，临时方案 add by nbacheng 2022-07-27 -->
           <el-upload action="#" :on-preview="handleFilePreview" :file-list="fileList" v-if="fileDisplay" />
        </div>
           
        <div style="margin-left:10%;margin-bottom: 20px;font-size: 14px;" v-if="finished === 'true'">
          <el-button icon="el-icon-edit-outline" type="success" size="mini" @click="handleComplete">审批</el-button>
          <!--                <el-button  icon="el-icon-edit-outline" type="primary" size="mini" @click="handleDelegate">委派</el-button>-->
          <!--                <el-button  icon="el-icon-edit-outline" type="primary" size="mini" @click="handleAssign">转办</el-button>-->
          <!--                <el-button  icon="el-icon-edit-outline" type="primary" size="mini" @click="handleDelegate">签收</el-button>-->
          <el-button icon="el-icon-refresh-left" type="warning" size="mini" @click="handleReturn">退回</el-button>
          <el-button icon="el-icon-circle-close" type="danger" size="mini" @click="handleReject">驳回</el-button>
        </div>
      </el-col>


      <!--初始化流程加载默认formgenerator表单信息-->
      <!--<el-col :span="16" :offset="4" v-if="formConfOpen">
        <div class="test-form">
          <parser :key="new Date().getTime()" :form-conf="formConf" @submit="submitForm" ref="parser"
            @getData="getData" />
        </div>
      </el-col>-->
      
      <!--初始化流程加载默认formdesigner表单信息-->
      <el-col :span="16" :offset="4" v-if="formConfOpen">
        <div class="test-form">
          <form-builder ref="formBuilder" v-model="formVal" :buildData="formCode" />
          <div style="margin-bottom:15px;text-align:center">
              <el-button type="primary" class="button" @click="submitForm">提交</el-button>
          </div>
        </div>
      </el-col>
      <!--初始化流程加载显示formdesigner表单-->
      <el-col :span="16" :offset="4" v-if="formViewOpen">
        <div class="test-form">
          <form-viewer ref="formView" v-model="formVal" :buildData="formCode" />
        </div>
      </el-col>
    </el-card>

    <!--流程流转记录-->
    <el-card class="box-card" v-if="flowRecordList">
      <div slot="header" class="clearfix">
        <span class="el-icon-notebook-1">审批记录</span>
      </div>
      <el-col :span="16" :offset="4">
        <div class="block">
          <el-timeline>
            <el-timeline-item v-for="(item,index ) in flowRecordList" :key="index" :icon="setIcon(item.finishTime)"
              :color="setColor(item.finishTime)">
              <p style="font-weight: 700">{{item.taskName}}</p>
              <el-card :body-style="{ padding: '10px' }">
                <label v-if="item.assigneeName" style="font-weight: normal;margin-right: 30px;">实际办理：
                  {{item.assigneeName}}
                  <el-tag type="info" size="mini">{{item.deptName}}</el-tag>
                </label>
                <label v-if="item.candidate" style="font-weight: normal;margin-right: 30px;">候选办理：
                  {{item.candidate}}</label>
                <label style="font-weight: normal">接收时间： </label><label
                  style="color:#8a909c;font-weight: normal">{{item.createTime}}</label>
                <label v-if="item.finishTime" style="margin-left: 30px;font-weight: normal">办结时间： </label><label
                  style="color:#8a909c;font-weight: normal">{{item.finishTime}}</label>
                <label v-if="item.duration" style="margin-left: 30px;font-weight: normal">耗时： </label><label
                  style="color:#8a909c;font-weight: normal">{{item.duration}}</label>
                <p v-if="item.listFlowCommentDto" v-for="(commentitem,index ) in item.listFlowCommentDto" :key="index">
                   <el-tag type="success" v-if="commentitem.type === '1'"> {{commentitem.comment}}</el-tag>
                   <el-form  v-if= "commentitem.type === '1' && fileitem.type === '1'  && item.listcommentFileDto.length>0" v-for="(fileitem,fileindex ) in item.listcommentFileDto" :key="fileindex">
                     <el-form-item label="附件"  prop="listcommentFileDto">
                          <j-upload  v-if="fileitem.type === '1'" v-model="fileitem.fileurl" :disabled = "true"  text="上传的文件" ></j-upload>                 
                     </el-form-item>
                   </el-form>  
                   <el-tag type="warning" v-if="commentitem.type === '2'"> {{commentitem.comment}}</el-tag>
                   <el-form v-if= "commentitem.type === '2' && fileitem.type === '2'  && item.listcommentFileDto.length>0" v-for="(fileitem,fileindex ) in item.listcommentFileDto" :key="fileindex">
                     <el-form-item label="附件"  prop="listcommentFileDto">
                          <j-upload v-if="fileitem.type === '2'" v-model="fileitem.fileurl" :disabled = "true"  text="退回上传的文件" ></j-upload> 
                     </el-form-item>
                   </el-form>  
                   <el-tag type="danger" v-if="commentitem.type === '3'">  {{commentitem.comment}}</el-tag>
                   <el-form v-if= "commentitem.type === '3' && fileitem.type === '3'  && item.listcommentFileDto.length>0" v-for="(fileitem,fileindex ) in item.listcommentFileDto" :key="fileindex">
                     <el-form-item label="附件"  prop="listcommentFileDto">
                        <j-upload v-if="fileitem.type === '3'"  v-model="fileitem.fileurl" :disabled = "true"  text="驳回上传的文件" ></j-upload>
                     </el-form-item>
                   </el-form>  
                   <el-tag type="success" v-if="commentitem.type === '4'">  {{commentitem.comment}}</el-tag>
                   <el-form  v-if= "commentitem.type === '4' && fileitem.type === '4'  && item.listcommentFileDto.length>0" v-for="(fileitem,fileindex ) in item.listcommentFileDto" :key="fileindex">
                     <el-form-item label="附件"  prop="listcommentFileDto">
                          <j-upload  v-if="fileitem.type === '4'" v-model="fileitem.fileurl" :disabled = "true"  text="委派上传的文件" ></j-upload>                 
                     </el-form-item>
                   </el-form>  
                   <el-tag type="success" v-if="commentitem.type === '5'">  {{commentitem.comment}}</el-tag>  
                    <el-form v-if= "commentitem.type === '5' && fileitem.type === '5' && item.listcommentFileDto.length>0" v-for="(fileitem,fileindex ) in item.listcommentFileDto" :key="fileindex">
                      <el-form-item label="附件"  prop="listcommentFileDto" >
                         <j-upload v-model="fileitem.fileurl" :disabled = "true"  text="转办上传的文件" ></j-upload>
                      </el-form-item>
                    </el-form>  
                    <el-tag type="warning" v-if="commentitem.type === '7'"> {{commentitem.comment}}</el-tag>  <!--撤回信息-->
                    <el-tag type="warning" v-if="commentitem.type === '6'"> {{commentitem.comment}}</el-tag>  <!--终止信息-->
                 </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="el-icon-picture-outline">流程图</span>
      </div>
      <!--<flow :xmlData="xmlData" :taskData="taskList"></flow>-->
      <!-- 流程图 -->
      <bpmn-modeler v-if="xmlShow" ref="refNode" :xml="xmlData" :taskData="taskList" :users="users" :groups="groups"
        :categorys="categorys" :is-view="xmlView" />
    </el-card>

    <!--审批正常流程-->
    <el-dialog :title="completeTitle" :visible.sync="completeOpen" :width="checkSendUser? '60%':'40%'" append-to-body>
      <el-form ref="taskForm" :model="taskForm" label-width="160px">
        <el-form-item v-if="checkSendUser" prop="targetKey">
          <el-row :gutter="20">
            <el-col :span="12" :xs="24">
              <h6>待选人员</h6>
              <el-table ref="singleTable" :data="userDataList" border style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column label="用户名" align="center" prop="realname" />
                <el-table-column label="部门" align="center" prop="orgCodeTxt" />
              </el-table>
            </el-col>
            <el-col :span="8" :xs="24">
              <h6>已选人员</h6>
              <el-tag v-for="tag in userData" :key="tag" closable @close="handleClose(tag)">
                {{tag.realname}} {{tag.orgCodeTxt}}
              </el-tag>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="处理意见" prop="comment" :rules="[{ required: true, message: '请输入处理意见', trigger: 'blur' }]">
          <el-input type="textarea" v-model="taskForm.comment" placeholder="请输入处理意见" />
        </el-form-item>
        <el-form-item label="附件"  prop="commentFileDto.fileurl">
          <j-upload v-model="taskForm.commentFileDto.fileurl"   ></j-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="completeOpen = false">取 消</el-button>
        <el-button type="primary" @click="taskComplete">确 定</el-button>
      </span>
    </el-dialog>

    <!--退回流程-->
    <el-dialog :title="returnTitle" :visible.sync="returnOpen" width="40%" append-to-body>
      <el-form ref="taskForm" :model="taskForm" label-width="80px">
        <el-form-item label="退回节点" prop="targetKey">
          <el-radio-group v-model="taskForm.targetKey">
            <el-radio-button v-for="item in returnTaskList" :key="item.id" :label="item.id">{{item.name}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退回意见" prop="comment" :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]">
          <el-input style="width: 50%" type="textarea" v-model="taskForm.comment" placeholder="请输入意见" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnOpen = false">取 消</el-button>
        <el-button type="primary" @click="taskReturn">确 定</el-button>
      </span>
    </el-dialog>

    <!--驳回流程-->
    <el-dialog :title="rejectTitle" :visible.sync="rejectOpen" width="40%" append-to-body>
      <el-form ref="taskForm" :model="taskForm" label-width="80px">
        <el-form-item label="驳回意见" prop="comment" :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]">
          <el-input style="width: 50%" type="textarea" v-model="taskForm.comment" placeholder="请输入意见" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectOpen = false">取 消</el-button>
        <el-button type="primary" @click="taskReject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    flowRecord
  } from "@/views/flowable/api/finished";
  import Parser from '@/components/parser/Parser'
  import {
    definitionStartByDefId,
    getProcessVariables,
    readXml,
    getFlowViewer
  } from "@/views/flowable/api/definition";
  import {
    complete,
    rejectTask,
    returnList,
    returnTask,
    getNextFlowNode,
    delegateTask,
    assignTask
  } from "@/views/flowable/api/todo";
  import {
    queryMyDepartTreeList
  } from "@/api/api";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {
    getUserList
  } from "@/api/api"
  import bpmnModeler from "workflow-bpmn-modeler";
  import DeptUserInfo from '@/views/system/modules/DeptUserInfo'
  import {
    flowableMixin
  } from '@/views/flowable/mixins/flowableMixin'

  import { getCustomForm  } from "@/api/form";
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  //for formdesigner
  import formBuilder from '@/components/formdesigner/components/formBuilder'
  import formViewer from '@/components/formdesigner/components/formViewer'

  
  export default {
    name: "Record",
    mixins: [flowableMixin],
    components: {
      Parser,
      bpmnModeler,
      DeptUserInfo,
      formBuilder,
      formViewer,
    },
    props: {},
    data() {
      return {
        // 模型xml数据
        xmlData: "",
        xmlShow: true,
        xmlView: true,
        users: [],
        groups: [],
        categorys: [],
        taskList: [],
        iExpandedKeys: [],
        checkedKeys: [],
        selectedKeys: [],
        departTree: [],
        treeData: [],
        userIdentity: "",
        autoExpandParent: true,
        // 部门名称
        deptName: undefined,
        // 部门树选项
        deptOptions: undefined,
        // 用户表格数据
        userList: null,
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 查询参数
        queryParams: {
          deptId: undefined
        },
        // 遮罩层
        loading: true,
        flowRecordList: [], // 流程流转数据
        formConfCopy: {},
        src: null,
        rules: {}, // 表单校验
        variablesForm: {}, // 流程变量数据
        taskForm: {
          returnTaskShow: false, // 是否展示回退表单
          delegateTaskShow: false, // 是否展示回退表单
          defaultTaskShow: true, // 默认处理
          sendUserShow: false, // 审批用户
          multiple: false,
          comment: "", // 意见内容
          commentFileDto: { //意见里的附件
            type: '',
            fileurl: ''
          }, 
          procInsId: "", // 流程实例编号
          instanceId: "", // 流程实例编号
          deployId: "", // 流程定义编号
          taskId: "", // 流程任务编号
          procDefId: "", // 流程编号
          businessKey: "", //业务主键编号
          dataId: "",//业务主键编号
          vars: "",
          targetKey: ""
        },
        userDataList: [], // 流程候选人
        assignee: null,
        formConf: {}, // 默认表单数据
        formConfOpen: false, // 是否加载默认表单数据
        customForm: { //自定义表单
          formId: '',
          title: '',
          disabled: false,
          visible: false,
          formComponent: null,
          model: {},
          /*流程数据*/
          customFormData: {},
          isNew: false,
          disableSubmit: true
        },
        formCode:'',
        formVal:'',
        formViewOpen: false,  //是否显示formdesigner的输入后提交的表单
        formViewData: '',    //显示formdesigner的输入后提交的表单数据
        variables: [], // 流程变量数据
        variablesData: {}, // 流程变量数据
        variableOpen: false, // 是否加载流程变量数据
        fileDisplay: false, // 是否显示上传的文件控件
        fileList: [], //表单设计器上传的文件列表
        returnTaskList: [], // 回退列表数据
        finished: 'false',
        completeTitle: null,
        completeOpen: false,
        returnTitle: null,
        returnOpen: false,
        rejectOpen: false,
        rejectTitle: null,
        userData: [],
        checkSendUser: false // 是否展示选择人员模块
      };
    },
    created() {
      this.taskForm.deployId = this.$route.query && this.$route.query.deployId;
      this.taskForm.taskId = this.$route.query && this.$route.query.taskId;
      this.taskForm.procInsId = this.$route.query && this.$route.query.procInsId;
      this.taskForm.instanceId = this.$route.query && this.$route.query.procInsId;
      // 初始化表单
      this.taskForm.procDefId = this.$route.query && this.$route.query.procDefId;
      this.taskForm.businessKey = this.$route.query && this.$route.query.businessKey;
      this.taskForm.dataId = this.$route.query && this.$route.query.businessKey;
      // 回显流程记录
      //
      this.getModelDetail(this.taskForm.deployId);
      //this.getFlowViewer(this.taskForm.procInsId);
      // 流程任务重获取变量表单
      if (this.taskForm.taskId) {
        this.processVariables(this.taskForm.taskId)
        this.getNextFlowNode(this.taskForm.taskId)
        console.log("userDataList=", this.userDataList)
        this.taskForm.deployId = null
      }
      this.getFlowRecordList(this.taskForm.procInsId, this.taskForm.deployId, this.taskForm.businessKey);
      this.finished = this.$route.query && this.$route.query.finished

    },
    mounted() {
      //表单数据回填，模拟异步请求场景
      setTimeout(() => {
        // 回填数据,这里主要是处理文件列表显示,临时解决，以后应该在form设计器完成
        this.fillFormData(this.variablesData.list, this.variablesData)
        // 更新表单
        this.key = +new Date().getTime()
      }, 1000)
    },
    computed:{
      
    },
    methods: {
      /** 查询部门下拉树结构 */
      getTreeselect() {
        var that = this
        that.treeData = []
        that.departTree = []
        queryMyDepartTreeList().then((res) => {
          if (res.success && res.result) {
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.treeData.push(temp)
              that.departTree.push(temp)
              that.setThisExpandedKeys(temp)
              // console.log(temp.id)
            }
            this.loading = false
          }
          that.userIdentity = res.message
        });
      },
      clearSelectedDepartKeys() {
        this.checkedKeys = [];
        this.selectedKeys = [];
        this.currentDeptId = '';
        this.$refs.DeptUserInfo.currentDeptId = '';
      },
      setThisExpandedKeys(node) {
        //只展开一级目录
        if (node.children && node.children.length > 0) {
          this.iExpandedKeys.push(node.key)
          //下方代码放开注释则默认展开所有节点
          /**
          for (let a = 0; a < node.children.length; a++) {
            this.setThisExpandedKeys(node.children[a])
          }
          */
        }
      },
      /** 查询用户列表 */
      getList() {
        getUserList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.deptId = data.id;
        this.getList();
      },
      /** xml 文件 */
      getModelDetail(deployId) {
        // 发送请求，获取xml
        readXml(deployId).then(res => {
          this.xmlData = res.result
          this.getFlowViewer(this.taskForm.procInsId);
        })
      },
      getFlowViewer(procInsId) {
        getFlowViewer(procInsId).then(res => {
          this.taskList = res.result || [];
          console.log("taskList=", this.taskList);
          this.fillColor();
        })
      },
      setIcon(val) {
        if (val) {
          return "el-icon-check";
        } else {
          return "el-icon-time";
        }
      },
      setColor(val) {
        if (val) {
          return "#2bc418";
        } else {
          return "#b3bdbb";
        }
      },
      fillColor() {
        const modeler = this.$refs.refNode.modeler;
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
                  if (todoTask && completeTask.key === todoTask.key && !todoTask.completed) {
                    canvas.addMarker(nn.id, todoTask.completed ? 'highlight' : 'highlight-todo')
                    canvas.addMarker(nn.targetRef.id, todoTask.completed ? 'highlight' : 'highlight-todo')
                  } else {
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
          } else if (n.$type === 'bpmn:StartEvent') {
            //console.log("n.outgoing=",n.outgoing)
            n.outgoing.forEach(nn => {
              const completeTask = this.taskList.find(m => m.key === nn.targetRef.id)
              if (completeTask) {
                canvas.addMarker(nn.id, 'highlight')
                canvas.addMarker(n.id, 'highlight')
                return
              }
            })
          } else if (n.$type === 'bpmn:EndEvent') {
            //console.log("endTask=",endTask)
            if (endTask.key === n.id && endTask.completed) {
              canvas.addMarker(n.id, 'highlight')
              return
            }
          }
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.userData = selection
        const val = selection.map(item => item.username)[0];
        console.log("val=", val);
        if (val instanceof Array) {
          this.taskForm.values = {
            "approval": val.join(',')
          }
        } else {
          this.taskForm.values = {
            "approval": val,
          }
        }
      },
      clearSelectedDepartKeys() {
        this.checkedKeys = [];
        this.selectedKeys = [];
        this.currentDeptId = '';
        this.$refs.DeptUserInfo.currentDeptId = '';
      },
      onExpand(expandedKeys) {
        // console.log('onExpand', expandedKeys)
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.iExpandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onSelect(selectedKeys, e) {
        if (this.selectedKeys[0] !== selectedKeys[0]) {
          this.selectedKeys = [selectedKeys[0]];
        }
        let record = e.node.dataRef;
        this.checkedKeys.push(record.id);
        this.$refs.DeptUserInfo.onClearSelected();
        this.$refs.DeptUserInfo.open(record);
      },
      // 关闭标签
      handleClose(tag) {
        this.userData.splice(this.userData.indexOf(tag), 1);
        this.$refs.singleTable.toggleRowSelection(tag, false)
      },
      /** 流程变量赋值 */
      handleCheckChange(val) {
        if (val instanceof Array) {
          this.taskForm.values = {
            "approval": val.join(',')
          }
        } else {
          this.taskForm.values = {
            "approval": val
          }
        }
      },
      /** 流程流转记录 */
      getFlowRecordList(procInsId, deployId, businessKey) {
        console.log("procInsId=, deployId=, businessKey=", procInsId, deployId, businessKey)
        const params = {
          procInsId: procInsId,
          deployId: deployId,
          businessKey: businessKey
        }
        if (businessKey == 'newkey') {
           this.customForm.formId = this.$route.query && this.$route.query.formId;
            getCustomForm(this.customForm.formId).then(res => {
            console.log("res=",res);
            this.customForm.disabled = false;
            this.customForm.isNew = true;
            this.customForm.visible = true;
            this.customForm.disableSubmit = false;
            this.customForm.formComponent = this.getFormComponent(res.result.routeName).component;
            this.formConfOpen = true;
          })  
         
           
        } else {
          flowRecord(params).then(res => {
            console.log("res", res);
            if (res.success) {
              this.flowRecordList = res.result.flowList;
              console.log("this.flowRecordList", this.flowRecordList);
              // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
              if (res.result.hasOwnProperty('formData')) {
                console.log("flowRecord res.result.formData", res.result.formData);
                this.formConf = res.result.formData;
                console.log("flowRecord this.formConf", this.formConf);
                this.formCode = JSON.stringify(res.result.formData);
                console.log("flowRecord this.formCode", this.formCode);
                
                this.customForm.disabled = true;
                this.customForm.visible = true;
                this.customForm.formComponent = this.getFormComponent(res.result.routeName).component;
                this.customForm.model = res.result.formData;
                this.customForm.customFormData = res.result.formData;
                console.log("model=", this.customForm.model);
                this.formConfOpen = true;

              }
            } else {
              this.$message.error(res.message);
              return;
            }

          }).catch(res => {
            this.$message.error("出现异常");
            this.goBack();
          })
        } 

      },
      gettest() {
        console.log("get test model=", this.customForm.model);
      },
      /** 获取流程变量内容 */
      processVariables(taskId) {
        if (taskId) {
          // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
          getProcessVariables(taskId).then(res => {
            // this.variables = res.result.variables;
            this.variablesData = res.result.variables;
            console.log("this.variablesData=",this.variablesData)
            this.formViewData = JSON.stringify(this.variablesData);
            this.formVal = JSON.stringify(this.variablesData.formValue);
            this.variableOpen = true
          });
        }
      },
      //点击文件列表中已上传文件进行下载
      handleFilePreview(file) {
        var a = document.createElement('a');
        var event = new MouseEvent('click');
        a.download = file.name;
        a.href = file.url;
        a.dispatchEvent(event);
        console.log(file)
      },
      //for formgenerator
      /*fillFormData(fields, formConf) {
        const { formModel, formRef } = formConf
        fields.forEach((item, i) => {
          const vModel = item.__vModel__
          const val = item.__config__.defaultValue 
          // 特殊处理el-upload，包括 回显图片
          if (item.__config__.tag === 'el-upload') {
            
            // 回显图片
            console.log("fillFormData val=",JSON.parse(val))
            this.fileDisplay = true
            console.log('item=',item['list-type'])
            if(item['list-type'] != 'text') {
              this.fileList = ''    //隐藏加的el-upload文件列表
              item['file-list'] = JSON.parse(val)
            }
            else {  //图片
              this.fileList = JSON.parse(val)
              item['file-list'] = '' //隐藏加的表单设计器的文件列表
            }
            
          }
          // 设置各表单项的默认值（回填表单），包括el-upload的默认值
          if (val) {
            item.__config__.defaultValue = val
          }
          if (Array.isArray(item.__config__.children)) {
            this.fillFormData(item.__config__.children, formConf)
          }
        })
      },*/
      fillFormData(list, formConf) { // for formdesigner 
        console.log("fillFormData list=",list);
        console.log("fillFormData formConf=",formConf);
        list.forEach((item, i) => {
          // 特殊处理el-upload，包括 回显图片
          if (item.ele === 'el-upload') {
            const val = formConf.formValue[item.id];
            //console.log('item=',item['list-type'])
            if(item['list-type'] != 'text') {//图片
              this.fileList = []    //隐藏加的el-upload文件列表
              //item['file-list'] = JSON.parse(val)
              item['file-list'] = JSON.parse(val)
              console.log("图片fillFormData item['file-list']",item['file-list'])
            }
            else {  //列表
              console.log("列表fillFormData val",val)
              this.fileList = JSON.parse(val)
              item['file-list'] = [] //隐藏加的表单设计器的文件列表
            }
            // 回显图片
            this.fileDisplay = true
          }
          if (Array.isArray(item.columns)) {
            this.fillFormData(item.columns, formConf)
          }
        })
      },
      /** 根据当前任务或者流程设计配置的下一步节点 */
      getNextFlowNode(taskId) {
        // 根据当前任务或者流程设计配置的下一步节点 todo 暂时未涉及到考虑网关、表达式和多节点情况
        const params = {
          taskId: taskId
        }
        getNextFlowNode(params).then(res => {
          const data = res.result;
          if (data) {
            this.checkSendUser = true
            //console.log("data=",data)
            if (data.type === 'assignee') { // 指定人员
              this.userDataList = res.result.userList;
            } else if (data.type === 'candidateUsers') { // 指定人员(多个)
              this.userDataList = res.result.userList;
              this.taskForm.multiple = true;
              //console.log("res.result.userList=",res.result.userList);
              //console.log("userDataList=",this.userDataList)
            } else if (data.type === 'candidateGroups') { // 指定组(所属角色接收任务)
              res.result.roleList.forEach(role => {
                role.userId = role.roleId;
                role.realName = role.roleName;
              })
              this.userDataList = res.result.roleList;
              this.taskForm.multiple = false;
            } else if (data.type === 'multiInstance') { // 会签?
              this.userDataList = res.result.userList;
              this.taskForm.multiple = true;
            } else if (data.type === 'fixed') { // 已经固定人员接收下一任务
              this.checkSendUser = false;
            }
          }
        })
      },
      /** 审批任务选择 */
      handleComplete() {
        this.completeOpen = true;
        this.completeTitle = "审批流程";
        this.getTreeselect();
      },
      /** 审批任务 */
      taskComplete() {
        if (!this.taskForm.values && this.checkSendUser) {
          this.$message.error("请选择流程接收人员");
          return;
        }
        if (!this.taskForm.comment) {
          this.$message.error("请输入审批意见");
          return;
        }
        console.log("this.taskForm=", this.taskForm);
        complete(this.taskForm).then(response => {
          this.$message.success(response.message);
          this.goBack();
        });
      },
      /** 委派任务 */
      handleDelegate() {
        this.taskForm.delegateTaskShow = true;
        this.taskForm.defaultTaskShow = false;
      },
      handleAssign() {

      },
      /** 返回页面 */
      goBack() {
        // 关闭当前标签页并返回上个页面
        //this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      /** 接收子组件传的值 */
      getData(data) {
        if (data) {
          console.log("enter getData data=",data)
          const variables = [];
          data.fields.forEach(item => {
            let variableData = {};
            variableData.label = item.__config__.label
            // 表单值为多个选项时
            if (item.__config__.defaultValue instanceof Array) {
              const array = [];
              item.__config__.defaultValue.forEach(val => {
                array.push(val)
              })
              variableData.val = array;
            } else {
              variableData.val = item.__config__.defaultValue
            }
            variables.push(variableData)
          })
          this.variables = variables;
          console.log("this.variables=",variables)
        }
      },
      /** 申请流程表单formgenerator数据提交 */
      /*submitForm(data) {
        if (data) {
          const variables = data.valData;
          const formData = data.formData;
          formData.disabled = true;
          formData.formBtns = false;
          if (this.taskForm.procDefId) {
            variables.variables = formData;
            console.log("variables=", variables);
            // 启动流程并将表单数据加入流程变量
            definitionStartByDefId(this.taskForm.procDefId, JSON.stringify(variables)).then(res => {
              this.$message.success(res.message);
              this.goBack();
            })
          }
        }
      },*/
      /** 申请流程表单formdesigner数据提交 nbacheng2022-09-05 */
      submitForm() {
        this.$refs.formBuilder.validate();
        console.log("submitForm formVal",this.formVal);
        console.log("submitForm formCode",this.formCode);
        this.formViewOpen = true;
        this.formConfOpen = false;
        if (this.formVal) {
          const variables=JSON.parse(this.formVal);
          const formData = JSON.parse(this.formCode);
          formData.formValue = JSON.parse(this.formVal);

          if (this.taskForm.procDefId) {
            variables.variables = formData;
            console.log("variables=", variables);
            // 启动流程并将表单数据加入流程变量
            definitionStartByDefId(this.taskForm.procDefId, JSON.stringify(variables)).then(res => {
              this.$message.success(res.message);
              this.goBack();
            })
          }
        }
      },
      /** 驳回任务 */
      handleReject() {
        this.rejectOpen = true;
        this.rejectTitle = "驳回流程";
      },
      /** 驳回任务 */
      taskReject() {
        this.$refs["taskForm"].validate(valid => {
          if (valid) {
            rejectTask(this.taskForm).then(res => {
              this.$message.success(res.message);
              this.goBack();
            });
          }
        });
      },
      /** 可退回任务列表 */
      handleReturn() {
        this.returnOpen = true;
        this.returnTitle = "退回流程";
        returnList(this.taskForm).then(res => {
          this.returnTaskList = res.result;
          this.taskForm.values = null;
        })
      },
      /** 提交退回任务 */
      taskReturn() {
        this.$refs["taskForm"].validate(valid => {
          if (valid) {
            returnTask(this.taskForm).then(res => {
              this.$message.success(res.message);
              this.goBack()
            });
          }
        });
      },
      /** 取消回退任务按钮 */
      cancelTask() {
        this.taskForm.returnTaskShow = false;
        this.taskForm.defaultTaskShow = true;
        this.taskForm.sendUserShow = true;
        this.returnTaskList = [];
      },
      /** 委派任务 */
      submitDeleteTask() {
        this.$refs["taskForm"].validate(valid => {
          if (valid) {
            delegate(this.taskForm).then(response => {
              this.$message.success(response.message);
              this.goBack();
            });
          }
        });
      },
      /** 取消回退任务按钮 */
      cancelDelegateTask() {
        this.taskForm.delegateTaskShow = false;
        this.taskForm.defaultTaskShow = true;
        this.taskForm.sendUserShow = true;
        this.returnTaskList = [];
      },
    }
  };
</script>
<!-- <style lang="scss" scoped> -->
<style lang="less">
  .test-form {
    margin: 15px auto;
    width: 800px;
    padding: 15px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    margin-bottom: 20px;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .highlight.djs-shape .djs-visual> :nth-child(1) {
    fill: green !important;
    stroke: green !important;
    fill-opacity: 0.2 !important;
  }

  .highlight.djs-shape .djs-visual> :nth-child(2) {
    fill: green !important;
  }

  .highlight.djs-shape .djs-visual>path {
    fill: green !important;
    fill-opacity: 0.2 !important;
    stroke: green !important;
  }

  .highlight.djs-connection>.djs-visual>path {
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
  .highlight-todo.djs-connection>.djs-visual>path {
    stroke: orange !important;
    stroke-dasharray: 4px !important;
    fill-opacity: 0.2 !important;
  }

  .highlight-todo.djs-shape .djs-visual> :nth-child(1) {
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

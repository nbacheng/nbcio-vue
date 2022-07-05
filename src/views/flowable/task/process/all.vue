<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="handleQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="流程名称">
              <a-input placeholder="请输入流程名称,这里只支持精确查询" v-model="queryParams.procDefName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="开始日期">
              <a-date-picker v-model="queryParams.createTime"  style="width: 100%" placeholder="请输入开始日期"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
    
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('我的任务')">导出</a-button>
     
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="procInsId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">
        
        <template slot="procDefVersion" slot-scope="text, record, index">
            <el-tag size="medium" >V{{ record.procDefVersion }}</el-tag>
        </template>
        <template slot="finishTime" slot-scope="text, record, index">
            <a-tag color="blue" v-if="record.finishTime == null" >进行中</a-tag>
            <a-tag color="green" v-if="record.finishTime != null">已完成</a-tag>
        </template>
        <template slot="startUserName" slot-scope="text, record, index">
           <label>{{record.startUserName}} <el-tag type="info" size="mini">{{record.startDeptName}}</el-tag></label>
        </template>
        <template slot="assigneeName" slot-scope="text, record, index">
           <label v-if="record.assigneeName">{{record.assigneeName}} <el-tag type="info" size="mini">{{record.deptName}}</el-tag></label>
           <label v-if="record.candidate">{{record.candidate}}</label>
        </template>
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div> 
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleFlowRecord(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="SelectUser(record,'1')">委派</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="SelectUser(record,'2')">转办</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleStop(record)">取消申请</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleDelete(record)"> 删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
  
     
     <!-- 发起流程 -->
     <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
       <el-form :model="queryProcessParams" ref="queryProcessForm" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item label="名称" prop="name">
           <el-input
             v-model="queryProcessParams.name"
             placeholder="请输入名称"
             clearable
             size="small"
             @keyup.enter.native="handleQuery"
           />
         </el-form-item>
         <el-form-item>
           <el-button type="primary" icon="el-icon-search" size="mini" @click="handleProcessQuery">搜索</el-button>
           <el-button icon="el-icon-refresh" size="mini" @click="resetProcessQuery">重置</el-button>
         </el-form-item>
       </el-form>
       <el-table v-loading="processLoading" fit :data="definitionList" border >
         <el-table-column label="流程名称" align="center" prop="name" />
         <el-table-column label="流程版本" align="center">
           <template slot-scope="scope">
             <el-tag size="medium" >v{{ scope.row.version }}</el-tag>
           </template>
         </el-table-column>
         <el-table-column label="流程分类" align="center" prop="category" />
         <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
           <template slot-scope="scope">
             <el-button
               size="mini"
               type="text"
               icon="el-icon-edit-outline"

               v-if="(scope.row.formId != null && (scope.row.category == 'oa' || scope.row.category == 'cw')) || (scope.row.formId == null && (scope.row.category == 'ddxz' || scope.row.category == 'ddcw'))"
               @click="handleStartProcess(scope.row)"
             >发起流程</el-button>
           </template>
         </el-table-column>
       </el-table>
       <el-pagination v-show="processTotal>0" :total="processTotal" :current-page.sync="queryProcessParams.pageNum"
         :page-size.sync="queryProcessParams.pageSize" @size-change="listDefinition" @current-change="listDefinition" />
       </el-dialog>
       <!-- 委派 转办 选择人员 -->
       <a-modal
         title="选择委派或转办人员" width="900px" :maskClosable="false"
         :confirmLoading="confirmLoading"
         :visible="delegateassign"
         :footer="null"
         @cancel="closeNode"
       >   
         <a-form :form="selUserForm" v-if="delegateassign">
           <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"  label="请选择委派或转办人员" v-show="true">
             <a-checkbox-group @change="spryType" v-model="spryTypes" >
                 <!-- 1用户 5 部门负责人 4发起人的部门负责人-->
             
               <a-checkbox value="1"> 直接选择人员 </a-checkbox>
               <a-checkbox value="5"> 部门负责人 </a-checkbox>
               <a-checkbox value="4">
                 发起人的部门负责人
                 <a-tooltip placement="topLeft" title="自动获取发起人所在部门的负责人，即其上级领导。（如果其本身就是部门负责人，则指向发起人自己。）">
                   <a-icon type="exclamation-circle" />
                 </a-tooltip>
               </a-checkbox>
         
             </a-checkbox-group>
           </a-form-item>
           <!--            1用户  4发起人的部门负责人-->
          
           <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="选择人员" v-if="spryTypes.indexOf('1')>-1" >
             <!--  通过部门选择用户控件 -->
             <j-select-user-by-dep v-model="spry.userIds" :multi="false"></j-select-user-by-dep>
           </a-form-item>
           
           <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="选择部门负责人" v-if="spryTypes.indexOf('5')>-1" >
             <j-select-depart v-model="spry.departmentManageIds" :multi="false"></j-select-depart>
           </a-form-item>
           <!--btn-->
           <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
             <a-button @click="sprySubmit" type="primary" html-type="submit" :disabled="userNode.type==0||userNode.type==2||confirmLoading">
               提交
             </a-button>
         
             <a-button @click="closeNode" style="margin-left: 10px">
               关闭
             </a-button>
           </a-form-item>
         </a-form>
       </a-modal>  
    </div>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {
    getDeployment,
    delDeployment,
    addDeployment,
    updateDeployment,
    exportDeployment,
    flowRecord
  } from "@/views/flowable/api/finished";
  import { allProcessList,stopProcess } from "@/views/flowable/api/process";
  import { delegateTask,assignTask } from "@/views/flowable/api/todo";  
  import {listDefinition} from "@/views/flowable/api/definition";
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import JTreeDict from '@/components/jeecg/JTreeDict'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
  import JSelectRole from '@/components/jeecgbiz/JSelectRole'
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  import moment from 'moment';

  export default {
    name: 'ProcessIndex',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
    },
    data () {
      return {
        description: '我的任务管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'任务编号',
            align:"center",
            dataIndex: 'procInsId',
          },
          {
            title:'流程名称',
            align:"center",
            dataIndex: 'procDefName',
          },
          {
            title:'流程类别',
            align:"center",
            dataIndex: 'category'
          },
          {
            title:'流程版本',
            align:"center",
            dataIndex: 'procDefVersion',
            scopedSlots: { customRender: 'procDefVersion' }
          },
          {
            title:'业务主键',
            align:"center",
            dataIndex: 'businessKey'
          },
          {
            title:'提交时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'finishTime',
            scopedSlots: { customRender: 'finishTime' }
          },
          {
            title:'耗时',
            align:"center",
            dataIndex: 'duration'
          },
          {
            title:'流程发起人',
            align:"center",
            dataIndex: 'startUserName',
            scopedSlots: { customRender: 'startUserName' }
          },
          {
            title:'当前节点',
            align:"center",
            dataIndex: 'taskName'
          },
          {
            title:'办理',
            align:"center",
            dataIndex: 'assigneeName',
            scopedSlots: { customRender: 'assigneeName' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/flowable/task/allProcess",
          deleteBatch: "/flowable/task/deleteBatch",
          exportXlsUrl: "/flowable/task/exportXls",
        },
        dataSource: [], //表格数据源
        /* 表格分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        src: "",
        definitionList:[],
        dictOptions:{},
        superFieldList:[],
        formConf: {}, // 默认表单数据
        formConfOpen: false,
        formTitle: "",
        // 总条数
        total: 0,
        processTotal:0,
        processLoading: true,
        // 显示搜索条件
        showSearch: true,
        
        //委派与转办选择用户界面
        delegateassign: false,
        confirmLoading:false,
        current:0,
        selUserForm: this.$form.createForm(this),
        userNode:{},
        spryTypes:[],
        spry:{
          //选中的用户
          userIds:'',
          departmentManageIds:'',
          chooseSponsor:false,
          chooseDepHeader:false,
        },       
        //传入处理委派或转办参数
        assignee: '',
        taskId: '',
        dataId: '',
        type: '',
        // 表头
        labelCol: {
          xs: { span: 4 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 20 },
          sm: { span: 20 },
        },
        
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          category: null,
          key: null,
          tenantId: null,
          deployTime: null,
          derivedFrom: null,
          derivedFromRoot: null,
          parentDeploymentId: null,
          engineVersion: null,
          procDefName: null,
          createTime: null
        },
        // 查询参数
        queryProcessParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          category: null,
          key: null,
          tenantId: null,
          deployTime: null,
          derivedFrom: null,
          derivedFromRoot: null,
          parentDeploymentId: null,
          engineVersion: null
        },
      }
    },
    created() {
    
    this.getSuperFieldList();
    },
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        if(this.queryParams.createTime != null) {
          this.queryParams.createTime = moment(this.queryParams.createTime).format('YYYY-MM-DD 00:00:00');
          console.log("createtime=",this.queryParams.createTime)
        }
        this.getList();
      },
      /** 查询任务流程列表 */
      getList() {
        this.loading = true;
        allProcessList(this.queryParams).then(response => {
          if(response.success) {
            this.dataSource = response.result.records;
            this.total = response.result.total;
            this.ipagination.total = response.result.total;   
            this.loading = false;
          }
         else {
            this.$message.error(response.message)
            this.loading = false;
         }
        });
      },
      /** 搜索按钮操作 */
      handleProcessQuery() {
        this.queryProcessParams.pageNum = 1;
        this.listDefinition();
      },
      /** 重置按钮操作 */
      resetProcessQuery() {
        this.resetForm("queryProcessForm");
        this.handleProcessQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.open = true;
        this.title = "发起流程";
        this.listDefinition();
      },
      listDefinition(){
        listDefinition(this.queryProcessParams).then(response => {
          this.definitionList = response.result.records;
          this.processTotal = response.result.total;
          this.processLoading = false;
        });
      },
      /** 流程流转记录 */
      handleFlowRecord(row){
        this.$router.push({ path: '/flowable/task/record/index',
          query: {
            procInsId: row.procInsId,
            deployId: row.deployId,
            taskId: row.taskId,
            businessKey: row.businessKey,
            finished: false
        }})
      },
      /** 发起流程申请 */
      handleStartProcess(row) {
        if(row.category == 'oa') {
           /**  发起oa流程申请 */
           this.$router.push({ path: '/flowable/task/record/index',
             query: {
               deployId: row.deploymentId,
               procDefId:row.id,
               finished: true
               }
           })
        }
        else if(row.category == 'ddxz'){
          //发起钉钉薪资审批
           this.$router.push({ path: '/estar/StepForm'})
        }
        else if(row.category == 'ddrs'){
          
        }
        else if(row.category == 'ddxz'){
          
        }
        else {
          
        }
      },
      
      spryType(types){
        /*  1用户 4发起人的部门负责人 5部门负责人*/
        // this.spryTypes = types;
        if (this.spryTypes.indexOf('1')==-1) this.spry.userIds = '';
        if (this.spryTypes.indexOf('5')==-1) this.spry.departmentManageIds = '';
        //是否选中发起人的部门领导
        this.spry.chooseDepHeader = this.spryTypes.indexOf('4')>-1 ;
      
        console.log("this.spry",this.spry)
      },
      sprySubmit() {
        var _this = this;
       if (this.spryTypes.length==0){
         _this.$message.error("必须选择委托或转办人员！");
         return;
       }
       if (this.spry.userIds == ''){
         _this.$message.error("必须选择委托或转办人员！");
         return;
       }
        this.delegateassign = false;      
        this.assignee = this.spry.userIds;
        console.log("this.assign=",this.assign);
        if(this.type == "1") { //委派
          _this.handleDelegate();
        }
        else if(this.type == "2") { //转办
          _this.handleAssign();
        }
        else {
          _this.$message.error("不认识的类型，未知的错误！");
        }
      },
      
      closeNode() {
        this.delegateassign = false,
        this.current=0,
        this.spryTypes=[],
        this.spry={}
      },
      //弹出选择委派人员界面
      SelectUser(row,type){
        this.taskId = row.taskId;
        this.dataId = row.businessKey
        this.type = type;
        this.delegateassign = true ;
      },
      
      //委派流程
      handleDelegate(){
        const params = {
          taskId: this.taskId,
          assignee: this.assignee,
          dataId: this.dataId,
        }
        delegateTask(params).then( res => {
          this.$message.success(res.message);
          this.getList();
        });
      },
      
      //转办流程
      handleAssign(){
        const params = {
          taskId: this.taskId,
          assignee: this.assignee,
          dataId: this.dataId,
        }
        assignTask(params).then( res => {
          this.$message.success(res.message);
          this.getList();
        });
      },  
      /**  取消流程申请 */
      handleStop(row){
        const params = {
          instanceId: row.procInsId
        }
        stopProcess(params).then( res => {
          this.$message.success(res.message);
          this.getList();
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        // const ids = row.procInsId || this.ids;// 暂不支持删除多个流程
        const ids = row.procInsId;
        const dataid = row.businessKey;
        console.log("ids=,dataid=",ids,dataid);
        this.$confirm({
                title: '确认删除',//标题
                icon:'',//可以更换页面展示图标
                centered:true,//页面居中位置
                content: '是否确认删除流程定义编号为"' + ids + '"的数据项?',
                onOk:()=> {
                  delDeployment(ids,dataid).then((res) => {
                        if (res.success) {
                          this.$message.success("删除成功");
                          this.getList();
                        } else {
                          this.$message.warning(res.message)
                        }
                  })
                }
        }) ;
      },
      popupCallback(value,row){
        this.model = Object.assign(this.model, row);
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'procInsId',text:'任务编号'})
        fieldList.push({type:'string',value:'procDefName',text:'流程名称'})
        fieldList.push({type:'string',value:'category',text:'流程类别'})
        fieldList.push({type:'string',value: 'procDefVersion',text:'流程版本'})
        fieldList.push({type:'string',value: 'businessKey',text:'业务主键'})
        fieldList.push({type:'datetime',value:'createTime',text:'提交时间'})
        fieldList.push({type:'string',value:'finishTime',text:'流程状态'})
        fieldList.push({type:'string',value:'duration',text:'耗时'})
        fieldList.push({type:'string',value:'startUserName',text:'流程发起人'})
        fieldList.push({type:'string',value:'taskName',text:'当前节点'})
        fieldList.push({type:'string',value:'assigneeName',text:'办理'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
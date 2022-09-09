<template>
  <div>
    <!--  ==================流程定义列表===============  -->
    <a-card v-if="!xmlFrame.open||xmlView">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select @change="handleQuery" v-model="queryParams.category" placeholder="请选择流程分类" clearable
            prop="category">
            <el-option label="请选择" value="" />
            <el-option v-for="category in categorys" :key="category.id" :label="category.name" :value="category.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="激活" prop="active">
          <el-switch v-model="queryParams.active" active-color="#13ce66" inactive-color="#ff4949" @change="handleQuery">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleLoadXml">新增流程定义</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" fit :data="definitionList" border>
        <el-table-column label="流程定义id" align="center" prop="id" />
        <el-table-column label="流程标识Key" align="center" prop="key" />
        <el-table-column label="流程分类" align="center">
          <template slot-scope="scope">
            <span>{{ getCategoryName(scope.row.category) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流程名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" @click="handleReadImage(scope.row.deploymentId)">
              <span>{{ scope.row.name }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column  label="表单名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button v-if="(scope.row.formId) && (scope.row.category == 'zdyyw')" type="text" @click="handleCustomForm(scope.row.formId)">
              <span>{{ scope.row.formName }}</span>
            </el-button>
            <el-button v-else-if="scope.row.formId" type="text" @click="handleForm(scope.row.formId)">
              <span>{{ scope.row.formName }}</span>
            </el-button>
            <label v-else>暂无表单</label>
          </template>
        </el-table-column>
        <el-table-column label="流程版本" align="center">
          <template slot-scope="scope">
            <el-tag size="medium">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.suspensionState === 1">激活</el-tag>
            <el-tag type="warning" v-if="scope.row.suspensionState === 2">挂起</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="部署时间" align="center" prop="deploymentTime" width="180" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit-outline" @click.native="handleLoadXml(scope.row)">
                  编辑
                </el-dropdown-item>
               <el-dropdown-item icon="el-icon-connection" @click.native="handleAddForm(scope.row)" 
                 v-if="scope.row.formId == null && (scope.row.category == 'oa' || scope.row.category == 'cw')">
                配置表单
               </el-dropdown-item>
               <el-dropdown-item icon="el-icon-connection" @click.native="handleAddCustomForm(scope.row)"
                 v-if="scope.row.formId == null && (scope.row.category == 'zdyyw')">
                配置自定义业务表单
               </el-dropdown-item>
               <el-dropdown-item icon="el-icon-connection" @click.native="SubmitApplication(scope.row)" 
                 v-if="(scope.row.formId != null && (scope.row.category == 'oa' || scope.row.category == 'cw' )) 
                       || (scope.row.formId == null && (scope.row.category == 'ddxz' || scope.row.category == 'ddcw'))">
                发起申请
               </el-dropdown-item>
                <el-dropdown-item icon="el-icon-video-pause" @click.native="handleUpdateSuspensionState(scope.row)"
                  v-if="scope.row.suspensionState === 1">
                  挂起
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-video-play" @click.native="handleUpdateSuspensionState(scope.row)"
                  v-if="scope.row.suspensionState === 2">
                  激活
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-show="total>0" :total="total" :current-page.sync="queryParams.pageNum"
        :page-size.sync="queryParams.pageSize" @size-change="getList" @current-change="getList" />
    </a-card>
    <!-- 流程图 -->
    <a-card v-if="xmlFrame.open&&!xmlView" :title="xmlFrame.title">
      <a slot="extra" href="#" @click="()=>{xmlFrame.open=false}">返回</a>
      <bpmn-modeler v-if="xmlShow" ref="refNode" :xml="xmlData" :users="users" :groups="groups" :categorys="categorys"
        :is-view="xmlView" @save="save" />
    </a-card>
    <!--  弹窗预览  -->
    <a-modal :title="xmlFrame.title" :visible.sync="xmlView&&xmlFrame.open" :width="xmlFrame.width" :footer="null"
      closable @cancel="()=>{xmlView=false,xmlFrame.open=false}">
      <bpmn-modeler v-if="xmlShow" ref="refNode" :xml="xmlData" :users="users" :groups="groups" :categorys="categorys"
        :is-view="xmlView" @save="save" />
    </a-modal>
    <!--自定义表单弹窗预览-->
    <a-modal :title="customForm.title"  :visible.sync="customForm.visible" :footer="null" :maskClosable="false" 
             closable @cancel="()=>{customForm.visible=false}" width="80%">
      <component :disabled= "customForm.disabled" v-bind:is="customForm.formComponent" :model= "customForm.model"
                 :customFormData= "customForm.customFormData"></component>
    </a-modal>
    <!--表单配置详情formgenerator-->
      <!--  <el-dialog :title="formTitle" :visible.sync="formConfOpen" width="60%" append-to-body>
          <div class="test-form">
            <parser :key="new Date().getTime()"  :form-conf="formConf" />
          </div>
        </el-dialog>-->
     <!--表单配置详情formdesigner-->
         <el-dialog :title="formTitle" :visible.sync="formConfOpen" width="60%" append-to-body>
           <div class="test-form">
              <preview :itemList="itemList"  :formConf="formConf" v-if="formConfOpen"/>
           </div>
         </el-dialog>   
        
    <!--挂载表单-->
    <el-dialog :title="formDeployTitle" :visible.sync="formDeployOpen" width="60%" append-to-body>
      <el-row :gutter="64">
        <el-col :span="20" :xs="64">
          <el-table ref="singleTable" :data="formList" border highlight-current-row
            @current-change="handleCurrentChange" style="width: 100%">
            <el-table-column label="表单编号" align="center" prop="id" />
            <el-table-column label="表单名称" align="center" prop="formName" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="submitFormDeploy(scope.row)">确定</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination small layout="prev, pager, next" v-show="formTotal>0" :total="formTotal"
            :page.sync="formQueryParams.pageNum" :limit.sync="formQueryParams.pageSize" @pagination="ListFormDeploy" />
        </el-col>
        <el-col :span="14" :xs="24">
          <div v-if="currentRow">
            <parser :key="new Date().getTime()" :form-conf="currentRow" />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    
    <!--挂载自定义表单-->
    <el-dialog :title="formCustomTitle" :visible.sync="formCustomOpen" width="60%" append-to-body>
      <el-row :gutter="64">
        <el-col :span="20" :xs="64">
          <el-table ref="singleTable" :data="formList" border highlight-current-row
            @current-change="handleCurrentChange" style="width: 100%">
            <el-table-column label="自定义表单编号" align="center" prop="id" />
            <el-table-column label="自定义表单名称" align="center" prop="businessName" />
            <el-table-column label="自定义服务名" align="center" prop="businessService" />
            <el-table-column label="自定义表单路由地址" align="center" prop="routeName" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="submitCustomForm(scope.row)">确定</el-button>
              </template>
            </el-table-column>
          </el-table>
    
          <el-pagination small layout="prev, pager, next" v-show="formTotal>0" :total="formTotal"
            :page.sync="formQueryParams.pageNum" :limit.sync="formQueryParams.pageSize" @pagination="ListCustomForm" />
        </el-col>
        <el-col :span="14" :xs="24">
          <div v-if="currentRow">
            <parser :key="new Date().getTime()" :form-conf="currentRow" />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    
  </div>
</template>

<script>
  import bpmnModeler from "workflow-bpmn-modeler";
  import {
    categoryList,
    delDeployment,
    listDefinition,
    readXml,
    roleList,
    saveXml,
    updateState,
    userList
  } from "@views/flowable/api/definition";
  import { getForm, addDeployForm ,listForm ,listCustomForm ,addCustomForm ,getCustomForm ,addCustomDeployForm } from "@/api/form";
  import Parser from '@/components/parser/Parser'
  //import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { flowableMixin } from '@/views/flowable/mixins/flowableMixin'
  import preview from "@/components/formdesigner/components/preview";

  export default {
    //mixins: [flowableMixin, JeecgListMixin],
    mixins: [flowableMixin],
    components: {
      bpmnModeler,
      Parser,
      preview,
    },
    data() {
      return {
        /*===================设计器属性======================*/
        users: [],
        groups: [],
        categorys: [],
        /*=================页面属性===================*/
        loading: true,
        // 总条数
        total: 0,
        // 流程定义表格数据
        definitionList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        formConfOpen: false,
        itemList:[],//formdesigner预览显示数据
        formTitle: "",
        formDeployOpen: false,
        formCustomOpen: false,
        formDeployTitle: "",
        formCustomTitle: "",
        customForm: {     //自定义表单
           title:'',
           disabled:false,
           visible:false,
           formComponent : null,
           model:{},
           /*流程数据*/
           customFormData:{},
           isNew : false  
        },
        formList: [],
        formTotal: 0,
        formConf: {}, // 默认表单数据
        readImage: {
          open: false,
          src: "",
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
          engineVersion: null
        },
        xmlFrame: {
          width: '70%',
          title: '流程图',
          open: false,
          src: "",
        },
        formQueryParams:{
          pageNum: 1,
          pageSize: 10,
        },
        // 挂载表单到流程实例
        formDeployParam: {
          formId: null,
          deployId: null
        },
        currentRow: null,
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        // xml
        xmlData: "",
        xmlShow: true,
        xmlView: false
      };
    },
    created() {
      this.initUserAndRole();
      this.getList();
    },
    methods: {
      /*===============设计器===============*/
      initUserAndRole() {
        userList({}).then(res => {
          this.users = res.result || []
          this.users.map(o => {
            o.id = o.username
            o.name = o.realname
          })
        })
        roleList({}).then(res => {
          this.groups = res.result || []
          this.groups.map(o => {
            o.name = o.roleName
          })
        })
        categoryList({}).then(res => {
          this.categorys = res.result || []
        })
      },
      getModelDetail(deployId) {
        // 发送请求，获取xml
        readXml(deployId).then(res => {
          this.xmlData = res.result;
        })
      },
      getCategoryName(category) {
        let find = this.categorys.find(o => o.id == category);
        if (find) {
          return find.name
        }
        return ''
      },
      /*保存流程定义*/
      save(data) {
        console.log(data); // { process: {...}, xml: '...', svg: '...' }
        const params = {
          name: data.process.name,
          category: data.process.category,
          xml: data.xml
        }
        if (data.process.category ==null) {
          this.$message.success("请选择流程分类");
          return '';
        }
        saveXml(params).then(res => {
          if (res.success){
            this.$message.success(res.message)
            // 关闭当前标签页并返回上个页面
            this.getList()
            this.xmlFrame.open = false
          }
          else {
            this.$message.error(res.message)
          }
          
        })
      },
      /*================页面===============*/
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.queryParams.suspensionState = this.queryParams.active ? 1 : 0;
        this.getList();
      },
      /** 查询流程定义列表 */
      getList() {
        this.loading = true;
        listDefinition(this.queryParams).then(response => {
          console.log(response)
          this.definitionList = response.result.records;
          this.total = response.result.total;
          this.loading = false;
        });
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /** 打开流程设计弹窗页面 */
      handleLoadXml(row) {
        if (row && row.deploymentId) {
          console.log(row.deploymentId)
          this.handleReadImage(row.deploymentId)
          this.xmlView = false
          this.xmlFrame.title = "编辑流程图";
        } else {
          //新增
          this.xmlData = ''
          this.xmlView = false
          this.xmlFrame.open = true
          this.xmlFrame.title = '新增流程'
          this.xmlShow = false
          this.$nextTick(() => {
            this.xmlShow = true
          })
        }
        this.xmlFrame.width = '90%'
      },
      /** 流程图查看 */
      handleReadImage(deploymentId) {
        this.xmlFrame.title = "流程图";
        this.xmlFrame.open = true;
        this.xmlFrame.width = '70%';
        // this.xmlFrame.src = process.env.VUE_APP_BASE_API + "/flowable/definition/xmlFrame/" + deploymentId;
        // 发送请求，获取xml
        this.xmlView = true
        readXml(deploymentId).then(res => {
          if (res.success) {
            this.xmlData = res.result
            /*this.xmlShow = false
            this.$nextTick(()=>{
              this.xmlShow = true
            })*/
          } else {
            this.$message.error("获取流程图失败！")
          }
        })
      },
      // 打开业务表单
      handleForm(formId) {
        getForm(formId).then(res => {
          this.formTitle = "表单详情";
          this.formConfOpen = true;
          this.formConf = JSON.parse(res.result.formContent)
          this.itemList = this.formConf.list
        })
      },
      // 打开自定义业务表单
      handleCustomForm(formId) {
        getCustomForm(formId).then(res => {
          console.log("res=",res);
          this.customForm.title = "自定义表单详情";
          this.customForm.visible  = true;
          this.customForm.formComponent = this.getFormComponent(res.result.routeName).component;
           console.log("this.customForm.formComponent=",this.customForm.formComponent);
        })  
      },
      /** 启动流程 */
      handleDefinitionStart(row) {
        definitionStart(row.id).then(res => {
          this.$message.success(res.message);
        })
      },
      /** 配置表单弹框 */
      handleAddForm(row) {
        this.formDeployParam.deployId = row.deploymentId
        this.ListFormDeploy()
      },
      /** 配置自定义表单弹框 */
      handleAddCustomForm(row) {
        this.formDeployParam.deployId = row.deploymentId
        this.ListCustomForm()
      },
      /** 发起申请 */
      SubmitApplication(row) {
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
        if(row.category == 'cw') {
           /**  发起cw流程申请 */
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
          //发起钉钉薪资审批
           this.$router.push({ path: '/estar/StepForm'})
        }
        else if(row.category == 'zdyyw'){
          /**  发起自定义业务流程申请 */
         
        }
        else {
          
        }
      },
      /** 挂载表单列表 */
      ListFormDeploy() {
        listForm(this.formQueryParams).then(res => {
          this.formList = res.result.records;
          this.formTotal = res.result.total;
          this.formDeployOpen = true;
          this.formDeployTitle = "挂载表单";
        })
      },
      
      /** 挂载自定义业务表单列表 */
      ListCustomForm() {
        listCustomForm(this.formQueryParams).then(res => {
          this.formList = res.result.records;
          this.formTotal = res.result.total;
          this.formCustomOpen = true;
          this.formCustomTitle = "挂载自定义表单";
        })
      },
      
      // },
      /** 挂载表单 */
      submitFormDeploy(row) {
        this.formDeployParam.formId = row.id;
        addDeployForm(this.formDeployParam).then(res => {
          this.$message.success(res.message);
          this.formDeployOpen = false;
          this.getList();
        })
      },
      
      // },
      /** 挂载自定义表单 */
      submitCustomForm(row) {
        this.formDeployParam.formId = row.id;
        addDeployForm(this.formDeployParam).then(res => {
          this.$message.success(res.message);
          this.formCustomOpen = false;
          this.getList();
        })
      },
      handleCurrentChange(data) {
        if (data) {
          this.currentRow = JSON.parse(data.formContent);
        }
      },
      /** 挂起/激活流程 */
      handleUpdateSuspensionState(row) {
        let state = 1;
        if (row.suspensionState === 1) {
          state = 2
        }
        const params = {
          deployId: row.deploymentId,
          state: state
        }
        updateState(params).then(res => {
          this.$message.success(res.message);
          this.getList();
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        // const ids = row.deploymentId || this.ids;
        const params = {
          deployId: row.deploymentId
        }
        this.$confirm({
          title: "警告",
          content: '是否确认删除流程定义编号为"' + params.deployId + '"的数据项?',
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          onOk: () => {
            delDeployment(params).then(res => {
              this.getList();
              if (res.success) {
                this.$message.success('删除成功');
              } else {
                this.$message.success('删除失败');
              }
            })
          }
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有流程定义数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDeployment(queryParams);
        }).then(response => {
          this.download(response.message);
        })
      },
      /** 导入bpmn.xml文件 */
      handleImport() {
        this.upload.title = "bpmn20.xml文件导入";
        this.upload.open = true;
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$message(response.message);
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
    },
    computed: {
      getContainer() {
        return document.querySelector('#app')
      }
    }
  };
</script>

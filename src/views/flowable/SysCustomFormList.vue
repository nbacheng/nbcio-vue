<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('系统自定义表单表')">导出</a-button>
      
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="relationProcess(record)">关联流程</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
      
      <!--  弹窗预览  -->
      <el-dialog :title="xmlFrame.title" :visible.sync="xmlView&&xmlFrame.open" :width="xmlFrame.width" :footer="null"
        closable @cancel="()=>{xmlView=false,xmlFrame.open=false}" >
        <bpmn-modeler v-if="xmlShow" ref="refNode" :xml="xmlData" :users="users" :groups="groups" :categorys="categorys"
          :is-view="xmlView" />
      </el-dialog>
      
      <!--挂载流程定义-->
      <el-dialog :title="flowTitle" :visible.sync="flowOpen" width="60%" append-to-body>
        <el-row :gutter="64">
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
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
          </el-form>
        </el-row>
        <el-row :gutter="64">
          <el-col :span="20" :xs="64" style="width: 100%">
            <el-table ref="singleTable" :data="flowList" border highlight-current-row
              @current-change="handleCurrentChange" style="width: 100%">
              <el-table-column label="流程定义id" align="center" width="300" prop="id"/>
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
               <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                 <template slot-scope="scope">
                   <el-button size="mini" type="text" @click="submitCustom(scope.row)">确定</el-button>
                 </template>
               </el-table-column>
              </el-table> 
            <el-pagination v-show="flowTotal>0" :total="flowTotal" :current-page.sync="queryParams.pageNum"
              :page-size.sync="queryParams.pageSize" @size-change="getList" @current-change="getList" />  
            
          </el-col>
          <el-col :span="14" :xs="24">
            <div v-if="currentRow">
              <parser :key="new Date().getTime()" :form-conf="currentRow" />
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      
    </div>

    <sys-custom-form-modal ref="modalForm" @ok="modalFormOk"></sys-custom-form-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysCustomFormModal from './modules/SysCustomFormModal'
  import { categoryList, listDefinition, readXml } from "@views/flowable/api/definition";
  import bpmnModeler from "workflow-bpmn-modeler";
  import { updateCustom }from "@/api/form";
  
  export default {
    name: 'SysCustomFormList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SysCustomFormModal,
      bpmnModeler
    },
    data () {
      return {
        description: '系统自定义表单表管理页面',
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
            title:'业务表单名称',
            align:"center",
            dataIndex: 'businessName'
          },
          {
            title:'业务服务名称',
            align:"center",
            dataIndex: 'businessService'
          },
          {
            title:'关联流程发布主键',
            align:"center",
            dataIndex: 'deployId'
          },
          {
            title:'前端路由地址',
            align:"center",
            dataIndex: 'routeName'
          },
          {
            title:'组件注入方法',
            align:"center",
            dataIndex: 'component'
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title:'创建日期',
            align:"center",
            dataIndex: 'createTime'
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
          list: "/flowable/sysCustomForm/list",
          delete: "/flowable/sysCustomForm/delete",
          deleteBatch: "/flowable/sysCustomForm/deleteBatch",
          exportXlsUrl: "/flowable/sysCustomForm/exportXls",
          
        },
        dictOptions:{},
        superFieldList:[],
        //流程列表相关
        loading: true,
        // 总条数
        flowTotal: 0,
        flowTitle: '',
        flowOpen: false,
        flowList: [],
        users: [],
        groups: [],
        categorys: [],
        currentRow: null,
        // 挂载自定义表单到流程实例
        customParam: {
          id: null,
          deployId: null
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 8,
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
        // xml
        xmlData: "",
        xmlShow: true,
        xmlView: false,
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      relationProcess(row) {
        this.flowOpen = true;
        this.customParam.id = row.id;
        categoryList({}).then(res => {
          this.categorys = res.result || []
        })
        this.getList();
      },
      /** 查询流程定义列表 */
      getList() {
        this.loading = true;
        listDefinition(this.queryParams).then(response => {
          console.log(response)
          this.flowList = response.result.records;
          this.flowTotal = response.result.total;
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
      /*================页面===============*/
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.queryParams.suspensionState = this.queryParams.active ? 1 : 0;
        this.getList();
      },
      getCategoryName(category) {
        let find = this.categorys.find(o => o.id == category);
        if (find) {
          return find.name
        }
        return ''
      },
      /** 选择流程更新自定义表单信息 */
      submitCustom(row) {
        //this.customParam.id = row.id;
        this.customParam.deployId = row.deploymentId;
       const params = {
         id: this.customParam.id,
         deployId: row.deploymentId,
       }
        console.log("submitCustom params=",params);
        updateCustom(params).then(res => {
          this.$message.success(res.message);
          this.flowOpen = false;
          this.loadData();
        })
      },
      handleCurrentChange(data) {
        if (data) {
          this.currentRow = JSON.parse(data.formContent);
        }
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
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'businessName',text:'业务表单名称'})
        fieldList.push({type:'string',value:'businessService',text:'业务服务名称'})
        fieldList.push({type:'string',value:'deployId',text:'关联流程发布主键'})
        fieldList.push({type:'string',value:'routeName',text:'前端路由地址'})
        fieldList.push({type:'string',value:'component',text:'组件注入方法'})
        fieldList.push({type:'string',value:'createBy',text:'创建人'})
        fieldList.push({type:'datetime',value:'createTime',text:'创建日期'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
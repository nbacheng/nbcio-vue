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
      <a-button type="primary" icon="download" @click="handleExportXls('薪资审批表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
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
          <a @click="toOaFlowList(record)">流程跟踪</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
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
    </div>

    <oa-salaryapproval-modal ref="modalForm" @ok="modalFormOk"></oa-salaryapproval-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import OaSalaryapprovalModal from './modules/OaSalaryapprovalModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
    
  export default {
    name: 'OaSalaryapprovalList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      OaSalaryapprovalModal
    },
    data () {
      return {
        description: '薪资审批表管理页面',
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
            title:'申请单号',
            align:"center",
            dataIndex: 'no'
          },
          {
            title:'申请名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'申请原因',
            align:"center",
            dataIndex: 'reason'
          },
          {
            title:'开始时间',
            align:"center",
            dataIndex: 'startTime'
          },
          {
            title:'结束时间',
            align:"center",
            dataIndex: 'endTime'
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'processStatus_dictText'
          },
          {
            title:'流程实例ID',
            align:"center",
            dataIndex: 'processInstanceId'
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title:'创建时间',
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
          list: "/estar/oaSalaryapproval/list",
          delete: "/estar/oaSalaryapproval/delete",
          deleteBatch: "/estar/oaSalaryapproval/deleteBatch",
          exportXlsUrl: "/estar/oaSalaryapproval/exportXls",
          importExcelUrl: "estar/oaSalaryapproval/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
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
      toOaFlowList: function(record) {
        this.$router.push({
          path: '/estar/OaFlowList', 
          query: {
             name: record.name,
             processInstanceId: record.processInstanceId,
          }   
        })
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.$router.push({ path: '/estar/StepForm'})
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'no',text:'申请单号'})
        fieldList.push({type:'string',value:'name',text:'申请名称'})
        fieldList.push({type:'string',value:'reason',text:'申请原因'})
        fieldList.push({type:'datetime',value:'startTime',text:'开始时间'})
        fieldList.push({type:'datetime',value:'endTime',text:'结束时间'})
        fieldList.push({type:'int',value:'processStatus',text:'流程状态',dictCode:'bpm_status'})
        fieldList.push({type:'string',value:'processInstanceId',text:'流程实例ID'})
        fieldList.push({type:'string',value:'createBy',text:'创建人'})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        fieldList.push({type:'datetime',value:'updateTime',text:'修改时间'})
        fieldList.push({type:'string',value:'updateBy',text:'修改人'})
        fieldList.push({type:'string',value:'applyPerson',text:'申请人'})
        fieldList.push({type:'string',value:'fileUrl',text:'附件'})
        fieldList.push({type:'string',value:'remark',text:'备注'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
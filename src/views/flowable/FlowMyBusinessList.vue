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
      <a-button type="primary" icon="download" @click="handleExportXls('flow_my_business')">导出</a-button>
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
          <a @click="handleEdit(record)">编辑</a>

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

    <flow-my-business-modal ref="modalForm" @ok="modalFormOk"></flow-my-business-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlowMyBusinessModal from './modules/FlowMyBusinessModal'

  export default {
    name: 'FlowMyBusinessList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FlowMyBusinessModal
    },
    data () {
      return {
        description: 'flow_my_business管理页面',
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
            title:'流程定义key 一个key会有多个版本的id',
            align:"center",
            dataIndex: 'processDefinitionKey'
          },
          {
            title:'流程定义id 一个流程定义唯一',
            align:"center",
            dataIndex: 'processDefinitionId'
          },
          {
            title:'流程业务简要描述',
            align:"center",
            dataIndex: 'title'
          },
          {
            title:'业务表id，理论唯一',
            align:"center",
            dataIndex: 'dataId'
          },
          {
            title:'业务类名，用来获取spring容器里的服务对象',
            align:"center",
            dataIndex: 'serviceImplName'
          },
          {
            title:'申请人',
            align:"center",
            dataIndex: 'proposer'
          },
          {
            title:'流程状态说明，有：启动  撤回  驳回  审批中  审批通过  审批异常',
            align:"center",
            dataIndex: 'actStatus'
          },
          {
            title:'当前的节点定义上的Id',
            align:"center",
            dataIndex: 'taskId'
          },
          {
            title:'当前的节点',
            align:"center",
            dataIndex: 'taskName'
          },
          {
            title:'当前的节点实例上的Id',
            align:"center",
            dataIndex: 'taskNameId'
          },
          {
            title:'前的节点可以处理的用户名',
            align:"center",
            dataIndex: 'todoUsers'
          },
          {
            title:'处理过的人',
            align:"center",
            dataIndex: 'doneUsers'
          },
          {
            title:'当前任务节点的优先级 流程定义的时候所填',
            align:"center",
            dataIndex: 'priority'
          },
          {
            title:'前端页面显示的路由地址',
            align:"center",
            dataIndex: 'routeName'
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
          list: "/flowable/flowMyBusiness/list",
          delete: "/flowable/flowMyBusiness/delete",
          deleteBatch: "/flowable/flowMyBusiness/deleteBatch",
          exportXlsUrl: "/flowable/flowMyBusiness/exportXls",
          importExcelUrl: "flowable/flowMyBusiness/importExcel",
          
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
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'processDefinitionKey',text:'流程定义key 一个key会有多个版本的id'})
        fieldList.push({type:'string',value:'processDefinitionId',text:'流程定义id 一个流程定义唯一'})
        fieldList.push({type:'string',value:'title',text:'流程业务简要描述'})
        fieldList.push({type:'string',value:'dataId',text:'业务表id，理论唯一'})
        fieldList.push({type:'string',value:'serviceImplName',text:'业务类名，用来获取spring容器里的服务对象'})
        fieldList.push({type:'string',value:'proposer',text:'申请人'})
        fieldList.push({type:'string',value:'actStatus',text:'流程状态说明，有：启动  撤回  驳回  审批中  审批通过  审批异常'})
        fieldList.push({type:'string',value:'taskId',text:'当前的节点定义上的Id'})
        fieldList.push({type:'string',value:'taskName',text:'当前的节点'})
        fieldList.push({type:'string',value:'taskNameId',text:'当前的节点实例上的Id'})
        fieldList.push({type:'string',value:'todoUsers',text:'前的节点可以处理的用户名'})
        fieldList.push({type:'string',value:'doneUsers',text:'处理过的人'})
        fieldList.push({type:'string',value:'priority',text:'当前任务节点的优先级 流程定义的时候所填'})
        fieldList.push({type:'string',value:'routeName',text:'前端页面显示的路由地址'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
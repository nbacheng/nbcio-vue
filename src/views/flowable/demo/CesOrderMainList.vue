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
      <a-button type="primary" icon="download" @click="handleExportXls('商城订单表')">导出</a-button>
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
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
          <act-apply-btn @success="loadData" :data-id="record.id" :serviceName="serviceName" :variables="{}"></act-apply-btn>
          <act-handle-btn @success="loadData" :data-id="record.id" :type="0" text="通过"></act-handle-btn>
          <act-handle-btn @success="loadData" :data-id="record.id" :type="1" text="驳回"></act-handle-btn>
          <act-handle-btn @success="loadData" :data-id="record.id" :type="2" text="退回"></act-handle-btn>
          <act-cancel-btn @success="loadData" :data-id="record.id"></act-cancel-btn>
          <act-historic-detail-btn :data-id="record.id"></act-historic-detail-btn>
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

    <ces-order-main-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { mixinDevice } from '@/utils/mixin'
  import CesOrderMainModal from './modules/CesOrderMainModal'
  import '@/assets/less/TableExpand.less'
  import ActApplyBtn from "@views/flowable/components/ActApplyBtn";
  import ActCancelBtn from "@views/flowable/components/ActCancelBtn";
  import ActHandleBtn from "@views/flowable/components/ActHandleBtn";
  import ActHistoricDetailBtn from "@views/flowable/components/ActHistoricDetailBtn";


  export default {
    name: "CesOrderMainList",
    mixins:[JeecgListMixin,mixinDevice],
    components: {
      CesOrderMainModal,
      ActApplyBtn,
      ActCancelBtn,
      ActHandleBtn,
      ActHistoricDetailBtn
    },
    data () {
      return {
        description: '商城订单表管理页面',
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
            title:'订单编码',
            align:"center",
            dataIndex: 'orderCode'
          },
          {
            title:'下单时间',
            align:"center",
            dataIndex: 'xdDate'
          },
          {
            title:'订单总额',
            align:"center",
            dataIndex: 'money'
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'remark'
          },
          {
            title:'流程状态',
            align:"center",
            dataIndex: 'actStatus'
          },
          {
            title:'待处理节点',
            align:"center",
            dataIndex: 'taskName'
          },
          {
            title:'处理人',
            align:"center",
            dataIndex: 'todoUsers'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/demo/test/cesOrderMain/list",
          delete: "/demo/test/cesOrderMain/delete",
          deleteBatch: "/demo/test/cesOrderMain/deleteBatch",
          exportXlsUrl: "/demo/test/cesOrderMain/exportXls",
          importExcelUrl: "demo/test/cesOrderMain/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        serviceName: 'cesOrderMainService',
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'orderCode',text:'订单编码'})
         fieldList.push({type:'datetime',value:'xdDate',text:'下单时间'})
         fieldList.push({type:'number',value:'money',text:'订单总额'})
         fieldList.push({type:'string',value:'remark',text:'备注'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input placeholder="请输入用户名" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="性别">
              <j-dict-select-tag placeholder="请选择性别" v-model="queryParam.sex" dictCode="sex"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="生日">
                <j-date placeholder="请选择生日" v-model="queryParam.birthday"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="用户编码">
                <a-input placeholder="请输入用户编码" v-model="queryParam.userCode"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="城市">
                <j-area-linkage type="cascader" v-model="queryParam.chegnshi" placeholder="请选择省市区"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="checkbox">
                <j-dict-select-tag placeholder="请选择checkbox" v-model="queryParam.ceck" dictCode="sex"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="下拉多选">
                <j-multi-select-tag placeholder="请选择下拉多选" dictCode="sex" v-model="queryParam.xiamuti"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="搜索下拉">
                <j-search-select-tag placeholder="请选择搜索下拉" v-model="queryParam.searchSel" dict="sys_role,role_name,role_code"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('测试用户表')">导出</a-button>
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
        <template slot="pcaSlot" slot-scope="text">
          <div>{{ getPcaText(text) }}</div>
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
          <a-divider type="vertical" ></a-divider>
          <!--<a @click="relationAct(record)">关联流程</a> -->
          <act-apply-btn @success="loadData" :data-id="record.id" :serviceName="serviceName" :variables="{}"></act-apply-btn>
          <act-handle-btn @success="loadData" :data-id="record.id" :type="0" text="通过"></act-handle-btn>
          <act-handle-btn @success="loadData" :data-id="record.id" :type="1" text="驳回"></act-handle-btn>
          <act-handle-btn @success="loadData" :data-id="record.id" :type="2" text="退回"></act-handle-btn>
          <act-cancel-btn @success="loadData" :data-id="record.id"></act-cancel-btn>
          <act-historic-detail-btn :data-id="record.id"></act-historic-detail-btn>
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

    <test-demo-modal ref="modalForm" @ok="modalFormOk"></test-demo-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TestDemoModal from './modules/TestDemoModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import Area from '@/components/_util/Area'
  import {getAction} from "@api/manage";
  import ActApplyBtn from "@views/flowable/components/ActApplyBtn";
  import ActCancelBtn from "@views/flowable/components/ActCancelBtn";
  import ActHandleBtn from "@views/flowable/components/ActHandleBtn";
  import ActHistoricDetailBtn from "@views/flowable/components/ActHistoricDetailBtn";

  export default {
    name: 'TestDemoList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      TestDemoModal,
      ActApplyBtn,
      ActCancelBtn,
      ActHandleBtn,
      ActHistoricDetailBtn
    },
    data () {
      return {
        description: '测试用户表管理页面',
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
            title:'用户名',
            align:"center",
            sorter: true,
            dataIndex: 'name'
          },
          {
            title:'性别',
            align:"center",
            sorter: true,
            dataIndex: 'sex_dictText'
          },
          {
            title:'年龄',
            align:"center",
            dataIndex: 'age'
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
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/test_demo/testDemo/list",
          delete: "/test_demo/testDemo/delete",
          deleteBatch: "/test_demo/testDemo/deleteBatch",
          exportXlsUrl: "/test_demo/testDemo/exportXls",
          importExcelUrl: "test_demo/testDemo/importExcel",

        },
        dictOptions:{},
        pcaData:'',
        superFieldList:[],
        serviceName: 'testDemoService',
      }
    },
    created() {
      this.pcaData = new Area()
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      getPcaText(code){
        return this.pcaData.getText(code);
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'id',text:'主键',dictCode:''})
        fieldList.push({type:'string',value:'name',text:'用户名',dictCode:''})
        fieldList.push({type:'string',value:'sex',text:'性别',dictCode:'sex'})
        fieldList.push({type:'int',value:'age',text:'年龄',dictCode:''})
        fieldList.push({type:'string',value:'descc',text:'描述',dictCode:''})
        fieldList.push({type:'date',value:'birthday',text:'生日'})
        fieldList.push({type:'string',value:'userCode',text:'用户编码',dictCode:''})
        fieldList.push({type:'string',value:'topPic',text:'头像',dictCode:''})
        fieldList.push({type:'string',value:'fileKk',text:'附件',dictCode:''})
        fieldList.push({type:'pca',value:'chegnshi',text:'城市'})
        fieldList.push({type:'string',value:'pop',text:'弹窗',dictCode:''})
        fieldList.push({type:'string',value:'ceck',text:'checkbox',dictCode:'sex'})
        fieldList.push({type:'list_multi',value:'xiamuti',text:'下拉多选',dictTable:'', dictText:'', dictCode:'sex'})
        fieldList.push({type:'sel_search',value:'searchSel',text:'搜索下拉',dictTable:'sys_role', dictText:'role_name', dictCode:'role_code'})
        fieldList.push({type:'sel_search',value:'selTable',text:'下拉字典表',dictTable:'sys_user', dictText:'realname', dictCode:'username'})
        this.superFieldList = fieldList
      },
      relationAct(r) {
        getAction("/test_demo/testDemo/relationAct",{dataId:r.id}).then(res=>{
          if (res.success){
            this.$message.success("操作成功")
            this.loadData()
          } else {
            this.$message.error("操作失败")
          }
        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
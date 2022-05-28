<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="depno">
              <a-input placeholder="请输入depno" v-model="queryParam.depno"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="salaryyear">
              <a-input placeholder="请输入salaryyear" v-model="queryParam.salaryyear"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="salarymonth">
                <a-input placeholder="请输入salarymonth" v-model="queryParam.salarymonth"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('oa_gzspb')">导出</a-button>
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

    <oa-gzspb-modal ref="modalForm" @ok="modalFormOk"></oa-gzspb-modal>
  </a-card>
</template>

<script>
/*
  desc:  根据部门与年月，获取部门审批数据及子部门薪资汇总数据
  author: nbacheng
  date:   2022-02-28
  
  */
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import OaGzspbModal from './modules/OaGzspbModal'

  export default {
    name: 'OaGzspbList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      OaGzspbModal
    },
    data () {
      return {
        description: 'oa_gzspb管理页面',
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
            title:'empno',
            align:"center",
            dataIndex: 'empno'
          },
          {
            title:'depno',
            align:"center",
            dataIndex: 'depno'
          },
          {
            title:'salaryyear',
            align:"center",
            dataIndex: 'salaryyear'
          },
          {
            title:'salarymonth',
            align:"center",
            dataIndex: 'salarymonth'
          },
          {
            title:'qts',
            align:"center",
            dataIndex: 'qts'
          },
          {
            title:'shouldworkdays',
            align:"center",
            dataIndex: 'shouldworkdays'
          },
          {
            title:'factworkdays',
            align:"center",
            dataIndex: 'factworkdays'
          },
          {
            title:'absentworkdays',
            align:"center",
            dataIndex: 'absentworkdays'
          },
          {
            title:'middleworkdays',
            align:"center",
            dataIndex: 'middleworkdays'
          },
          {
            title:'nightworkdays',
            align:"center",
            dataIndex: 'nightworkdays'
          },
          {
            title:'lates',
            align:"center",
            dataIndex: 'lates'
          },
          {
            title:'overtimehours',
            align:"center",
            dataIndex: 'overtimehours'
          },
          {
            title:'overtimedays',
            align:"center",
            dataIndex: 'overtimedays'
          },
          {
            title:'qjb',
            align:"center",
            dataIndex: 'qjb'
          },
          {
            title:'absentdays',
            align:"center",
            dataIndex: 'absentdays'
          },
          {
            title:'latetime',
            align:"center",
            dataIndex: 'latetime'
          },
          {
            title:'sj',
            align:"center",
            dataIndex: 'sj'
          },
          {
            title:'bj',
            align:"center",
            dataIndex: 'bj'
          },
          {
            title:'cj',
            align:"center",
            dataIndex: 'cj'
          },
          {
            title:'gsj',
            align:"center",
            dataIndex: 'gsj'
          },
          {
            title:'hsj',
            align:"center",
            dataIndex: 'hsj'
          },
          {
            title:'dxnxj',
            align:"center",
            dataIndex: 'dxnxj'
          },
          {
            title:'wpznxj',
            align:"center",
            dataIndex: 'wpznxj'
          },
          {
            title:'basepay',
            align:"center",
            dataIndex: 'basepay'
          },
          {
            title:'skillpay',
            align:"center",
            dataIndex: 'skillpay'
          },
          {
            title:'positionpay',
            align:"center",
            dataIndex: 'positionpay'
          },
          {
            title:'addpay',
            align:"center",
            dataIndex: 'addpay'
          },
          {
            title:'jbf',
            align:"center",
            dataIndex: 'jbf'
          },
          {
            title:'subconfficient',
            align:"center",
            dataIndex: 'subconfficient'
          },
          {
            title:'sumpay',
            align:"center",
            dataIndex: 'sumpay'
          },
          {
            title:'ykgz',
            align:"center",
            dataIndex: 'ykgz'
          },
          {
            title:'bkgz',
            align:"center",
            dataIndex: 'bkgz'
          },
          {
            title:'yfgz',
            align:"center",
            dataIndex: 'yfgz'
          },
          {
            title:'nightallowance',
            align:"center",
            dataIndex: 'nightallowance'
          },
          {
            title:'zfbt',
            align:"center",
            dataIndex: 'zfbt'
          },
          {
            title:'treatment',
            align:"center",
            dataIndex: 'treatment'
          },
          {
            title:'tcbt',
            align:"center",
            dataIndex: 'tcbt'
          },
          {
            title:'lyf',
            align:"center",
            dataIndex: 'lyf'
          },
          {
            title:'nxjbt',
            align:"center",
            dataIndex: 'nxjbt'
          },
          {
            title:'gwjt',
            align:"center",
            dataIndex: 'gwjt'
          },
          {
            title:'zybbt',
            align:"center",
            dataIndex: 'zybbt'
          },
          {
            title:'bk',
            align:"center",
            dataIndex: 'bk'
          },
          {
            title:'qtbt',
            align:"center",
            dataIndex: 'qtbt'
          },
          {
            title:'allowance',
            align:"center",
            dataIndex: 'allowance'
          },
          {
            title:'rewards',
            align:"center",
            dataIndex: 'rewards'
          },
          {
            title:'punishment',
            align:"center",
            dataIndex: 'punishment'
          },
          {
            title:'wholeaward',
            align:"center",
            dataIndex: 'wholeaward'
          },
          {
            title:'sumrp',
            align:"center",
            dataIndex: 'sumrp'
          },
          {
            title:'ybkk',
            align:"center",
            dataIndex: 'ybkk'
          },
          {
            title:'zsf',
            align:"center",
            dataIndex: 'zsf'
          },
          {
            title:'txf',
            align:"center",
            dataIndex: 'txf'
          },
          {
            title:'gzzyj',
            align:"center",
            dataIndex: 'gzzyj'
          },
          {
            title:'wyj',
            align:"center",
            dataIndex: 'wyj'
          },
          {
            title:'kjk',
            align:"center",
            dataIndex: 'kjk'
          },
          {
            title:'dkkx',
            align:"center",
            dataIndex: 'dkkx'
          },
          {
            title:'ylbxjs',
            align:"center",
            dataIndex: 'ylbxjs'
          },
          {
            title:'ylbx',
            align:"center",
            dataIndex: 'ylbx'
          },
          {
            title:'sybx',
            align:"center",
            dataIndex: 'sybx'
          },
          {
            title:'zfgjj',
            align:"center",
            dataIndex: 'zfgjj'
          },
          {
            title:'dkbx',
            align:"center",
            dataIndex: 'dkbx'
          },
          {
            title:'tax',
            align:"center",
            dataIndex: 'tax'
          },
          {
            title:'toyalpay',
            align:"center",
            dataIndex: 'toyalpay'
          },
          {
            title:'grgz',
            align:"center",
            dataIndex: 'grgz'
          },
          {
            title:'gzzh',
            align:"center",
            dataIndex: 'gzzh'
          },
          {
            title:'xj',
            align:"center",
            dataIndex: 'xj'
          },
          {
            title:'zj',
            align:"center",
            dataIndex: 'zj'
          },
          {
            title:'bak7',
            align:"center",
            dataIndex: 'bak7'
          },
          {
            title:'hzj',
            align:"center",
            dataIndex: 'hzj'
          },
          {
            title:'hxj',
            align:"center",
            dataIndex: 'hxj'
          },
          {
            title:'gzkhbak',
            align:"center",
            dataIndex: 'gzkhbak'
          },
          {
            title:'khhjngz',
            align:"center",
            dataIndex: 'khhjngz'
          },
          {
            title:'ylbxgs',
            align:"center",
            dataIndex: 'ylbxgs'
          },
          {
            title:'sybxgs',
            align:"center",
            dataIndex: 'sybxgs'
          },
          {
            title:'zfgjjgs',
            align:"center",
            dataIndex: 'zfgjjgs'
          },
          {
            title:'jjzj',
            align:"center",
            dataIndex: 'jjzj'
          },
          {
            title:'jjxj',
            align:"center",
            dataIndex: 'jjxj'
          },
          {
            title:'lastjjxj',
            align:"center",
            dataIndex: 'lastjjxj'
          },
          {
            title:'bonuscoefficient',
            align:"center",
            dataIndex: 'bonuscoefficient'
          },
          {
            title:'bonus',
            align:"center",
            dataIndex: 'bonus'
          },
          {
            title:'ydjj',
            align:"center",
            dataIndex: 'ydjj'
          },
          {
            title:'jdjj',
            align:"center",
            dataIndex: 'jdjj'
          },
          {
            title:'jjze',
            align:"center",
            dataIndex: 'jjze'
          },
          {
            title:'bkjj',
            align:"center",
            dataIndex: 'bkjj'
          },
          {
            title:'ykjj',
            align:"center",
            dataIndex: 'ykjj'
          },
          {
            title:'khhjjxs',
            align:"center",
            dataIndex: 'khhjjxs'
          },
          {
            title:'jjkhbak',
            align:"center",
            dataIndex: 'jjkhbak'
          },
          {
            title:'totalbonus',
            align:"center",
            dataIndex: 'totalbonus'
          },
          {
            title:'jjzh',
            align:"center",
            dataIndex: 'jjzh'
          },
          {
            title:'xzze',
            align:"center",
            dataIndex: 'xzze'
          },
          {
            title:'ykxz',
            align:"center",
            dataIndex: 'ykxz'
          },
          {
            title:'bkxz',
            align:"center",
            dataIndex: 'bkxz'
          },
          {
            title:'sfxz',
            align:"center",
            dataIndex: 'sfxz'
          },
          {
            title:'sumpay1',
            align:"center",
            dataIndex: 'sumpay1'
          },
          {
            title:'sumpay2',
            align:"center",
            dataIndex: 'sumpay2'
          },
          {
            title:'yfgz1',
            align:"center",
            dataIndex: 'yfgz1'
          },
          {
            title:'yfgz2',
            align:"center",
            dataIndex: 'yfgz2'
          },
          {
            title:'ykgz1',
            align:"center",
            dataIndex: 'ykgz1'
          },
          {
            title:'ykgz2',
            align:"center",
            dataIndex: 'ykgz2'
          },
          {
            title:'toyalpay1',
            align:"center",
            dataIndex: 'toyalpay1'
          },
          {
            title:'toyalpay2',
            align:"center",
            dataIndex: 'toyalpay2'
          },
          {
            title:'comsubsidy',
            align:"center",
            dataIndex: 'comsubsidy'
          },
          {
            title:'corpsubsidy',
            align:"center",
            dataIndex: 'corpsubsidy'
          },
          {
            title:'kshbt',
            align:"center",
            dataIndex: 'kshbt'
          },
          {
            title:'allowancenew',
            align:"center",
            dataIndex: 'allowancenew'
          },
          {
            title:'tax1',
            align:"center",
            dataIndex: 'tax1'
          },
          {
            title:'tax2',
            align:"center",
            dataIndex: 'tax2'
          },
          {
            title:'yilbx',
            align:"center",
            dataIndex: 'yilbx'
          },
          {
            title:'yilbxgs',
            align:"center",
            dataIndex: 'yilbxgs'
          },
          {
            title:'bak9',
            align:"center",
            dataIndex: 'bak9'
          },
          {
            title:'bak10',
            align:"center",
            dataIndex: 'bak10'
          },
          {
            title:'bak8',
            align:"center",
            dataIndex: 'bak8'
          },
          {
            title:'taxfj1',
            align:"center",
            dataIndex: 'taxfj1'
          },
          {
            title:'taxfj2',
            align:"center",
            dataIndex: 'taxfj2'
          },
          {
            title:'taxfj3',
            align:"center",
            dataIndex: 'taxfj3'
          },
          {
            title:'taxfj4',
            align:"center",
            dataIndex: 'taxfj4'
          },
          {
            title:'taxfj5',
            align:"center",
            dataIndex: 'taxfj5'
          },
          {
            title:'taxyj',
            align:"center",
            dataIndex: 'taxyj'
          },
          {
            title:'ym',
            align:"center",
            dataIndex: 'ym'
          },
          {
            title:'taxmonth',
            align:"center",
            dataIndex: 'taxmonth'
          },
          {
            title:'registerdate',
            align:"center",
            dataIndex: 'registerdate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'username',
            align:"center",
            dataIndex: 'username'
          },
          {
            title:'depname',
            align:"center",
            dataIndex: 'depname'
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
          list: "/estar/oaGzspb/list",
          delete: "/estar/oaGzspb/delete",
          deleteBatch: "/estar/oaGzspb/deleteBatch",
          exportXlsUrl: "/estar/oaGzspb/exportXls",
          importExcelUrl: "estar/oaGzspb/importExcel",
          
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
        fieldList.push({type:'string',value:'empno',text:'empno'})
        fieldList.push({type:'string',value:'depno',text:'depno'})
        fieldList.push({type:'int',value:'salaryyear',text:'salaryyear'})
        fieldList.push({type:'int',value:'salarymonth',text:'salarymonth'})
        fieldList.push({type:'number',value:'qts',text:'qts'})
        fieldList.push({type:'number',value:'shouldworkdays',text:'shouldworkdays'})
        fieldList.push({type:'number',value:'factworkdays',text:'factworkdays'})
        fieldList.push({type:'number',value:'absentworkdays',text:'absentworkdays'})
        fieldList.push({type:'number',value:'middleworkdays',text:'middleworkdays'})
        fieldList.push({type:'number',value:'nightworkdays',text:'nightworkdays'})
        fieldList.push({type:'number',value:'lates',text:'lates'})
        fieldList.push({type:'number',value:'overtimehours',text:'overtimehours'})
        fieldList.push({type:'number',value:'overtimedays',text:'overtimedays'})
        fieldList.push({type:'number',value:'qjb',text:'qjb'})
        fieldList.push({type:'number',value:'absentdays',text:'absentdays'})
        fieldList.push({type:'int',value:'latetime',text:'latetime'})
        fieldList.push({type:'number',value:'sj',text:'sj'})
        fieldList.push({type:'number',value:'bj',text:'bj'})
        fieldList.push({type:'number',value:'cj',text:'cj'})
        fieldList.push({type:'number',value:'gsj',text:'gsj'})
        fieldList.push({type:'number',value:'hsj',text:'hsj'})
        fieldList.push({type:'number',value:'dxnxj',text:'dxnxj'})
        fieldList.push({type:'number',value:'wpznxj',text:'wpznxj'})
        fieldList.push({type:'number',value:'basepay',text:'basepay'})
        fieldList.push({type:'number',value:'skillpay',text:'skillpay'})
        fieldList.push({type:'number',value:'positionpay',text:'positionpay'})
        fieldList.push({type:'number',value:'addpay',text:'addpay'})
        fieldList.push({type:'number',value:'jbf',text:'jbf'})
        fieldList.push({type:'number',value:'subconfficient',text:'subconfficient'})
        fieldList.push({type:'number',value:'sumpay',text:'sumpay'})
        fieldList.push({type:'number',value:'ykgz',text:'ykgz'})
        fieldList.push({type:'number',value:'bkgz',text:'bkgz'})
        fieldList.push({type:'number',value:'yfgz',text:'yfgz'})
        fieldList.push({type:'number',value:'nightallowance',text:'nightallowance'})
        fieldList.push({type:'number',value:'zfbt',text:'zfbt'})
        fieldList.push({type:'number',value:'treatment',text:'treatment'})
        fieldList.push({type:'number',value:'tcbt',text:'tcbt'})
        fieldList.push({type:'number',value:'lyf',text:'lyf'})
        fieldList.push({type:'number',value:'nxjbt',text:'nxjbt'})
        fieldList.push({type:'number',value:'gwjt',text:'gwjt'})
        fieldList.push({type:'number',value:'zybbt',text:'zybbt'})
        fieldList.push({type:'number',value:'bk',text:'bk'})
        fieldList.push({type:'number',value:'qtbt',text:'qtbt'})
        fieldList.push({type:'number',value:'allowance',text:'allowance'})
        fieldList.push({type:'number',value:'rewards',text:'rewards'})
        fieldList.push({type:'number',value:'punishment',text:'punishment'})
        fieldList.push({type:'number',value:'wholeaward',text:'wholeaward'})
        fieldList.push({type:'number',value:'sumrp',text:'sumrp'})
        fieldList.push({type:'number',value:'ybkk',text:'ybkk'})
        fieldList.push({type:'number',value:'zsf',text:'zsf'})
        fieldList.push({type:'number',value:'txf',text:'txf'})
        fieldList.push({type:'number',value:'gzzyj',text:'gzzyj'})
        fieldList.push({type:'number',value:'wyj',text:'wyj'})
        fieldList.push({type:'number',value:'kjk',text:'kjk'})
        fieldList.push({type:'number',value:'dkkx',text:'dkkx'})
        fieldList.push({type:'number',value:'ylbxjs',text:'ylbxjs'})
        fieldList.push({type:'number',value:'ylbx',text:'ylbx'})
        fieldList.push({type:'number',value:'sybx',text:'sybx'})
        fieldList.push({type:'number',value:'zfgjj',text:'zfgjj'})
        fieldList.push({type:'number',value:'dkbx',text:'dkbx'})
        fieldList.push({type:'number',value:'tax',text:'tax'})
        fieldList.push({type:'number',value:'toyalpay',text:'toyalpay'})
        fieldList.push({type:'number',value:'grgz',text:'grgz'})
        fieldList.push({type:'string',value:'gzzh',text:'gzzh'})
        fieldList.push({type:'string',value:'xj',text:'xj'})
        fieldList.push({type:'string',value:'zj',text:'zj'})
        fieldList.push({type:'string',value:'bak7',text:'bak7'})
        fieldList.push({type:'string',value:'hzj',text:'hzj'})
        fieldList.push({type:'string',value:'hxj',text:'hxj'})
        fieldList.push({type:'string',value:'gzkhbak',text:'gzkhbak'})
        fieldList.push({type:'number',value:'khhjngz',text:'khhjngz'})
        fieldList.push({type:'number',value:'ylbxgs',text:'ylbxgs'})
        fieldList.push({type:'number',value:'sybxgs',text:'sybxgs'})
        fieldList.push({type:'number',value:'zfgjjgs',text:'zfgjjgs'})
        fieldList.push({type:'string',value:'jjzj',text:'jjzj'})
        fieldList.push({type:'string',value:'jjxj',text:'jjxj'})
        fieldList.push({type:'string',value:'lastjjxj',text:'lastjjxj'})
        fieldList.push({type:'number',value:'bonuscoefficient',text:'bonuscoefficient'})
        fieldList.push({type:'number',value:'bonus',text:'bonus'})
        fieldList.push({type:'number',value:'ydjj',text:'ydjj'})
        fieldList.push({type:'number',value:'jdjj',text:'jdjj'})
        fieldList.push({type:'number',value:'jjze',text:'jjze'})
        fieldList.push({type:'number',value:'bkjj',text:'bkjj'})
        fieldList.push({type:'number',value:'ykjj',text:'ykjj'})
        fieldList.push({type:'number',value:'khhjjxs',text:'khhjjxs'})
        fieldList.push({type:'string',value:'jjkhbak',text:'jjkhbak'})
        fieldList.push({type:'number',value:'totalbonus',text:'totalbonus'})
        fieldList.push({type:'string',value:'jjzh',text:'jjzh'})
        fieldList.push({type:'int',value:'xzze',text:'xzze'})
        fieldList.push({type:'int',value:'ykxz',text:'ykxz'})
        fieldList.push({type:'int',value:'bkxz',text:'bkxz'})
        fieldList.push({type:'int',value:'sfxz',text:'sfxz'})
        fieldList.push({type:'number',value:'sumpay1',text:'sumpay1'})
        fieldList.push({type:'number',value:'sumpay2',text:'sumpay2'})
        fieldList.push({type:'number',value:'yfgz1',text:'yfgz1'})
        fieldList.push({type:'number',value:'yfgz2',text:'yfgz2'})
        fieldList.push({type:'number',value:'ykgz1',text:'ykgz1'})
        fieldList.push({type:'number',value:'ykgz2',text:'ykgz2'})
        fieldList.push({type:'number',value:'toyalpay1',text:'toyalpay1'})
        fieldList.push({type:'number',value:'toyalpay2',text:'toyalpay2'})
        fieldList.push({type:'number',value:'comsubsidy',text:'comsubsidy'})
        fieldList.push({type:'number',value:'corpsubsidy',text:'corpsubsidy'})
        fieldList.push({type:'number',value:'kshbt',text:'kshbt'})
        fieldList.push({type:'number',value:'allowancenew',text:'allowancenew'})
        fieldList.push({type:'number',value:'tax1',text:'tax1'})
        fieldList.push({type:'number',value:'tax2',text:'tax2'})
        fieldList.push({type:'number',value:'yilbx',text:'yilbx'})
        fieldList.push({type:'number',value:'yilbxgs',text:'yilbxgs'})
        fieldList.push({type:'string',value:'bak9',text:'bak9'})
        fieldList.push({type:'string',value:'bak10',text:'bak10'})
        fieldList.push({type:'string',value:'bak8',text:'bak8'})
        fieldList.push({type:'number',value:'taxfj1',text:'taxfj1'})
        fieldList.push({type:'number',value:'taxfj2',text:'taxfj2'})
        fieldList.push({type:'number',value:'taxfj3',text:'taxfj3'})
        fieldList.push({type:'number',value:'taxfj4',text:'taxfj4'})
        fieldList.push({type:'number',value:'taxfj5',text:'taxfj5'})
        fieldList.push({type:'number',value:'taxyj',text:'taxyj'})
        fieldList.push({type:'int',value:'ym',text:'ym'})
        fieldList.push({type:'int',value:'taxmonth',text:'taxmonth'})
        fieldList.push({type:'date',value:'registerdate',text:'registerdate'})
        fieldList.push({type:'string',value:'username',text:'username'})
        fieldList.push({type:'string',value:'depname',text:'depname'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
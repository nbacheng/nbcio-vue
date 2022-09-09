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
      <a-button type="primary" icon="download" @click="handleExportXls('系统流程表单')">导出</a-button>
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
          <a @click="handleUpdate(record)">编辑</a>

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
      
      <!--表单配置详情 formgenerator-->
      <!--<el-dialog :title="formTitle" :visible.sync="formConfOpen" width="60%" append-to-body>
        <div class="test-form">
          <parser :key="new Date().getTime()"  :form-conf="formConf" />
        </div>
      </el-dialog>-->
      <!--表单配置详情 formdesigner-->
      <el-dialog :title="formTitle" :visible.sync="formConfOpen" width="60%" append-to-body>
        <div class="test-form">
          <preview :itemList="itemList"  :formConf="formConf" v-if="formConfOpen"/>
        </div>
      </el-dialog>
    </div>

    <sys-form-modal ref="modalForm" @ok="modalFormOk"></sys-form-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysFormModal from './modules/SysFormModal'
  import Editor from '@/components/Editor';
  import Parser from '@/components/parser/Parser'
  import preview from "@/components/formdesigner/components/preview";

  export default {
    name: 'SysFormList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
       Editor,
       Parser,
       SysFormModal,
       preview
    },
    data () {
      return {
        description: '系统流程表单管理页面',
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
            title:'表单名称',
            align:"center",
            dataIndex: 'formName'
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
            title:'备注',
            align:"center",
            dataIndex: 'remark'
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
          list: "/flowable/form/list",
          delete: "/flowable/form/delete",
          deleteBatch: "/flowable/form/deleteBatch",
          exportXlsUrl: "/flowable/form/exportXls",
          importExcelUrl: "flowable/form/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        formConf: {}, // 默认表单数据
        formConfOpen: false,
        formTitle: "",
        // 是否显示弹出层
        open: false,
        itemList:[],//formdesigner预览显示数据
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
      /** 新增按钮操作 */
      handleAdd() {
        //this.$router.push({ path: '/tool/build/index', query: {id: null }})
        this.$router.push({ path: '/formdesigner/formdesigner', query: {id: null }})
      },
      /** 表单配置信息 */
      handleDetail(row){
        console.log("handleDetail row=",row);
        this.formConfOpen = true;
        this.formTitle = "流程表单配置详细";
        const formcontent = JSON.parse(row.formContent);
        console.log("handleDetail formcontent=",formcontent);
        this.formConf = formcontent.config;
        this.itemList = formcontent.list;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        //this.$router.push({ path: '/tool/build/index', query: {id: row.id }})
        this.$router.push({ path: '/formdesigner/formdesigner', query: {id: row.id }})
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateForm(this.form).then(response => {
                this.$message.success("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addForm(this.form).then(response => {
                this.$message.success("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'formName',text:'表单名称'})
        fieldList.push({type:'string',value:'formContent',text:'表单内容'})
        fieldList.push({type:'string',value:'createBy',text:'创建人'})
        fieldList.push({type:'datetime',value:'createTime',text:'创建日期'})
        fieldList.push({type:'string',value:'remark',text:'备注'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
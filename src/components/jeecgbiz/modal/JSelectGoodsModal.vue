<template>
  <a-modal
    :width="1200"
    :visible="visible"
    :title="title"
    @ok="handleSubmit"
    @cancel="close"
    cancelText="关闭"
    style="top:5%;height: 100%;overflow-y: hidden"
    wrapClassName="ant-modal-cust-warp"
  >
    <a-row :gutter="10" style="padding: 10px; margin: -10px">
      <a-col :md="24" :sm="24">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <!-- 搜索区域 -->
          <a-form layout="inline" @keyup.enter.native="onSearch">
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item label="商品" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-input ref="goods" placeholder="名称" v-model="queryParam.q"></a-input>
                </a-form-item>
              </a-col>
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-col :md="6" :sm="24">
                  <a-button type="primary" @click="loadGoodsData(1)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="searchReset(1)">重置</a-button>
                </a-col>
              </span>
            </a-row>
          </a-form>
          <a-table
            ref="table"
            :scroll="scrollTrigger"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
            :loading="loading"
            :customRow="rowAction"
            @change="handleTableChange">
            <template slot="customRenderEnableSerialNumber" slot-scope="enableSerialNumber">
              <a-tag v-if="enableSerialNumber==1" color="green">有</a-tag>
              <a-tag v-if="enableSerialNumber==0" color="orange">无</a-tag>
            </template>
            <template slot="customRenderEnableBatchNumber" slot-scope="enableBatchNumber">
              <a-tag v-if="enableBatchNumber==1" color="green">有</a-tag>
              <a-tag v-if="enableBatchNumber==0" color="orange">无</a-tag>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import {filterObj} from '@/utils/util'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import Vue from 'vue'

  export default {
    name: 'JSelectGoodsModal',
    mixins:[JeecgListMixin],
    components: {},
    props: ['modalWidth', 'rows', 'multi', 'goodCode'],
    data() {
      return {
        queryParam: {
          q: ''
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        categoryTree:[],
        columns: [
          {dataIndex: 'code', title: '编码'},
          {dataIndex: 'name', title: '名称'},
          {dataIndex: 'price', title: '价格'},
          {dataIndex: 'chucDate', title: '出厂时间'},    
        ],
        scrollTrigger: {},
        dataSource: [],
        selectedRowKeys: [],
        selectGoodsRows: [],
        selectGoodsIds: [],
        title: '选择商品',
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        visible: false,
        form: this.$form.createForm(this),
        loading: false,
        expandedKeys: [],
        disableMixinCreated: true,
        goodsType: [],
        url: {
          goodslist: "/test/cesShopGoods/list", 
          categorylist: "/test/cesShopType/rootList",
        },
      }
    },
    computed: {
      // 计算属性的 getter
      getType: function () {
        return this.multi == true ? 'checkbox' : 'radio';
      }
    },
    watch: {
      goodCode: {
        immediate: true,
        handler() {
          this.initcode()
        }
      },
    },
    created() {
      // 该方法触发屏幕自适应
      this.resetScreenSize()
    },
    methods: {
      initcode() {
        if (this.goodCode) {
          this.$emit('initComp', this.goodCode)
        } else {
          // JSelectUserByDep组件bug issues/I16634
          this.$emit('initComp', '')
        }
      },
      loadGoodsData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.loading = true
        let params = this.getQueryParams()//查询条件
        getAction(this.url.goodslist,params).then((res) => {
          if (res) {
            console.log("goodslist res.result = ",res.result);
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
            if(res.total ===1) {
              this.title = '选择商品'
              this.$nextTick(() => this.$refs.goods.focus());
            } else {
              this.title = '选择商品'
            }
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 触发屏幕自适应
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal(goodCode) {
        this.visible = true;
        this.title = '选择商品'
        this.queryParam.code = goodCode;
        this.$nextTick(() => this.$refs.goods.focus());
        this.loadGoodsData();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.page = this.ipagination.current;
        param.rows = this.ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        if (num !== 0) {
          that.queryParam = {};
          that.loadGoodsData(1);
        }
        that.selectedRowKeys = [];
        that.selectGoodsIds = [];
      },
      close() {
        this.searchReset(0);
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadGoodsData();
      },
      handleSubmit() {
        let that = this;
        this.getSelectGoodsRows();
        that.$emit('ok', that.selectGoodsRows, that.selectGoodsIds);
        that.searchReset(0)
        that.close();
      },
      //获取选择信息
      getSelectGoodsRows(rowId) {
        let dataSource = this.dataSource;
        console.log("getSelectGoodsRows datasource=",dataSource);
        let goodsIds = "";
        this.selectGoodsRows = [];
        for (let i = 0, len = dataSource.length; i < len; i++) {
          if (this.selectedRowKeys.includes(dataSource[i].id)) {
            this.selectGoodsRows.push(dataSource[i]);
            goodsIds = goodsIds + "," + dataSource[i].code;
          }
        }
        this.selectGoodsIds = goodsIds.substring(1);
        console.log("getSelectGoodsRows selectGoodsRows=",this.selectGoodsRows);
        console.log("getSelectGoodsRows selectGoodsIds=",this.selectGoodsIds);
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      onSearch() {
        if(this.dataSource && this.dataSource.length===1) {
          if(this.queryParam.q === this.dataSource[0].code||
            this.queryParam.q === this.dataSource[0].name) {
            let arr = []
            arr.push(this.dataSource[0].id)
            this.selectedRowKeys = arr
            this.handleSubmit()
          } else {
            this.loadGoodsData(1)
          }
        } else {
          this.loadGoodsData(1)
        }
      },
      modalFormOk() {
        this.loadGoodsData()
      },
      rowAction(record, index) {
        return {
          on: {
            click: () => {
              let arr = []
              arr.push(record.id)
              this.selectedRowKeys = arr
            },
            dblclick: () => {
              let arr = []
              arr.push(record.id)
              this.selectedRowKeys = arr
              this.handleSubmit()
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
</style>
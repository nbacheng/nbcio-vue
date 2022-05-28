<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="订单编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderCode">
              <a-input v-model="model.orderCode" placeholder="请输入订单编码" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="下单时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="xdDate">
              <j-date placeholder="请选择下单时间" v-model="model.xdDate" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="订单总额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="money">
              <a-input-number v-model="model.money" placeholder="请输入订单总额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="订单商品" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="cesOrderGoodsTable.loading"
          :columns="cesOrderGoodsTable.columns"
          :dataSource="cesOrderGoodsTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          @valueChange="onValueChange"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="订单客户" :key="refKeys[1]" :forceRender="true">
        <ces-order-customer-form ref="cesOrderCustomerForm" @validateError="validateError" :disabled="formDisabled"></ces-order-customer-form>
      </a-tab-pane>
      
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction, putAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import CesOrderCustomerForm from './CesOrderCustomerForm.vue'
  import { GoodsModalMixin } from '../mixins/GoodsModalMixin.js'
  const ruleBaseURL = '/sys/fillRule/executeRuleByCode/'
  export default {
    name: 'CesOrderMainForm',
    mixins: [JEditableTableModelMixin,GoodsModalMixin],
    components: {
      CesOrderCustomerForm,
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        model:{
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
        },
        refKeys: ['cesOrderGoods', 'cesOrderCustomer', ],
        tableKeys:['cesOrderGoods', ],
        activeKey: 'cesOrderGoods',
        // 订单商品
        cesOrderGoodsTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '商品编码',
              key: 'goodCode',
              type: FormTypes.popupGoods,
              kind: 'goods', 
              multi: true,
              width:"200px",
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '${title}不能为空' }]
            },
            {
              title: '商品名字',
              key: 'goodName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '价格',
              key: 'price',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '数量',
              key: 'num',
              type: FormTypes.inputNumber,
              statistics: true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '单品总价',
              key: 'zongPrice',
              type: FormTypes.inputNumber,
              statistics: true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        // 订单客户
        cesOrderCustomerTable: {
          loading: false,
          dataSource: [],
          columns: [
          ]
        },
        url: {
          add: "/demo/test/cesOrderMain/add",
          edit: "/demo/test/cesOrderMain/edit",
          queryById: "/demo/test/cesOrderMain/queryById",
          cesOrderGoods: {
            list: '/demo/test/cesOrderMain/queryCesOrderGoodsByMainId'
          },
          cesOrderCustomer: {
            list: '/demo/test/cesOrderMain/queryCesOrderCustomerByMainId'
          },
          rule: {
            orderCode: ruleBaseURL + 'shop_order_num'
          },
        }
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      /*流程自定义表单数据*/
      customFormData:{
         type:Object,
         default:()=>{return {}},
         required:false
      },
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
      //流程调用自定义表单的传入参数
      if(this.customFormData != null) {
        console.log("this.customFormData=",this.customFormData);
        this.model = this.customFormData;
        this.editAfter();  //现在字表内容需要
      }
    },
    methods: {
      getOrderCode() {
        putAction(this.url.rule.orderCode, this.model).then(res => {
         // 执行成功，获取返回的订单编号值，并赋到页面上
        if (res.success) {
        this.model.orderCode = res.result
        }
       })
      },
      addBefore(){
        //this.cesOrderGoodsTable.dataSource=[]
        this.getOrderCode()
        this.$refs.cesOrderCustomerForm.clearFormData()
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
          this.$refs.cesOrderCustomerForm.initFormData(this.url.cesOrderCustomer.list,this.model.id)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.cesOrderGoods.list, params, this.cesOrderGoodsTable)
        }
      },
      //校验所有一对一子表表单
      validateSubForm(allValues){
          return new Promise((resolve,reject)=>{
            Promise.all([
                this.$refs.cesOrderCustomerForm.validate(1),
            ]).then(() => {
              resolve(allValues)
            }).catch(e => {
              if (e.error === VALIDATE_NO_PASSED) {
                // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
              } else {
                console.error(e)
              }
            })
          })
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          cesOrderGoodsList: allValues.tablesValue[0].values,
          cesOrderCustomerList: this.$refs.cesOrderCustomerForm.getFormData(),
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

    }
  }
</script>

<style scoped>
</style>
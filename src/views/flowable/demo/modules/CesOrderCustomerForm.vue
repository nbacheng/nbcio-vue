<template>
  <j-form-container :disabled="disabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="客户名字" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <j-popup
                v-model="model.name"
                field="name"
                org-fields="realname,sex,birthday"
                dest-fields="name,sex,birthday"
                code="tj_user_report"
                :multi="true"
                @input="popupCallback"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="客户性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
              <j-dict-select-tag type="list" v-model="model.sex" dictCode="sex" placeholder="请选择客户性别"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="客户生日" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="birthday">
              <j-date placeholder="请选择客户生日" v-model="model.birthday" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="age">
              <a-input-number v-model="model.age" placeholder="请输入年龄" style="width: 100%"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="常用地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入常用地址"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
  </j-form-container>
</template>
<script>
  import { getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
 import { VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  export default {
    name: 'CesOrderCustomerForm',
    components: {
    },
    props:{
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
        },
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
        validatorRules: {
        },
        confirmLoading: false,
      }
    },
     created () {
      //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods:{
      initFormData(url,id){
        this.clearFormData()
        if(!id){
          this.edit(this.modelDefault)
        }else{
          getAction(url,{id:id}).then(res=>{
            if(res.success){
              let records = res.result
              if(records && records.length>0){
                this.edit(records[0])
              }
            }
          })
        }
      },
      edit(record){
        this.model = Object.assign({}, record)
        console.log("CesOrderCustomerForm-edit",this.model);
      },
      getFormData(){
        let formdata_arr = []
        this.$refs.form.validate(valid => {
          if (valid) {
            let isNullObj = true
            Object.keys(this.model).forEach(key=>{
              if(this.model[key]){
                isNullObj = false
              }
            })
            if(!isNullObj){
              formdata_arr.push(this.model)
            }
          }else{
            this.$emit("validateError","订单客户表单校验未通过");
          }
        })
        return formdata_arr;
      },
      validate(index){
          return new Promise((resolve, reject) => {
            // 验证主表表单
           this.$refs.form.validate(valid => {
              !valid ? reject({ error: VALIDATE_NO_PASSED ,index}) : resolve()
            })
          }).then(values => {
            return Promise.resolve()
          }).catch(error => {
            return Promise.reject(error)
          })
        },
      popupCallback(value,row){
        this.model = Object.assign(this.model, row);
      },
      clearFormData(){
        this.$refs.form.clearValidate()
      },
    }
  }
</script>

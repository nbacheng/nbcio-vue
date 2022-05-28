<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="username">
              <j-select-user-by-dep v-model="model.username" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="部门编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orgCode">
              <j-select-depart v-model="model.orgCode" multi  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="年" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salaryyear">
              <a-input-number v-model="model.salaryyear" placeholder="请输入年" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="月" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salarymonth">
              <a-input-number v-model="model.salarymonth" placeholder="请输入月" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="本月实发工资" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bysfgz">
              <a-input-number v-model="model.bysfgz" placeholder="请输入本月实发工资" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="本月加班费" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="byjbf">
              <a-input-number v-model="model.byjbf" placeholder="请输入本月加班费" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="本月实发奖金" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bysfjj">
              <a-input-number v-model="model.bysfjj" placeholder="请输入本月实发奖金" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="上月实发工资" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sysfgz">
              <a-input-number v-model="model.sysfgz" placeholder="请输入上月实发工资" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="上月加班费" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="syjbf">
              <a-input-number v-model="model.syjbf" placeholder="请输入上月加班费" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="上月实发奖金" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sysfjj">
              <a-input v-model="model.sysfjj" placeholder="请输入上月实发奖金"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'OaSalaryForm',
    components: {
    },
    props: {
      //表单禁用
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
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/estar/oaSalary/add",
          edit: "/estar/oaSalary/edit",
          queryById: "/estar/oaSalary/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>
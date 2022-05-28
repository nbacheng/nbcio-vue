<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入用户名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
              <j-dict-select-tag type="list" v-model="model.sex" dictCode="sex" placeholder="请选择性别" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="age">
              <a-input-number v-model="model.age" placeholder="请输入年龄" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="descc">
              <j-editor v-model="model.descc" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="birthday">
              <j-date placeholder="请选择生日" v-model="model.birthday"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="用户编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userCode">
              <a-input v-model="model.userCode" placeholder="请输入用户编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="topPic">
              <j-image-upload isMultiple  v-model="model.topPic" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileKk">
              <j-upload v-model="model.fileKk"   ></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="城市" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chegnshi">
             <j-area-linkage type="cascader" v-model="model.chegnshi" placeholder="请输入省市区"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="弹窗" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pop">
              <a-input v-model="model.pop" placeholder="请输入弹窗"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="checkbox" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ceck">
              <j-multi-select-tag type="checkbox" v-model="model.ceck" dictCode="sex" placeholder="请选择checkbox" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="下拉多选" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="xiamuti">
              <j-multi-select-tag type="list_multi" v-model="model.xiamuti" dictCode="sex" placeholder="请选择下拉多选" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="搜索下拉" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="searchSel">
              <j-search-select-tag v-model="model.searchSel" dict="sys_role,role_name,role_code"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="下拉字典表" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="selTable">
              <j-search-select-tag v-model="model.selTable" dict="sys_user,realname,username"  />
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
    name: 'TestDemoForm',
    components: {
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
           name: [
              { required: true, message: '请输入用户名!'},
           ],
        },
        url: {
          add: "/test_demo/testDemo/add",
          edit: "/test_demo/testDemo/edit",
          queryById: "/test_demo/testDemo/queryById"
        }
      }
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
      }
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      console.log("this.modelDefault=",this.modelDefault);
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
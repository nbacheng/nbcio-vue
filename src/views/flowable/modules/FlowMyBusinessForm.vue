<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="流程定义key 一个key会有多个版本的id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processDefinitionKey">
              <a-input v-model="model.processDefinitionKey" placeholder="请输入流程定义key 一个key会有多个版本的id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程定义id 一个流程定义唯一" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="processDefinitionId">
              <a-input v-model="model.processDefinitionId" placeholder="请输入流程定义id 一个流程定义唯一"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程业务简要描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title">
              <a-input v-model="model.title" placeholder="请输入流程业务简要描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="业务表id，理论唯一" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataId">
              <a-input v-model="model.dataId" placeholder="请输入业务表id，理论唯一"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="业务类名，用来获取spring容器里的服务对象" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="serviceImplName">
              <a-input v-model="model.serviceImplName" placeholder="请输入业务类名，用来获取spring容器里的服务对象"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="申请人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="proposer">
              <a-input v-model="model.proposer" placeholder="请输入申请人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程状态说明，有：启动  撤回  驳回  审批中  审批通过  审批异常" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="actStatus">
              <a-input v-model="model.actStatus" placeholder="请输入流程状态说明，有：启动  撤回  驳回  审批中  审批通过  审批异常"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="当前的节点定义上的Id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskId">
              <a-input v-model="model.taskId" placeholder="请输入当前的节点定义上的Id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="当前的节点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskName">
              <a-input v-model="model.taskName" placeholder="请输入当前的节点"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="当前的节点实例上的Id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskNameId">
              <a-input v-model="model.taskNameId" placeholder="请输入当前的节点实例上的Id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="前的节点可以处理的用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="todoUsers">
              <a-input v-model="model.todoUsers" placeholder="请输入前的节点可以处理的用户名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="处理过的人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="doneUsers">
              <a-input v-model="model.doneUsers" placeholder="请输入处理过的人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="当前任务节点的优先级 流程定义的时候所填" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="priority">
              <a-input v-model="model.priority" placeholder="请输入当前任务节点的优先级 流程定义的时候所填"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="前端页面显示的路由地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="routeName">
              <a-input v-model="model.routeName" placeholder="请输入前端页面显示的路由地址"  ></a-input>
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
    name: 'FlowMyBusinessForm',
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
          add: "/flowable/flowMyBusiness/add",
          edit: "/flowable/flowMyBusiness/edit",
          queryById: "/flowable/flowMyBusiness/queryById"
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
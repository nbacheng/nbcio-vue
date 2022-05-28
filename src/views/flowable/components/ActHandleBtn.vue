<style lang="less">
</style>
<template>
  <span>
      <a-button :type="btnType" @click="handle()" >{{text}}</a-button>
      <a-modal :title="modalTaskTitle" v-model="modalTaskVisible" :mask-closable="false" :width="500">

      <div  v-if="modalTaskVisible">
        <a-form ref="form" :model="form" :label-width="85" >
          <a-form-item label="处理意见" prop="reason">
            <a-input type="textarea" v-model="form.comment" :rows="4" />
          </a-form-item>
          <div v-show="type==2">
            <a-form-item label="退回节点" prop="targetKey" v-if="returnTaskList.length">
              <a-radio-group v-model="form.targetKey">
                <a-radio-button
                  v-for="item in returnTaskList"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <span v-else>无可退回节点！</span>
          </div>
        </a-form>
      </div>
      <div slot="footer">
        <a-button type="text" @click="modalTaskVisible=false">取消</a-button>
        <a-button type="primary" :loading="submitLoading" @click="handelSubmit">提交</a-button>
      </div>
    </a-modal>
  </span>
</template>

<script>
  import {completeTask, rejectTask, returnList, returnTask} from "@views/flowable/api/todo";

export default {
    name: 'ActHandleBtn',
    components: {},
    props: {
        btnType: { type: String, default: 'link', required: false },
        /* handleType 0通过 1驳回 2退回  */
        type: {
            type: String|Number,
            default: '0',
            required: true
        },
        dataId: {
            type: String,
            default: '',
            required: true
        },
      /*流程变量*/
        variables:{
          type: Object,
          default: ()=>{},
        },
        text: {
            type: String,
            default: '处理',
            required: false
        }
    },
    data() {
        return {
          handleType:{
            // 通过
            pass: 0,
            // 驳回
            back: 1,
            // 退回
            return: 2
            },
            returnTaskList: [],
            modalTaskVisible: false,
            submitLoading: false,
            form: {
              comment:'',
              targetKey:''
            },
            modalTaskTitle: '',

        };
    },
    created() {
    },
    watch: {
    },
    methods: {
        handle() {
            if (this.type === this.handleType.delegate) {
                // this.delegateTask();
            } else if (this.type === this.handleType.pass) {
                this.passTask();
            } else if (this.type === this.handleType.back) {
                this.backTask();
            } else if(this.type === this.handleType.return){
                this.returnTask();
            } else {
                this.$message.warn('未知类型type，参见 handleType');
            }
        },
        passTask() {
            const v = this;
            this.modalTaskTitle = '审批通过';
            this.modalTaskVisible = true;
        },
        backTask() {
          const v = this;
          this.modalTaskTitle = '审批驳回';
          this.modalTaskVisible = true;
        },
        returnTask() {
            const v = this;
            this.modalTaskTitle = '审批退回';
            this.modalTaskVisible = true;
            returnList({dataId:this.dataId}).then(res => {
              this.returnTaskList = res.result||[];
              // console.log(this.returnTaskList)
            })
        },

        handelSubmit() {
            console.log('提交');
            this.submitLoading = true;
            var formData = Object.assign({
              dataId:this.dataId,
              values:Object.assign({dataId:this.dataId},this.variables)
            }, this.form);
            if (!formData.comment){
              this.$message.error('请输入审批意见！');
              this.submitLoading=false
              return;
            }
            if (this.type == this.handleType.pass) {
                // 通过
              completeTask(formData).then(res => {
                    this.submitLoading = false;
                    if (res.success) {
                        this.$message.success('操作成功');
                        this.modalTaskVisible = false;
                        this.$emit('success');
                    } else {
                        this.$message.error('操作失败');
                    }
                }).finally(()=>{this.submitLoading=false});
            } else if (this.type == this.handleType.back) {
                // 驳回
                  rejectTask(formData).then(res => {
                        this.submitLoading = false;
                        if (res.success) {
                            this.$message.success('操作成功');
                            this.modalTaskVisible = false;
                            this.$emit('success');
                        } else {
                            this.$message.error('操作失败');
                        }
                    }).finally(()=>{this.submitLoading=false});

            } else if (this.type == this.handleType.return){
              if (!formData.targetKey){
                this.$message.error('请选择退回节点！');
                this.submitLoading=false
                return;
              }
              //退回
              returnTask(formData).then(res => {
                this.submitLoading = false;
                if (res.success) {
                  this.$message.success('操作成功');
                  this.modalTaskVisible = false;
                  this.$emit('success');
                } else {
                  this.$message.error('操作失败');
                }
              }).finally(()=>{this.submitLoading=false});
            }
        },

    }

};
</script>

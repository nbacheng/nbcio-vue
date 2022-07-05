<style lang="less">
</style>
<template>
  <span>
      <a-button :type="btnType" @click="applySubmit()" >{{text}}</a-button>
  </span>
</template>

<script>
  import {definitionStartByDataId} from "@views/flowable/api/definition";

export default {
    name: 'ActApplyBtn',
    components: {},
    props: {
        btnType: { type: String, default: 'link', required: false },
        /**/
        dataId: {
            type: String,
            default: '',
            required: true
        },
        serviceName: {
            type: String,
            default: '',
            required: true
        },
        variables:{
          type: Object,
          default: {},
        },
        text: {
            type: String,
            default: '提交申请',
            required: false
        }

    },
    data() {
        return {
            modalVisible: false,
            submitLoading: false,
            form: {
            },
        };
    },
    created() {
    },
    watch: {
    },
    methods: {
        applySubmit() {
            if (this.dataId && this.dataId.length < 1) {
                this.error = '必须传入参数dataId';
                this.$message.error(this.error);
                return;
            } 
            if (this.serviceName && this.serviceName.length < 1) {
                this.error = '必须传入参数serviceName';
                this.$message.error(this.error);
                return;
            } 
            else {
                this.error = '';
            }
            this.submitLoading = true;
            var params = Object.assign({
                dataId: this.dataId
            }, this.variables);
          definitionStartByDataId(this.dataId, this.serviceName, params)
                .then(res => {
                    if (res.success) {
                        this.$message.success('操作成功,请在到我的待办里进行流程的提交流转.');
                        this.$emit('success');
                    } else {
                        this.$message.error(res.message);
                    }
                })
                .finally(() => (this.submitLoading = false));
        }
    }

};
</script>

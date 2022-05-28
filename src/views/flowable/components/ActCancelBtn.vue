<style lang="less">
</style>
<template>
  <span>
      <a-button :type="btnType" @click="cancel()" >{{text}}</a-button>
      <a-modal title="确认撤回" v-model="modalCancelVisible" :mask-closable="false" :width="500">
            <a-form ref="delForm" v-model="cancelForm" :label-width="70" v-if="modalCancelVisible">
                <a-form-item label="撤回原因" prop="reason">
                    <a-input type="textarea" v-model="cancelForm.reason" :rows="4" />
                </a-form-item>
            </a-form>
            <div slot="footer">
                <a-button type="text" @click="modalCancelVisible = false">取消</a-button>
                <a-button type="primary" :disabled="submitLoading" @click="handelSubmitCancel">提交</a-button>
            </div>
        </a-modal>
  </span>
</template>

<script>
import {deleteByDataId} from "@views/flowable/api/process";

export default {
    name: 'ActCancelBtn',
    components: {},
    props: {
        btnType: { type: String, default: 'link', required: false },
        /**/
        dataId: {
            type: String,
            default: '',
            required: true
        },
        instanceId: {
            type: String,
            default: '',
            required: false
        },
        text: {
            type: String,
            default: '撤回',
            required: false
        }
    },
    data() {
        return {
            modalCancelVisible: false,
            cancelForm: {
                reason: ''
            },
            submitLoading: false,
        };
    },
    created() {
    },
    watch: {
    },
    methods: {
        cancel() {
            this.modalCancelVisible = true;
        },
        handelSubmitCancel() {
            this.submitLoading = true;
          deleteByDataId(this.instanceId, this.cancelForm.reason,this.dataId)
                .then(res => {
                    if (res.success) {
                        this.$message.success('操作成功');
                        this.modalCancelVisible = false;
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

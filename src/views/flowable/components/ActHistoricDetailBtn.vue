<style lang="less">
</style>
<template>
  <span>
      <a-button :type="btnType"  @click="history()" >{{text}}</a-button>
      <a-modal title="审批历史" v-model="modalLsVisible" :mask-closable="true" :width="'80%'" :footer="null">
          <div v-if="modalLsVisible">
              <HistoricDetail ref="historicDetail" :data-id="dataId"></HistoricDetail>
          </div>
      </a-modal>
  </span>
</template>

<script>
import HistoricDetail from './HistoricDetail';
export default {
    name: 'ActHistoricDetailBtn',
    components: { HistoricDetail },
    props: {
        btnType: { type: String, default: 'link', required: false },
        /**/
        dataId: {
            type: String,
            default: '',
            required: true
        },
        text: {
            type: String,
            default: '审批历史',
            required: false
        }
    },
    data() {
        return {
            modalLsVisible: false
        };
    },
    created() {
    },
    watch: {
    },
    methods: {
        history() {
            if (!this.dataId) {
                this.$message.error('流程实例ID不存在');
                return;
            }
            this.modalLsVisible = true;
        }
    }

};
</script>

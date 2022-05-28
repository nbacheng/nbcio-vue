<template>
  <div>
    <a-input-search v-if="kind === 'goods'" v-model="names" placeholder="请选择" @pressEnter="onPressEnter" @search="onSearch"></a-input-search>
    <j-select-goods-modal v-if="kind === 'goods'" ref="selectModal" :modal-width="modalWidth" :rows="rows" :multi="multi" :good-code="value" @ok="selectOK" @initComp="initComp"/>
  </div>
</template>

<script>
  import JSelectGoodsModal from './modal/JSelectGoodsModal'
  import Vue from 'vue'

  export default {
    name: 'JSelectList',
    components: {JSelectGoodsModal },
    props: {
      modalWidth: {
        type: Number,
        default: 1450,
        required: false
      },
      value: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      rows: {
        type: String,
        required: false
      },
      kind: {
        type: String,
        required: false
      },
      multi: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    data() {
      return {
        ids: "",
        names: "",
      }
    },
    mounted() {
      this.ids = this.value
    },
    watch: {
      value(val) {
        this.ids = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      initComp(name) {
        this.names = name
      },
      onPressEnter() {
        if(this.kind === 'goods') {
          this.$refs.selectModal.showModal()
        }  
      },
      onSearch() {
        if(this.kind === 'goods') {
          //直接进行弹窗
          this.$refs.selectModal.showModal(this.names)
        } else {
          this.$refs.selectModal.showModal()
        }
      },
      selectOK(rows, idstr) {
        console.log("选中商品id", idstr)
        if (!rows) {
          this.ids = ''
        } else {
          this.names = idstr
          this.ids = idstr
        }
        this.$emit("change", this.ids)
      }
    }
  }
</script>

<style scoped>

</style>
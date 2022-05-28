<template>
  <div>
    <a-input-search
      v-model="goodsCodes"
      placeholder="请选择商品"
      readOnly
      @search="onSearchgoods">
    </a-input-search>
    <j-select-goods-modal ref="selectModal" :modal-width="modalWidth" :multi="multi" :good-code="value" @ok="selectOK" @initComp="initComp"/>
  </div>
</template>

<script>
  import JSelectGoodsModal from './modal/JSelectGoodsModal'

  export default {
    name: 'JSelectGoods',
    components: {JSelectGoodsModal},
    props: {
      modalWidth: {
        type: Number,
        default: 1300,
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
      multi: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    data() {
      return {
        goodsIds: "",
        goodsCodes: "",
      }
    },
    mounted() {
      this.goodsIds = this.value
    },
    watch: {
      value(val) {
        this.goodsIds = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      initComp(name) {
        this.goodsCodes = name
      },
      onSearchgoods() {
        this.$refs.selectModal.showModal()
      },
      selectOK(rows, idstr) {
        console.log("选中商品", rows)
        console.log("选中商品id", idstr)
        if (!rows) {
          this.goodsCodes = ''
          this.goodsIds = ''
        } else {
          let temp = ''
          for (let item of rows) {
            temp += ',' + item.name
          }
          this.goodsCodes = temp.substring(1)
          this.goodsIds = idstr
        }
        this.$emit("change", this.goodsIds)
      }
    }
  }
</script>

<style scoped>

</style>
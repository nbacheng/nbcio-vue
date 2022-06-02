<template>
  <div>
    <a-form style="max-width: 512px; margin: 40px auto 0;">
      <a-form-item
        label="部门编号"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
         <j-select-depart v-model="depno" @change="handleChange1" />
      </a-form-item>
      
      <a-form-item
        label="年月"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-month-picker v-decorator="['yearmonth',{rules:[{required: true, message: '请选择年月'}]}]" :format="monthFormat"  @change="handleChange2" />
      </a-form-item>
      
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  /*
  desc:  第一步，根据需要选择部门与年月，同时把选中的数据先临时保存到store里，以便下一步需要
  author: nbacheng
  date:   2022-02-28
  
  */
  import Vue from 'vue'
  import store from '@/store/'
  import moment from 'moment';

  
  export default {
    name: "Step1",
   /* props: {
        processDefinitionName: {
            type: String,
            default: '',
            required: true
        }
    },*/
    data() {
        return {
          monthFormat: 'YYYYMM',
          depno: '',
        };
      },
    /*created() {
        this.processDefinitionName = '';
    },*/  
    methods: {
      handleChange1(value) {
        console.log(value); // { key: "", label: "" }
        Vue.ls.set("depno", value);
      },
      handleChange2(value) {
        console.log(value.format('YYYYMM')); // { key: "", label: "" }
        Vue.ls.set("yearmonth",value.format('YYYYMM'));
      },
      nextStep () {
        
        this.$emit('nextStep');
      },
      moment,
    }
  }
</script>

<style lang="less">
   
</style>
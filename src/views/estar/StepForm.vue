<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="currentTab">
      <a-step title="填写部门与年月" />
      <a-step title="确认提交钉钉审批信息" />
      <a-step title="完成" />
    </a-steps>
    <div class="content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep"/>
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
      <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/>
    </div>
  </a-card>
</template>

<script>
  /*
  desc:  根据部门与年月，获取部门审批数据及子部门薪资汇总数据
  author: nbacheng
  date:   2022-02-28
  
  */
  import Step1 from './stepForm/Step1.vue'
  import Step2 from './stepForm/Step2'
  import Step3 from './stepForm/Step3'

  export default {
    name: "StepForm",
    components: {
      Step1,
      Step2,
      Step3
    },
    data () {
      return {
        description: '根据部门与年月，提交钉钉审批步骤。',
        currentTab: 0,

        // form
        form: null,
      }
    },
    methods: {

      // handler
      nextStep () {
        if (this.currentTab < 2) {
          this.currentTab += 1
        }
      },
      prevStep () {
        if (this.currentTab > 0) {
          this.currentTab -= 1
        }
      },
      finish () {
        this.currentTab = 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
<template>
  <div>
    <form-designer ref="formDesigner" :queryId="routeQueryId" v-model="form.fdForm"></form-designer>
  </div>
</template>

<script>
export default {
  name: 'designerExapmle',
  data() {
    return {
      form: {
        fdForm: ''
      },
      routeQueryId: '',
    }
  },
  created() {
    this.routeQueryId = this.$route.query && this.$route.query.id;
  },
  mounted() {
  },
}
</script>

<style>

</style>

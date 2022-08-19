<template>
  <div>
    <div>
      <p class="text-center">
        <img :src="[imuser.avatar]" class="img" />
      </p>
      <p class="user-model-item">
        <label>姓名：</label>
        <span>{{ imuser.realname }}</span>
      </p>
      <p class="user-model-item">
        <label>手机：</label>
        <span>{{ imuser.phone }}</span>
      </p>
      <p class="user-model-item">
        <label>邮箱：</label>
        <span>{{ imuser.email }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import RequestUtils from "../../../utils/im/RequestUtils";
import conf from "../conf";
export default {
  name: "userModal",
  props: ["userName"],
  data() {
    return {
      title: "",
      host: conf.getHostUrl(),
      imuser: {}
    };
  },
  watch: {
    userName(username) {
      this.getUser(username);
    }
  },
  mounted() {
    this.getUser(this.userName);
  },
  methods: {
    getUser(username) {
      let self = this;
      let param = new FormData();
      param.set("userName", username);

      RequestUtils.request(conf.getHostUrl() + "/im/user/get", param)
        .then(json => {
          console.log("getUser json",json);
          self.imuser = json;
        })
        .catch(err => {
          self.imuser = {};
          console.error(err);
        });
    }
  }
};
</script>

<style scoped></style>

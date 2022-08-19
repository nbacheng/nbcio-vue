<template>
  <div class="user-info">
    <Row>
      <Col span="12">
        <h5 class="username">{{ imuser.username }}</h5>
      </Col>
      <Col span="12" class="text-right">
        <Avatar size="large" :src="imuser.avatar" />
      </Col>
    </Row>
    <Divider />
    <Row>
      <Col span="3" class="label">手机</Col>
      <Col span="2">&nbsp;</Col>
      <Col span="18" class="value">{{ imuser.phone }}</Col>
    </Row>
    <Row>
      <Col span="3" class="label">邮箱</Col>
      <Col span="2">&nbsp;</Col>
      <Col span="18">{{ imuser.email }}</Col>
    </Row>
    <Row>
      <Col span="18">&nbsp;</Col>
      <Col span="6" class="text-right">
        <i-button type="primary" shape="circle" size="large" @click="showChat()"
          >发送消息</i-button
        >
      </Col>
    </Row>
  </div>
</template>

<script>
import conf from "../conf";
import { MessageTargetType } from "../../../utils/im/ChatUtils";
const { ChatListUtils } = require("../../../utils/im/ChatUtils.js");

export default {
  name: "userInfo",
  props: ["imuser"],
  data() {
    return {
      host: conf.getHostUrl()
    };
  },
  methods: {
    // 打开一个聊天对话框
    showChat: function() {
      let self = this;
      console.log("self.imuser=", self.imuser);
      let chat = ChatListUtils.resetChatList(
        self,
        self.imuser,
        conf.getHostUrl(),
        MessageTargetType.FRIEND
      );
      self.$router.push({
        path: "/im/index/chatBox/",
        query: { chat: chat }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.user-info {
  font-size: 16px;
  line-height: 200%;
  color: #666;

  .text-right {
    text-align: right;
  }

  .username {
    font-weight: bold;
    font-size: 20px;
  }

  .label {
    text-align: justify;
    text-align-last: justify;
    font-weight: bold;
  }
}
</style>

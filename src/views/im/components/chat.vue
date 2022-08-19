<template>
  <div class="im-chat" v-if="chat.name">
    <div class="im-chat-top" v-if="chat">
      <span>{{ chat.name }}</span>
      <a href="javascript:;" @click="modal = true" class="pull-right menu">
        <Icon type="md-menu" />
      </a>
    </div>
    <div class="im-chat-main">
      <div class="im-chat-main-left">
        <div class="im-chat-main-box messages" id="message-box">
          <ul>
            <li
              v-for="(item, index) in messageList"
              :key="index"
              :class="{ 'im-chat-mine': item.mine }"
            >
              <div class="im-chat-user">
                <img :src="item.avatar" alt="头像" />
                <div class="message-info right" v-if="item.mine">
                  <i>
                    <Time :time="item.timestamp" />
                  </i>
                  <span>{{ item.username }}</span>
                </div>
                <div class="message-info" v-if="!item.mine">
                  <span>{{ item.username }}</span>
                  <i>
                    <Time :time="item.timestamp" />
                  </i>
                </div>
              </div>
              <div class="im-chat-text">
                <pre
                  v-html="item.content"
                  v-on:click="openImageProxy($event)"
                ></pre>
              </div>
            </li>
          </ul>
        </div>
        <div class="im-chat-footer">
          <div class="im-chat-tool">
            <Icon type="ios-happy-outline" @click="showFaceBox()"></Icon>
            <upload-tool @uploadBack="uploadBack"></upload-tool>
            <Faces
              v-show="showFace"
              @click="showFace = true"
              class="faces-box"
              @insertFace="insertFace"
            ></Faces>
            <Button class="history-message-btn" @click="history"
              >聊天记录</Button
            >
          </div>
          <textarea
            v-model="messageContent"
            class="textarea"
            @keyup.enter="mineSend()"
          ></textarea>
          <div class="im-chat-send">
            <Button @click="mineSend()">发送</Button>
          </div>
        </div>
      </div>
      <div v-if="isGroup" class="im-chat-users">
        <ul class="chat-user-list">
          <li
            v-for="(item, index) in userList"
            :key="index"
            @click="showUser(item)"
          >
            <span class="im-chat-avatar">
              <img :src="[item.avatar]" alt="" />
            </span>
            {{ item.realname }}
          </li>
        </ul>
      </div>
    </div>
    <Modal
      closable
      class="user-model"
      v-model="modal"
      footer-hide
      title="信息"
      width="300"
    >
      <div v-if="!isGroup">
        <UserModal :userName="chat.id"></UserModal>
      </div>
      <div v-if="isGroup">
        <p class="user-model-img">
          <img :src="chat.avatar" class="img" />
        </p>
        <p class="user-model-item">
          <label>群名称：</label>
          <span>{{ chat.name }}</span>
        </p>
      </div>
    </Modal>
    <Modal
      closable
      class="user-model"
      v-model="groupUserModel"
      footer-hide
      title="信息"
      width="300"
    >
      <UserModal :userName="groupUser.username" :show-send="false"></UserModal>
      <div class="model-footer">
        <Button @click="showChat(groupUser)">发送消息</Button>
      </div>
    </Modal>

    <Drawer
      title="聊天记录"
      :closable="true"
      v-model="showHistory"
      class="history-message"
      width="60%"
    >
      <history-message
        :showHistory="showHistory"
        :chat="chat"
      ></history-message>
    </Drawer>
  </div>
</template>

<script>
import conf from "../conf";
import Faces from "./faces.vue";
import UserModal from "./userModal.vue";
import UploadTool from "./uploadTool.vue";
import HistoryMessage from "./historyMessage.vue";
import RequestUtils from "../../../utils/im/RequestUtils";
import {
  isGroupChat,
  MessageTargetType,
  imageLoad,
  ChatListUtils, transform
} from "../../../utils/im/ChatUtils";
import winControl from "@/mode/webControl";

export default {
  components: {
    Faces,
    UserModal,
    HistoryMessage,
    UploadTool
  },
  name: "userChat",
  computed: {
    messageList: {
      get: function() {
        return this.$store.state.im.messageList;
      },
      set: function(messageList) {
        this.$store.commit("setMessageList", messageList);
      }
    }
  },
  data() {
    return {
      host: conf.getHostUrl(),
      count: 0,
      pageSize: 20,
      modal: false,
      groupUserModel: false,
      groupUser: {},
      // 保存各个聊天记录的map
      messageListMap: new Map(),
      messageContent: "",
      showFace: false,
      showHistory: false,
      userList: [],
      isGroup: false
    };
  },
  props: ["chat"],
  methods: {
    history() {
      this.showHistory = !this.showHistory;
    },
    uploadBack(url) {
      this.messageContent += url;
    },
    // 附件和图片点击展开
    openImageProxy: function(event) {
      let self = this;
      event.preventDefault();
      if (event.target.nodeName === "IMG") {
        winControl.openURL(event.target.src);
      } else if (
        event.target.className === "message-file" ||
        event.target.nodeName === "A"
      ) {
        winControl.openURL(event.target.href);
      }
    },
    showChat(user) {
      let self = this;
      if (user.username !== self.$store.state.im.imuser.username) {
        let chat = ChatListUtils.resetChatList(
          self,
          user,
          conf.getHostUrl(),
          MessageTargetType.FRIEND
        );
        console.log("show Chat=",chat);
        self.isGroup = isGroupChat(chat);
        self.$store.commit("setCurrentChat", JSON.parse(JSON.stringify(chat)));
      } else {
        self.$Message.warning("不能给自己说话哦");
      }
      self.groupUserModel = false;
    },
    showUser: function(user) {
      let self = this;
      self.groupUserModel = true;
      self.groupUser = user;
      console.log("showUser user=",user);
    },
    showFaceBox: function() {
      this.showFace = !this.showFace;
    },
    insertFace: function(item) {
      this.messageContent = this.messageContent + "face" + item;
      this.showFace = false;
    },
    // 本人发送信息
    mineSend() {
      let self = this;
      let currentUser = self.$store.state.im.imuser;
      console.log("mineSend currentUser",currentUser);
      let time = new Date().getTime();
      let content = self.messageContent;
      let currentMessage = null;
      if (content !== "" && content !== "\n") {
        if (content.length > 2000) {
          self.openMessage("不能超过2000个字符");
        } else {
          if(self.chat.type === "1") {
            currentMessage = {
            mine: true,
            avatar: currentUser.avatar,
            username: currentUser.username,
            timestamp: time,
            content: self.messageContent,
            fromname: currentUser.username,
            id: self.chat.id,
            type: self.chat.type
            };
          }
          else {
            currentMessage = {
              mine: true,
              avatar: currentUser.avatar,
              username: self.chat.id,
              timestamp: time,
              content: self.messageContent,
              fromname: currentUser.username,
              id: self.chat.id,
              type: self.chat.type
            };
          }
          self.send(currentMessage);
        }
      }
    },
    // 发送消息的基础方法
    send(message) {
      let self = this;
      self.$store.commit("sendMessage", message);
      message.timestamp = self.formatDateTime(new Date(message.timestamp));
      self.$store.commit("addMessage", message);
      self.messageContent = "";
      // 每次滚动到最底部
      self.$nextTick(() => {
        imageLoad("message-box");
      });
    },

    initGroupChat() {
      let self = this;
      //群组聊天
      if (isGroupChat(self.chat)) {
        let param = new FormData();
        param.set("chatId", self.chat.id);
        RequestUtils.request(conf.getChatUsersUrl(), param).then(json => {
          self.userList = json;
          console.log("initGroupChat userList json=",json);
        });
      }
      self.isGroup = isGroupChat(self.chat);
    },
    getHistoryMessage(pageNo) {
      let self = this;
      if (!pageNo) {
        pageNo = 1;
      }
      let param = new FormData();
      param.set("chatId", self.chat.id);
      param.set("chatType", self.chat.type);
      param.set("fromName", self.$store.state.im.imuser.username);
      param.set("pageNo", pageNo);

      RequestUtils
          .request(conf.getHisUrl(), param)
          .then(json => {
            let list = json.messageList.map(function(element) {
              element.content = transform(element.content);
              element.timestamp = self.formatDateTime(
                  new Date(element.timestamp)
              );
              if(element.avatar.indexOf("http")===-1){
                element.avatar = self.host + element.avatar;
              }
              return element;
            });
            self.messageList = list.reverse();
            // 每次滚动到最底部
            self.$nextTick(() => {
              imageLoad("message-box");
            });
          });
    }
  },
  watch: {
    // 监听每次 chat 的变化
    chat: function() {
      let self = this;
      console.log("self.$store.state.im=",self.$store.state.im);
      self.messageList = [];
      // 从内存中取聊天信息
      let cacheMessages = self.$store.state.im.messageListMap[self.chat.id];
      if (cacheMessages) {
        self.messageList = cacheMessages;
      }else {
        self.getHistoryMessage(1);
      }
      // 每次滚动到最底部
      this.$nextTick(() => {
        imageLoad("message-box");
      });
      self.initGroupChat();
    }
  },
  mounted: function() {
    let self = this;

    self.initGroupChat();
    // 每次滚动到最底部
    this.$nextTick(() => {
      imageLoad("message-box");
    });
  }
};
</script>

<style lang="scss">
@import "@/assets/im/styles/theme";

.im-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 4rem;
  overflow: hidden;
}

.im-chat-top {
  border-bottom: 1px solid #cccccc;
  color: $color-default;
  padding: 0 0 0.2rem 1rem;
  font-size: 1.6rem;
  font-weight: bold;
  height: 40px;

  .menu {
    color: $color-default;
    display: inline-block;
    padding: 0 10px;
  }
}

.user-model {
  .user-model-img {
    padding: 15px;
    text-align: center;

    img {
      border-radius: 50%;
    }
  }

  .user-model-item {
    display: flex;
    padding: 5px 0;

    label {
      flex: 2;
      font-weight: bold;
      text-align: right;
    }

    span {
      flex: 3;
    }
  }
}

.im-chat-main {
  flex: 1;
  display: flex;
  flex-direction: row;
  height: calc(100% - 40px);

  .im-chat-main-left {
    flex: 4;
    display: flex;
    flex-direction: column;

    .im-chat-main-box {
      flex: 1;
      padding-top: 1rem;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .message-img {
    max-width: 20rem;
  }

  .im-chat-users {
    width: 180px;
    border-left: 1px solid #cccccc;
    overflow-y: scroll;

    ::-webkit-scrollbar {
      width: 0;
    }

    .chat-user-list {
      list-style: none;
      margin: 0;

      & > li {
        margin-bottom: 1rem;
        cursor: pointer;
        padding: 5px 2px;
        position: relative;

        &:hover {
          background-color: #eeeeee;

          &:after {
            content: "...";
            position: absolute;
            right: 10px;
            font-weight: bold;
          }
        }

        & > .im-chat-avatar {
          width: 3.2rem;
          height: 3.2rem;
          display: inline-block;
          vertical-align: middle;

          & > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .messages {
    width: 100%;
    height: calc(100% - 3rem);
    overflow-y: scroll;

    ul {
      width: 100%;

      li {
        position: relative;
        font-size: 0;
        margin-bottom: 10px;
        padding-left: 60px;
        min-height: 68px;

        .im-chat-text {
          position: relative;
          line-height: 22px;
          margin-top: 25px;
          padding: 1rem;
          background-color: #e2e2e2;
          border-radius: 3px;
          color: #333;
          word-break: break-all;
          display: inline-block;
          vertical-align: top;
          font-size: 14px;

          &:after {
            content: "";
            position: absolute;
            left: -10px;
            top: 13px;
            width: 0;
            height: 0;
            border-style: solid dashed dashed;
            border-color: #e2e2e2 transparent transparent;
            overflow: hidden;
            border-width: 10px;
          }

          pre {
            width: 100%;
            white-space: pre-wrap;
            word-break: break-all;

            img {
              display: block;
            }
          }
        }
      }
    }

    .im-chat-user {
      width: 4rem;
      height: 4rem;
      position: absolute;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      left: 3px;
      right: auto;

      .message-info {
        position: absolute;
        left: 60px;
        top: -2px;
        width: 500px;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        color: #999;
        text-align: left;
        font-style: normal;

        i {
          font-style: normal;
          padding-left: 15px;
        }
      }

      .right {
        right: 0;
        text-align: right;
        left: auto;

        i {
          padding-right: 15px;
        }
      }

      img {
        width: 4rem;
        height: 4rem;
        border-radius: 100%;
      }
    }

    .im-chat-mine {
      text-align: right;
      padding-left: 0;
      padding-right: 60px;

      .im-chat-text {
        margin-left: 0;
        text-align: left;
        background-color: $color-message-bg;
        color: #fff;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:after {
          left: auto;
          right: -10px;
          border-top-color: $color-message-bg;
        }
      }

      .im-chat-user {
        left: auto;
        right: 3px;

        cite {
          left: auto;
          right: 60px;
          text-align: right;

          i {
            padding-left: 0;
            padding-right: 15px;
          }
        }

        .message-info {
          right: 60px !important;
        }
      }
    }
  }
}

.im-chat-footer {
  border-top: 1px solid $color-gray;
  height: 15rem;
  display: flex;
  flex-direction: column;

  .im-chat-tool {
    padding: 0.5rem 1rem;
    height: 3.4rem;
    position: relative;

    i {
      font-size: 2.4rem;
      cursor: pointer;
      margin-left: 1rem;
    }

    .faces-box {
      position: absolute;
      bottom: 3.8rem;
    }

    .ivu-upload {
      display: inline-block;
    }

    .history-message-btn {
      float: right;
    }
  }

  textarea {
    border: 0;
    padding: 0.5rem;
    width: 100%;
    flex: 1;
    resize: none;
    background-color: $color-box-bg !important;

    &:focus {
      border: 0;
    }
  }

  .im-chat-send {
    height: 4rem;
    text-align: right;
    padding: 0 1rem 1rem 0;
  }
}

.ivu-scroll-wrapper {
  margin: 0 !important;
}

.ivu-scroll-container {
  padding: 15px 15px 5px;
  overflow-y: visible !important;
}

/* 重新覆盖iview 里面的 model 小于768px 时候 宽度变100% 的问题 */
@media (max-width: 768px) {
  .user-model {
    .ivu-modal {
      width: 30rem !important;
      margin: 0 auto;
    }
  }
}

.history-message {
  width: 80%;
  height: calc(100% - 30px);
}

.page {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0.5rem;
}

.ivu-drawer-body {
  padding: 0 !important;

  .messages {
    height: calc(100% - 3rem);
  }
}

.model-footer {
  text-align: right;
  margin: 10px;
}
</style>

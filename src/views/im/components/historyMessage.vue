<template>
  <div style="height: calc(100% - 40px);">
    <div class="im-chat-main" style="height: 100%">
      <div class="messages" id="his-chat-message"  style="height: 100%">
        <ul>
          <li
            v-for="(item, index) in hisMessageList"
            :key="index"
            :class="{ 'im-chat-mine': item.mine }"
          >
            <div class="im-chat-user" id="historyMessageBox">
              <img :src="[item.avatar]" />
              <div class="message-info right" v-if="item.mine">
                <i>{{ item.timestamp }}</i>
                <span>{{ item.username }}</span>
              </div>
              <div class="message-info" v-if="!item.mine">
                <span>{{ item.username }}</span>
                <i>{{ item.timestamp }}</i>
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
    </div>
    <Page
      :total="count"
      size="small"
      show-total
      class="page"
      :page-size="pageSize"
      @on-change="getHistoryMessage"
    />
  </div>
</template>

<script>
import RequestUtils from "@/utils/im/RequestUtils";
import conf from "@/views/im/conf";
import { transform, imageLoad} from "../../../utils/im/ChatUtils";
import winControl from "@/mode/webControl";

export default {
  name: "history-message",
  props: {
    showHistory: {
      type: Boolean,
      default: false
    },
    chat: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      host: conf.getHostUrl(),
      count: 0,
      pageSize: 20,
      hisMessageList: []
    };
  },
  watch: {
    showHistory: function(show) {
      console.log("show", show);
      this.showHistory = show;
      if (show) {
        this.getHistoryMessage(1);
      }
    }
  },
  mounted() {},
  methods: {
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
          console.log(json)
          let list = json.messageList.map(function(element) {
            element.content = transform(element.content);
            element.timestamp = self.formatDateTime(
              new Date(element.timestamp)
            );
            return element;
          });
          self.hisMessageList = list.reverse();
          self.count = json.count;
          self.pageSize = json.pageSize;
          // 每次滚动到最底部
          self.$nextTick(() => {
            imageLoad("his-chat-message");
          });
        });
    }
  }
};
</script>

<style scoped lang="scss"></style>

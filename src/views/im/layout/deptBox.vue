<template>
  <div class="panel-box">
    <div class="panel-box-list">
      <div class="dept-box">
        <Tree
          :data="treeData"
          @on-select-change="change"
          class="demo-tree-render"
        ></Tree>
      </div>
    </div>
    <div class="chat-box">
      <Top></Top>
      <div class="dept-user-box">
        <ul class="dept-user-list">
          <li
            v-for="(user, index) in userList"
            :key="index"
            @click="showUser(user)"
          >
            <img :src="[user.avatar]" />
            <div>{{ user.realname }}</div>
          </li>
        </ul>
      </div>
    </div>

    <Modal
      closable
      class="user-model"
      v-model="model"
      footer-hide
      title="信息"
      width="300"
    >
      <div>
        <UserModal :userName="user.username" :show-send="true"></UserModal>
      </div>
      <div class="model-footer">
        <Button @click="showChat(user)">发送消息</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Top from "../components/top.vue";
import conf from "../conf";
import RequestUtils from "../../../utils/im/RequestUtils";
import Tools from "../../../utils/im/Tools";
import UserModal from "../components/userModal.vue";
import { ChatListUtils, MessageTargetType } from "@/utils/im/ChatUtils";
export default {
  components: {
    Top,
    UserModal
  },

  data() {
    return {
      user: {},
      model: false,
      host: conf.getHostUrl(),
      treeData: [],
      userList: []
    };
  },

  methods: {
    showUser(user) {
      this.user = user;
      this.model = true;
    },
    showChat(user) {
      let self = this;
      self.model = false;
      self.$router.push({
        path: "/im/index/chatBox/",
        query: {
          chat: ChatListUtils.resetChatList(
            self,
            user,
            conf.getHostUrl(),
            MessageTargetType.FRIEND
          )
        }
      });
    },
    change(data) {
      let self = this;
      if (data[0]) {
        let param = new FormData();
        param.set("deptId", data[0].id);
        RequestUtils.request(conf.getHostUrl() + "/im/dept/users", param)
          .then(json => {
            self.userList = json;
            console.log("userList = ",self.userList,json);
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  },

  mounted() {
    let self = this;
    let param = new FormData();
    param.set("parentId", "0");

    const render = (h, { data }) => {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "md-home"
              },
              style: {
                marginRight: "8px",
                fontSize: "18px"
              }
            }),
            h("span", data.title)
          ])
        ]
      );
    };

    RequestUtils.request(conf.getHostUrl() + "/im/dept/mylist", param)
      .then(json => {
        console.log("dep mylist=",json);
        self.treeData = json;
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/im/styles/theme";

.ivu-tabs-content {
  height: 100%;
}

.panel-box {
  width: 26rem;
  background-color: $color-light-gray;
  height: 100%;
  display: flex;
  flex-direction: row;

  .chat-box {
    flex: 1;
    background-color: $color-box-bg;
    display: flex;
    flex-direction: column;
    position: relative;

    .dept-user-box {
      height: 100%;
      overflow-y: scroll;
      margin-top: 4rem;
      .dept-user-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: left;

        > li {
          width: 120px;
          list-style: none;
          display: block;
          padding: 10px;
          margin: 10px;
          border: 1px solid #eeeeee;
          text-align: center;
          cursor: pointer;

          &:hover {
            border: 1px solid #ddd;
          }
        }
      }
    }
  }

  .panel-box-list {
    height: 100%;
    width: 22rem;
    display: flex;
    flex-direction: column;
    padding-top: 1rem;

    .dept-box {
      overflow-y: scroll;
      flex: 1;
      padding: 20px 10px;

      .ivu-tree-title {
        overflow: hidden;
        text-overflow: ellipsis;
        overflow-wrap: break-word;
        white-space: nowrap;
        width: 100%;
      }
    }
  }
}
</style>

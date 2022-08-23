<template>
  <div class="v-im">
    <div class="left-bar" style="-webkit-app-region: drag">
      <ul>
        <li class="userPhoto" @click="modal = true">
          <img :src="imuser.avatar" />
        </li>
        <li title="会话">
          <router-link v-bind:to="'/im/index/chatBox'">
            <Icon type="ios-text-outline" />
          </router-link>
        </li>
        <li title="好友">
          <router-link v-bind:to="'/im/index/userBox'">
            <Icon type="ios-contact-outline" />
          </router-link>
        </li>
        <li title="组织">
          <router-link v-bind:to="'/im/index/dept'">
            <Icon type="ios-list-box-outline" />
          </router-link>
        </li>
        <li title="群">
          <router-link v-bind:to="'/im/index/chatGroupBox'">
            <Icon type="ios-contacts-outline" />
          </router-link>
        </li>
      </ul>
    </div>
    <keep-alive>
      <router-view class="content" />
    </keep-alive>
    <Modal
      closable
      class="user-model"
      v-model="modal"
      footer-hide
      :title="imuser.username"
      width="300"
    >
      <p class="user-model-img">
        <img :src="imuser.avatar" class="img" />
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
      
    </Modal>
  </div>
</template>
<script>
import { logout } from "../../utils/im/ChatUtils";
import RequestUtils from "@/utils/im/RequestUtils";
import StoreUtils from "@/utils/im/StoreUtils";
import { ErrorType } from "@/utils/im/ChatUtils";
import conf from "./conf";
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { USER_INFO } from "@/store/mutation-types"

export default {
  data() {
    return {
      imuser: {},
      modal: false
    };
  },
  methods: {
  },
  created: function() {
    let self = this;
    let requestApi = RequestUtils;
    
    //把窗口设置成合适的大小
    document.getElementById("app").style.cssText =
      "width:1000px;height:600px;margin:30px auto"; 
    
    const token = Vue.ls.get(ACCESS_TOKEN);
    StoreUtils.setToken(token); //设置token
    
    localStorage.setItem("host", window._CONFIG['hostAddress'] ); //设置主机地址
    console.log("localStorage host=",localStorage.getItem("host"));
    
    requestApi.request(conf.getInitUrl(), new FormData()).then(json => {
          console.log("json=",json);
          //个人信息
          self.$store.commit("setImUser", json.me);
          //好友
          self.$store.commit("setUserFriendList", json.friends);
          //群
          self.$store.commit("setChatGroupList", json.groups);    
          //把群组封装到map中
          let chatMap = new Map();
          json.groups.forEach(group => {
            chatMap.set(group.id, group);
          });
          self.$store.commit("setChatMap", chatMap);
          
          self.imuser = self.$store.state.im.imuser;
          
          console.log("self.$store.state=",self.$store.state);
          
          console.log("self.imuser=",self.imuser);
          
          RequestUtils.webSocketOperation(self);
          
          // 跳转到index 页面
          self.$router.push({
            path: "/im/index/chatBox",
            params: {}
          });
        })
        .catch(function(error) {
          console.error(error);
          self.showErr = true;
          if (ErrorType.NET_ERROR === error.toString()) {
            self.err = "服务通讯失败，请检查服务设置";
          } else {
            self.err = error.toString();
          }
        }); 
  }, 
  mounted: function() {
  }
};
</script>
<style lang="scss">
@import "@/assets/im/styles/theme.scss";
@import "@/assets/im/styles/v-im.scss";

.v-im {
  display: flex;
  flex-direction: row;

  .left-bar {
    background-color: #1c2438;
    width: 6rem;
    height: 100%;

    ul {
      padding: 3rem 1.2rem 1.2rem 1.2rem;
      list-style: none;
      height: 100%;
      position: relative;

      li {
        -webkit-app-region: no-drag;
        display: block;
        width: 3.6rem;
        height: 3.6rem;
        text-align: center;
        margin-bottom: 2rem;
        cursor: pointer;

        .ivu-icon {
          font-size: 3rem !important;
          color: $color-default;
          margin: 0.3rem;
          cursor: pointer;

          &:hover {
            color: $color-write;
          }
        }

        .router-link-active {
          .ivu-icon {
            color: $color-write;
          }
        }
      }

      .logout {
        bottom: 0;
        position: absolute;
      }

      .userPhoto {
        margin-bottom: 2rem;

        img {
          width: 3.6rem;
          height: 3.6rem;
        }
      }
    }
  }

  .content {
    flex: 1;
  }
}
</style>

<template>
  <div>
    <Input
      search
      v-model="search"
      placeholder="搜索"
      size="small"
      class="search"
      @on-focus="showSearch()"
    />
    <div class="search-div" v-show="showSearchDiv">
      <div class="search-item">
        <Input
          search
          v-model="search"
          placeholder="搜索"
          size="small"
          class="search"
          @on-search="searchUser"
          @on-keyup="searchUser"
        />
        <Icon
          type="ios-close"
          class="text-right"
          @click="closeSearchDiv()"
        ></Icon>
      </div>
      <div class="group-box">
        <ul class="user-list" v-if="searchUserList">
          <li class="user" v-for="(user, index) in searchUserList" :key="index">
            <a href="javascript:" @click="showChat(user)">
              <img :src="user.avatar" alt="头像" />
              <b>{{ user.realname }}</b>
              <p>{{ user.salt }}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import conf from "../conf";
import { pinyin } from "../../../utils/im/Pinyin.js";

export default {
  components: {},
  data() {
    return {
      search: "",
      userList: [],
      searchUserList: [],
      showSearchDiv: false,
      host: conf.getHostUrl()
    };
  },
  methods: {
    showSearch: function() {
      this.search = "";
      this.showSearchDiv = true;
    },
    searchUser: function() {
      this.searchUserList = [];
      for (let i = 0; i < this.userList.length; i++) {
        let name = this.userList[i].name;
        let searchTemp = this.search.trim().toUpperCase();
        if (searchTemp !== "") {
          // 支持拼音查询
          if (
            name.indexOf(searchTemp) !== -1 ||
            pinyin
              .getFullChars(name)
              .toUpperCase()
              .indexOf(searchTemp) !== -1 ||
            pinyin.getCamelChars(name).indexOf(searchTemp) !== -1
          ) {
            if (this.userList[i].avatar.indexOf("http") !== 0) {
              this.userList[i].avatar =
                conf.getHostUrl() + this.userList[i].avatar;
            }
            this.userList[i].type = "0";
            this.searchUserList.push(this.userList[i]);
          }
        }
      }
    },
    closeSearchDiv: function() {
      this.showSearchDiv = false;
    },
    showChat: function(user) {
      this.showSearchDiv = false;
      this.$emit("showChat", user);
    }
  },
  created: function() {
    let self = this;
    let users = self.$store.state.im.userFriendList;
    if (users) {
      for (let user of users) {
        self.userList.push(user);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/im/styles/theme";

.search {
  margin: 0 0 1rem;

  input {
    border-radius: 0;
    border: 0;
  }
}

.search-div {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 6rem;
  height: 100%;
  width: 22rem;
  background-color: $color-light-gray;
  z-index: 999999999999999999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  .search-item {
    padding: 1rem;

    i {
      color: $color-default;
      font-size: 1.4rem;
      font-weight: bolder;
      float: right;
      padding: 0.5rem;

      &:hover {
        background-color: $color-gray;
      }
    }

    .search {
      width: 17.6rem;
    }
  }

  .group-box {
    flex: 1;
    overflow-y: scroll;

    .count {
      color: #aaaaaa;
    }

    li {
      list-style: none;
      position: relative;
      font-size: 1.2rem;
      cursor: pointer;
      font-weight: 200;
      margin-bottom: 2rem;

      h5 {
        padding: 0.5rem 0;
        cursor: pointer;
        font-size: 1.3rem;
        font-weight: 200;

        i {
          vertical-align: baseline;
        }
      }

      img {
        width: 4.4rem;
        height: 4.4rem;
        position: absolute;
        top: 0.4rem;
        left: 2rem;
      }

      b {
        position: absolute;
        font-size: 1.3rem;
        left: 7.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
        top: 0.6rem;
      }

      p {
        position: absolute;
        left: 7.5rem;
        bottom: 0.4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 75%;
        font-size: 1.1rem;
        color: #aaaaaa;
      }
    }

    .user {
      height: 5.2rem;
      position: relative;

      a {
        display: block;
        width: 100%;
        height: 100%;
        color: $color-default;
        position: relative;

        i {
          display: inline-block;
          width: 1.8rem;
          height: 1.6rem;
          background-color: #ff0000;
          border-radius: 50%;
          color: $color-write;
          text-align: center;
          font-style: normal;
          position: absolute;
          left: 1rem;
          top: 0;
          z-index: 99999999999;
        }
      }

      &:hover {
        background-color: $color-gray !important;

        & > i {
          color: $color-default;
          background-color: $color-write;
        }
      }

      .active {
        background-color: $color-gray !important;
      }

      & > i {
        position: absolute;
        right: 1rem;
        bottom: 1.6rem;
        cursor: pointer;
        border-radius: 50%;
        padding: 0.2rem;
        text-align: center;
        color: $color-light-gray;

        &:hover {
          color: $color-default;
          background-color: $color-write;
        }
      }
    }
  }
}
</style>

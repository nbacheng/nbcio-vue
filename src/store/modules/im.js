import Vue from "vue";
import createPersistedState from "vuex-persistedstate";

import {
  Chat,
  ChatListUtils,
  MessageInfoType,
  MessageTargetType,
  transform
} from "@/utils/im/ChatUtils";

const im = {
  state: {
    token: {},
    // 当前的用户
    imuser: {},
    websocket: {},
    //内存中的聊天记录
    messageListMap: new Map(),
    //聊天群的映射 id->chat
    chatMap: new Map(),
    messageList: [],
    // 当前聊天窗口
    currentChat: {},
    // 所有的聊天窗口
    chatList: [],
    //好友列表
    userFriendList: [],
    //刷新token 定时器
    flushTokenTimerId: null,
    //群组列表
    chatGroupList: []
  },
  mutations: {
    setFlushTokenTimerId: function(state, flushTokenTimerId) {
      state.flushTokenTimerId = flushTokenTimerId;
    },
    clearFlushTokenTimerId: function(state) {
      clearTimeout(state.flushTokenTimerId);
    },
    setImUser: function(state, imuser) {
      state.imuser = imuser;
      console.log("setImUser state.imuser",state.imuser);
    },
    setUserFriendList: function(state, userFriendList) {
      state.userFriendList = userFriendList;
    },
    setChatGroupList: function(state, chatGroupList) {
      state.chatGroupList = chatGroupList;
    },
    setChatMap: function(state, chatMap) {
      state.chatMap = chatMap;
    },
    setWebsocket: function(state, websocket) {
      state.websocket = websocket;
    },
    // 发送给服务器
    sendMessage: function(state, message) {
      let msg = {
        code: MessageInfoType.MSG_MESSAGE,
        message: message
      };
      state.websocket.send(JSON.stringify(msg));
    },
    resetUnRead: function(state) {
      if (typeof state.currentChat == "string") {
        state.currentChat = {};
      }
      state.currentChat["unReadCount"] = 0;
    },
    // 退出登录
    closeConnect: function(state) {
      state.websocket.heartReset();
      state.websocket.close();
    },
    // 退出后清除内存中的聊天信息
    clear: function(state) {
      state.messageList = [];
      state.messageListMap = new Map();
    },
    // 保存到内存
    addMessage: function(state, message) {
      message.content = transform(message.content);
      state.messageList.push(message);
      state.messageListMap[message.id] = state.messageList;
    },
    // 在用户姓名下展示收到的最后一条信息
    setLastMessage: function(state, message) {
      let list = ChatListUtils.getChatList(state.imuser.username);
      let tempChatList = list.map(function(chat) {
        if (
          String(chat.id) === String(message.fromname) &&
          message.type === "0"
        ) {
          chat.sign = message.content;
        } else if (
          String(chat.id) === String(message.id) &&
          message.type === "1"
        ) {
          chat.sign = message.content;
        }
        return chat;
      });
      // 放入缓存
      ChatListUtils.setChatList(state.imuser.username, tempChatList);
      state.chatList = tempChatList;
    },
    setMessageList: function(state, messageList) {
      state.messageList = messageList;
    },
    setMessageListMap: function(state, messageListMap) {
      state.messageListMap = messageListMap;
    },
    addUnreadMessage: function(state, message) {
      message.content = transform(message.content);
      if (message.type === MessageTargetType.FRIEND) {
        // 从内存中取聊天信息
        let cacheMessages = state.messageListMap[message.fromname];
        if (cacheMessages) {
          cacheMessages.push(message);
        } else {
          cacheMessages = [];
          cacheMessages.push(message);
          state.messageListMap[message.fromname] = cacheMessages;
        }
      } else {
        // 从内存中取聊天信息
        let cacheMessages = state.messageListMap[message.id];
        if (cacheMessages) {
          cacheMessages.push(message);
        } else {
          cacheMessages = [];
          cacheMessages.push(message);
          state.messageListMap[message.id] = cacheMessages;
        }
      }
    },
    setCurrentChat: function(state, currentChat) {
      if (typeof currentChat != "string") {
        state.currentChat = currentChat;
        state.currentChat["unReadCount"] = 0;
        let tempChatList = state.chatList.map(function(chat) {
          if (String(chat.id) === String(currentChat.id)) {
            chat["unReadCount"] = 0;
          }
          return chat;
        });
        // 放入缓存
        ChatListUtils.setChatList(state.imuser.username, tempChatList);
      }
    },
    setChatList: function(state, chatList) {
      state.chatList = chatList;
    },
    delChat: function(state, chat) {
      state.chatList = ChatListUtils.delChat(state.imuser.username, chat);
    },
    /**
     * 设置未读消息条数
     * @param state state
     * @param message 消息
     */
    setUnReadCount: function(state, message) {
      let tempChatList = [];
      let tempChat = {};

      for (let chat of state.chatList) {
        // 给接受消息的聊天室未读数量 +1
        if (
          String(chat.id) === String(message.fromname) &&
          message.type === MessageTargetType.FRIEND
        ) {
          if (!chat["unReadCount"]) {
            chat["unReadCount"] = 0;
          }
          chat["unReadCount"] = chat["unReadCount"] + 1;
          tempChat = chat;
        }
        //群组聊天
        else if (
          String(chat.id) === String(message.id) &&
          message.type === MessageTargetType.CHAT_GROUP
        ) {
          if (!chat["unReadCount"]) {
            chat["unReadCount"] = 0;
          }
          chat["unReadCount"] = chat["unReadCount"] + 1;
          chat.avatar = state.chatMap[message.id].avatar;
          tempChat = chat;
        } else {
          tempChatList.push(chat);
        }
      }
      // 聊天列表没有此人的chat
      if (!tempChat.id && message.type === MessageTargetType.FRIEND) {
        tempChat = new Chat(
          message.fromname,
          message.username,
          message.avatar,
          1,
          message.content,
          //这里有问题
          "?",
          "?",
          MessageTargetType.FRIEND
        );
      } else if (
        !tempChat.id &&
        message.type === MessageTargetType.CHAT_GROUP
      ) {
        let groupChat = state.chatMap[message.id];
        tempChat = new Chat(
          message.id,
          groupChat.name,
           groupChat.avatar,
          1,
          message.content,
          //这里有问题
          state.imuser.phone,
          state.imuser.email,
          MessageTargetType.CHAT_GROUP
        );
      }
      // 添加到聊天室列表的第一个
      tempChatList.unshift(tempChat);
      // 重新设置chatList
      state.chatList = tempChatList;
      // 放入缓存
      ChatListUtils.setChatList(state.imuser.username, tempChatList);
    }
  },
  plugins: [createPersistedState()],
//  strict: process.env.NODE_ENV !== "production",
}

export default im

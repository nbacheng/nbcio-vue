import conf from "../../views/im/conf/index.js";
import StoreUtils from "./StoreUtils";
import WebsocketHeartbeatJs from "./WebsocketHeartbeatJs";
import { logout } from "./ChatUtils";
import {
  ErrorType,
  imageLoad,
  MessageInfoType,
  MessageTargetType
} from "./ChatUtils";
import winControl from "@/mode/webControl";

class RequestUtils {
  constructor() {
    this.instance = null;
    this.isRefreshing = false;
    this.subscribers = [];
  }

  /**
   * 单例构造方法，构造一个广为人知的接口，供用户对该类进行实例化
   * @returns {RequestUtils}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new RequestUtils();
    }
    return this.instance;
  }

  /**
   * 带token的请求
   * @param url 请求路径
   * @param options 请求参数
   * @returns {Promise<Response | never>}
   */
  request(url, options) {
    let self = this;
    let access_token = StoreUtils.getAccessToken();
    return self
      .timeoutFetch(
        fetch(url, {
          method: "POST",
          model: "cros", //跨域
          headers: {
            //'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token':  access_token,
            Accept: "application/json"
          },
          body: options
        }),
        5000
      )
      .then(response => {
        return self.checkStatus(response, url, options);
      })
      .then(response => {
        return response.json();
      });
  }
  
  /**
   * 检查token 是否失效，如果失效，刷新token
   * @param response 拦截的请求 response
   * @param url 请求路径
   * @param options 请求参数
   * @returns {Promise<any>|*}
   */
  checkStatus(response, url, options) {
    // eslint-disable-next-line no-console
    let self = this;
    if (response && response.status === 401) {
      // eslint-disable-next-line no-console
      // 这个Promise函数很关键
      let p = new Promise(resolve => {
        self.addSubscriber(() => {
          resolve(self.request(url, options));
        });
      });
      // eslint-disable-next-line no-console
      // 刷新token的函数,这需要添加一个开关，防止重复请求
      if (!self.isRefreshing) {
        self.isRefreshing = true;
        self.flushToken();
      }
      return p;
    } else {
      return response;
    }
  }
  
  /**
   * 刷新token
   * @returns {Promise<Response | never>}
   */
  flushToken(vue) {
    let self = this;
    self.isRefreshing = true;
    let param = new FormData();
    param.set("client_id", "v-client");
    param.set("client_secret", "v-client-ppp");
    param.set("grant_type", "refresh_token");
    param.set("scope", "select");
    param.set("refresh_token", StoreUtils.getToken().refresh_token);
    return fetch(conf.getTokenUrl(), {
      method: "POST",
      model: "cros", //跨域
      headers: {
        Accept: "application/json"
      },
      body: param
    })
      .then(response => {
        // eslint-disable-next-line no-console
        if (response.status === 200) {
          return response.json();
        } else {
          return new Promise((resolve, reject) => {
            reject(ErrorType.FLUSH_TOKEN_ERROR);
          });
        }
      })
      .then(json => {
        StoreUtils.setToken(json);
        //把token 失效后的请求重新执行
        self.onAccessTokenFetched();
        self.isRefreshing = false;
  
        //清除原先的刷新缓存的定时器
        vue.$store.commit("clearFlushTokenTimerId");
        //刷新token 定时器
        let flushTokenTimerId = setTimeout(function() {
          self.flushToken(vue);
        }, (json.expires_in - 10) * 1000);
        //将定时器存储到 $store
        vue.$store.commit("setFlushTokenTimerId", flushTokenTimerId);
      });
  }

/**
   * 重新执行token 失效的函数
   */
  onAccessTokenFetched() {
    let self = this;
    // eslint-disable-next-line no-console
    self.subscribers.forEach(callback => {
      callback();
    });
    self.subscribers = [];
  }

  /**
   * 把请求的token 失效的函数放到 subscribers
   * @param callback 请求的token 失效的函数
   */
  addSubscriber(callback) {
    let self = this;
    // eslint-disable-next-line no-console
    self.subscribers.push(callback);
    // eslint-disable-next-line no-console
  }
  
  timeoutFetch(fetchPromise, timeout) {
    let abortFn = null;

    //这是一个可以被reject的promise
    let abortPromise = new Promise(function(resolve, reject) {
      abortFn = function() {
        reject(ErrorType.TIMEOUT_ERROR);
      };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortAblePromise = Promise.race([fetchPromise, abortPromise]);

    setTimeout(function() {
      abortFn();
    }, timeout);

    return abortAblePromise;
  }

  /**
   * websocket 连接处理
   * @param self vue
   */
  webSocketOperation(self) {
    console.log("webSocketOperation conf.getWsUrl()=",conf.getWsUrl())  
    let websocketHeartbeatJs = new WebsocketHeartbeatJs({
      url: conf.getWsUrl(),
      self: self
    });
    websocketHeartbeatJs.onopen = function() {
      websocketHeartbeatJs.send('{"code":' + MessageInfoType.MSG_READY + "}");
    };
    websocketHeartbeatJs.onmessage = function(event) {
      let data = event.data;
      let sendInfo = JSON.parse(data);
      // 真正的消息类型
      if (sendInfo.code === MessageInfoType.MSG_MESSAGE) {
        winControl.flashIcon();
        let message = sendInfo.message;
        //如果图片不带域名，加上域名
        if (message.avatar && message.avatar.indexOf("http") === -1) {
          message.avatar = conf.getHostUrl() + message.avatar;
        }
        message.timestamp = self.formatDateTime(new Date(message.timestamp));
        // 发送给个人
        if (message.type === MessageTargetType.FRIEND) {
          // 接受人是当前的聊天窗口
          if (
            String(message.fromname) === String(self.$store.state.im.currentChat.id)
          ) {
            self.$store.commit("addMessage", message);
          } else {
            self.$store.commit("setUnReadCount", message);
            self.$store.commit("addUnreadMessage", message);
          }
        } else if (message.type === MessageTargetType.CHAT_GROUP) {
          // message.avatar = self.$store.state.chatMap.get(message.id);
          // 接受人是当前的聊天窗口
          if (String(message.id) === String(self.$store.state.im.currentChat.id)) {
            if (String(message.fromname) !== self.$store.state.im.imuser.username) {
              self.$store.commit("addMessage", message);
            }
          } else {
            self.$store.commit("setUnReadCount", message);
            self.$store.commit("addUnreadMessage", message);
          }
        }
        console.log("currentChat", self.$store.state.im.currentChat);
        winControl.flashFrame();
        self.$store.commit("setLastMessage", message);
        // 每次滚动到最底部
        self.$nextTick(() => {
          imageLoad("message-box");
        });
      }
    };

    websocketHeartbeatJs.onreconnect = function() {
      console.log("reconnecting...");
    };

    let count = 0;
    websocketHeartbeatJs.onerror = function() {
      RequestUtils.getInstance()
        .flushToken(self)
        .catch(error => {
          count++;
          if (ErrorType.NET_ERROR === error.toString()) {
            self.$Message.error("网络断开，正在重连...");
          } else if (ErrorType.FLUSH_TOKEN_ERROR === error) {
            count = 25;
          }
        });
      //重连次数大于24 退出登录
      if (count > 24) {
        count = 0;
        logout(self);
      }
    };
    self.$store.commit("setWebsocket", websocketHeartbeatJs);
  }
}

export default RequestUtils.getInstance();

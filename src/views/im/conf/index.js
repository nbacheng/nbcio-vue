export default {
  name: "conf",
  app_name: "NBCIO-IM",
  http_protocol: "http",
  ws_port: 9326,
  init: "/im/user/init",
  his_url: "/im/message/list",
  chat_users_url: "/im/user/chatUserList",
  ws_protocol: "ws",
  getHostUrl: function() {
    return (
      window._CONFIG['domianURL']
    );
  },
  getInitUrl: function() {
    return this.getHostUrl() + this.init;
  },
  getChatUsersUrl: function() {
    return this.getHostUrl() + this.chat_users_url;
  },
  getHisUrl: function() {
    return this.getHostUrl() + this.his_url;
  },
  getWsUrl: function() {
    return (
      this.ws_protocol +
      "://" +
      localStorage.getItem("host") +
      ":" +
      this.ws_port
    );
  }
};

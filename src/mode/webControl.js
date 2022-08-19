let i = 0;
const winControl = {
  openURL: function(url) {
    window.open(url);
  },
  flashFrame: function() {},
  min: function() {
    alert("方法需要自定义");
  },
  max: function() {
    if (i % 2 === 0) {
      document.getElementById("app").style.cssText =
        "width:1000px;height:600px;margin:30px auto";     
    } else {
      document.getElementById("app").style.cssText =
        "width:100%;height:100%;margin:0";
    }
    i++;
  },
  flashIcon: function() {},
  clearFlashIcon: function() {},
  close: function() {
    alert("方法需要自定义");
  }
};
export default winControl;

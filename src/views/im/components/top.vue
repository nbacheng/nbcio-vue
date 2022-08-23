<template>
  <div class="im-top" style="-webkit-app-region: drag">
    <a
      href="javascript:void(0)"
      @click="close"
      style="-webkit-app-region: no-drag"
    >
      <Icon type="ios-close" class="text-right"></Icon>
    </a>
    <a
      href="javascript:void(0)"
      @click="max"
      style="-webkit-app-region: no-drag"
    >
      <Icon :type="icon" class="text-right"></Icon>
    </a>
    <a
      href="javascript:void(0)"
      @click="min"
      style="-webkit-app-region: no-drag"
    >
      <Icon type="ios-remove" class="text-right"></Icon>
    </a>
  </div>
</template>
<script>
  
import winControl from "@/mode/webControl";
  
export default {
  data() {
    return {
      // 默认选中的值
      icon: "ios-square-outline"
    };
  },
  methods: {
    min() {
      winControl.min();
    },
    max() {
      winControl.max();
      this.icon =
        this.icon === "ios-square-outline"
          ? "ios-browsers-outline"
          : "ios-square-outline";
    },
    close() {
      winControl.close();
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/im/styles/theme";

$top-height: 4rem;
$color-online: #d1ffe9;

.im-top {
  height: $top-height;
  padding: 0.5rem;
  position: absolute;
  z-index: 2;
  right: 0;
  width: 100%;

  a {
    display: inline-block;
    color: $color-write;
    float: right;

    i {
      color: $color-default;
      font-size: 1.4rem;
      font-weight: bolder;
    }

    :hover {
      background-color: $color-gray;
    }

    .text-right {
      float: right;
      width: 2.4rem;
      height: 2.4rem;
      display: inline-block;
      padding: 0.5rem;
      text-align: center;
    }
  }
}
</style>

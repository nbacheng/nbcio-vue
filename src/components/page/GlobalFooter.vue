<template>
  <div class="footer">
    <div class="links">
      <a href="https://blog.csdn.net/qq_40032778" target="_blank">NBCIO 首页</a>
      <a href="https://ant.design/">Ant Design</a>
      <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/">Vue Antd</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      2022 <span>NBCIO 亿事达出品</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LayoutFooter"
  }
</script>

<style lang="less" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }
</style>
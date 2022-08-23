<template>
  <div>
    <ul class="faces">
      <li v-for="(item, index) in faceList" :key="index">
        <img
          :src="faceMap[item]"
          :alt="item"
          :title="item"
          @click="insertFace(item)"
        />
      </li>
    </ul>
    <div class="clear"></div>
  </div>
</template>
<script>
const { faceUtils } = require("../../../utils/im/ChatUtils");

export default {
  name: "faces",
  components: {},
  data() {
    return {
      faceList: faceUtils.alt,
      faceMap: faceUtils.faces()
    };
  },
  methods: {
    insertFace: function(item) {
      this.$emit("insertFace", item);
    }
  }
};
</script>

<style scoped lang="scss">
.faces {
  width: 30.5rem;
  list-style: none;
  background-color: #ffffff;
  border: 1px solid #f0f5ff;
  display: block;
  height: 25rem;
  & > li {
    width: 3rem !important;
    height: 3rem !important;
    display: inline-block;
    padding: 4px;
    float: left;
    cursor: pointer;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

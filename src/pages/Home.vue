<template>
  <div class="homepage">
    <h1>This is homepage</h1>
    <div>
      <a-button type="primary" @click="turntopage">Click to project</a-button>
      <a-button type="primary" @click="turntologin">Click to login</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    turntopage() {
      this.$router.push({
        path: "/dashboard"
      });
    },
    turntologin() {
      this.$router.push({
        path: "/login"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.homepage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
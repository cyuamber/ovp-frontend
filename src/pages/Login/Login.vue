<template>
  <div class="login">
    <h1>This is login page</h1>
    <a-button type="primary" @click="turntopage">Launch to project</a-button>
    <a-button type="primary" @click="login">Launch to project</a-button>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    turntopage() {
      this.$router.push({
        path: "/dashboard"
      });
    },
    login() {
      console.log("Login");
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
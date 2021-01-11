<template>
  <div class="homepage">
    <h1>This is homepage</h1>
    <div class="homepage-buttons">
      <a-button type="primary" @click="turntopage">Launch to project</a-button>
      <a-button type="primary" @click="turntologin">Launch to login</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    turntopage() {
      this.$router.push({
        path: '/dashboard'
      })
    },
    turntologin() {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.homepage {
  background: rgba(232, 232, 232);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .homepage-buttons {
    width: 25%;
    min-width: 320px;
    display: flex;
    justify-content: space-around;
  }
}
</style>

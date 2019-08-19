<template>
  <div class="layout-header">
    <div class="layout-header__router">
      <a-breadcrumb separator="-">
        <a-breadcrumb-item>OVP</a-breadcrumb-item>
        <a-breadcrumb-item v-for="(route,index) in updateBread" :key="index">{{route}}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div>
      <a-button :style="headerbuttonStyle">Create Test Job</a-button>
      <a-dropdown>
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="login" />Log in
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="2">
            <a-icon type="mail" />Change E-mail
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="user" />Change passport
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="4">
            <a-icon type="logout" />Log out
          </a-menu-item>
        </a-menu>
        <a-button :style="headerbuttonStyle">
          <a-icon type="user" />LOGIN
        </a-button>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const headerbuttonStyle = {
  height: "100%",
  borderRadius: "0px",
  borderTop: "0px",
  borderBottom: "0px",
  borderRight: "0px",
  boxShadow: "none",
  lineHeight: "4.6"
};
export default {
  name: "Header",
  data() {
    return {
      headerbuttonStyle
    };
  },
  mounted() {},
  computed: mapGetters(["updateBread"]),
  methods: {
    handleMenuClick(e) {
      if (e.key === "1" || e.key === "4") {
        this.gotoLogin();
      }
    },
    gotoLogin() {
      this.$router.push({
        path: "/login"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 1px;
  .layout-header__router {
    padding: 0;
    margin-left: 32px;
    a {
      color: #2c3e50;
      &.router-link-exact-active {
        color: #1890ff;
        text-decoration: none;
      }
    }
  }
}
</style>
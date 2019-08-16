<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="siderStyle">
      <Siderbar />
    </a-layout-sider>
    <a-layout :style="layoutStyle.container">
      <a-layout-header :style="layoutStyle.header">
        <Header />
      </a-layout-header>
      <a-layout-content :style="layoutStyle.content">
        <div :style="layoutStyle.contentDiv">
          <router-view />
        </div>
      </a-layout-content>
      <!-- <a-layout-footer :style="layoutStyle.footer">
        <Footer />
      </a-layout-footer>-->
    </a-layout>
  </a-layout>
</template>
<script>
import Header from "./header";
import Siderbar from "./sidebar";
import Footer from "./footer";

const siderStyle = {
  background: "#ffffff",
  overflow: "auto",
  height: "100vh",
  width: "220px",
  maxWidth: "220px",
  position: "fixed",
  left: 0,
  borderRight: "1px solid rgb(232, 232, 232)"
};
const layoutStyle = {
  container: {
    marginLeft: "220px"
  },
  header: {
    background: "#fff",
    padding: 0
  },
  content: {
    marginTop: "2px",
    overflow: "initial"
  },
  contentDiv: {
    padding: "24px",
    background: "#fff",
    minHeight: "80vh"
  },
  footer: {
    textAlign: "center",
    paddingTop: "0px"
  }
};
export default {
  name: "Layout",
  components: {
    Header: Header,
    Siderbar: Siderbar,
    Footer: Footer
  },
  data() {
    return {
      siderStyle,
      layoutStyle
    };
  }
};
</script>
<style lang="less" scoped>
#components-layout-demo-fixed-sider {
  background: rgba(255, 255, 255, 0.2);
}
</style>>


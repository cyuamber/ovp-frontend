<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="siderStyle">
      <Siderbar />
    </a-layout-sider>
    <a-layout :style="layoutStyle.layoutStyle__container">
      <a-layout-header :style="layoutStyle.layoutStyle__header">
        <Header />
      </a-layout-header>
      <a-layout-content :style="layoutStyle.layoutStyle__content">
        <div :style="layoutStyle.content__contentDiv">
          <router-view />
        </div>
      </a-layout-content>
      <!-- <a-layout-footer :style="layoutStyle.layoutStyle__footer">
        <Footer />
      </a-layout-footer>-->
    </a-layout>
  </a-layout>
</template>
<script>
import Header from "./header";
import Siderbar from "./sidebar";
// import Footer from "./footer";

const siderStyle = {
  background: "#ffffff",
  overflow: "auto",
  height: "100vh",
  width: "250px",
  maxWidth: "250px",
  position: "fixed",
  left: 0,
  borderRight: "1px solid rgb(232, 232, 232)"
};
const layoutStyle = {
  layoutStyle__container: {
    marginLeft: "250px"
  },
  layoutStyle__header: {
    background: "#fff",
    padding: 0
  },
  layoutStyle__content: {
    marginTop: "2px",
    overflow: "initial"
  },
  content__contentDiv: {
    padding: "24px",
    background: "#fff",
    minHeight: "80vh"
  },
  layoutStyle__footer: {
    textAlign: "center",
    paddingTop: "0px"
  }
};
export default {
  name: "Layout",
  components: {
    Header: Header,
    Siderbar: Siderbar
    // Footer: Footer
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


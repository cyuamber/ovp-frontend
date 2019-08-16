<template>
  <div class="layout-siderbar">
    <div class="logo">
      <img src="@/assets/logo.png" />
    </div>
    <a-menu
      :style="menuStyle"
      theme="light"
      mode="inline"
      :defaultSelectedKeys="defaultMenu"
      :defaultOpenKeys="defaultOpenKeys"
      :selectedKeys="currentMenu"
      @click="clickMenu"
    >
      <template v-for="menu in menus">
        <a-menu-item v-if="!menu.isChildren && menu.auth.includes(getuserAuth) " :key="menu.name">
          <a-icon :type="menu.iconType" />
          <span>{{menu.name}}</span>
        </a-menu-item>
        <a-sub-menu :key="menu.name" v-else-if="menu.isChildren && menu.auth.includes(getuserAuth)">
          <span slot="title">
            <a-icon :type="menu.iconType" />
            {{menu.name}}
          </span>
          <a-menu-item :key="submenu" v-for="submenu in menu.children">{{submenu}}</a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import util from "../../utils/utils";
import MENUITEM from "../../const/menu";

const menuStyle = {
  border: "none",
  borderTop: "2px solid #f0f2f5"
};

export default {
  name: "Siderbar",
  data() {
    return {
      menuStyle,
      defaultMenu: [],
      currentMenu: [],
      defaultOpenKeys: [],
      menus: []
    };
  },
  computed: mapGetters(["getuserAuth"]),
  created() {
    this.menus = MENUITEM.menuItems;
    this.setDefaultmenu();
    window.addEventListener("popstate", () => {
      this.currentMenu = [];
      this.setDefaultmenu();
    });
  },

  methods: {
    setDefaultmenu() {
      const re = /\/.*/g;
      let currentUrlstr = "";
      if (re.test(this.$route.path)) {
        currentUrlstr = this.$route.path.substr(1);
      }
      this.menus.map(item => {
        if (item.isChildren) {
          item.children.map(children => {
            if (currentUrlstr === util.transformUrlpathstr(children)) {
              this.defaultOpenKeys.push(item.name);
              this.defaultMenu.push(children);
              this.currentMenu.push(children);
              this.$store.commit("setBreadcrumb", [item.name, children]);
            }
          });
        } else {
          if (currentUrlstr === util.transformUrlpathstr(item.name)) {
            this.defaultMenu.push(item.name);
            this.currentMenu.push(item.name);
            this.$store.commit("setBreadcrumb", [item.name]);
          }
        }
      });
    },
    clickMenu(e) {
      this.currentMenu = [];
      let routePath = e.keyPath;
      let routeStr = util.transformUrlpathstr(e.key);
      this.currentMenu.push(e.key);
      this.$store.commit("setBreadcrumb", routePath);
      this.$router.push({
        path: routeStr
      });
    }
  }
};
</script>
<style lang="less" scoped>
.layout-siderbar {
  .logo {
    height: 32px;
    margin: 16px;
    text-align: center;
    img {
      height: 120%;
    }
  }
}
</style>
<template>
  <div class="layout-siderbar">
    <div class="layout-siderbar__logo">
      <img src="@/assets/logo.png" />
    </div>
    <a-menu
      :style="menuStyle"
      theme="light"
      mode="inline"
      :defaultSelectedKeys="defaultMenu"
      :defaultOpenKeys="defaultOpenKeys"
      :open-keys="openKeys"
      :selectedKeys="currentMenu"
      @click="clickMenu"
      @openChange="onOpenChange"
    >
      <template v-for="menu in menus">
        <a-menu-item v-if="!menu.isChildren && menu.auth.includes(getuserAuth)" :key="menu.name">
          <a-icon v-if="menu.iconType!==''" :type="menu.iconType" />
          <span>{{$t(`T.${menu.name}`)}}</span>
        </a-menu-item>
        <a-sub-menu :key="menu.name" v-else-if="menu.isChildren && menu.auth.includes(getuserAuth)">
          <span slot="title">
            <a-icon :type="menu.iconType" />
            {{$t(`T.${menu.name}`)}}
          </span>
          <template v-for="submenu in menu.children">
            <a-menu-item :key="submenu.name" v-if="submenu.auth.includes(getuserAuth)">
              <a-icon v-if="submenu.iconType!==''" :type="submenu.iconType" />
              <span>{{$t(`T.${submenu.name}`)}}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
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
      defaultOpenKeys: [],
      menus: [],
      rootSubmenuKeys: [],
      openKeys: []
    };
  },
  computed: {
    ...mapGetters(["getuserAuth"]),
    ...mapState({
      currentMenu: state => state.router.currentMenu
    })
  },
  created() {
    this.menus = MENUITEM.menuItems;
      this.rootSubmenuKeys = MENUITEM.menuItems.map(item=>{
        return item.name
    });
    this.setDefaultmenu();
    window.addEventListener("popstate", () => {
      // this.currentMenu = [];
      this.setDefaultmenu();
    });
  },

  methods: {
    setDefaultmenu() {
      this.menus.map(item => {
        if (item.isChildren) {
          this.computedMenu(item.children, item);
        } else {
          this.computedMenu(null, item);
        }
      });
    },
    computedMenu(child, parent) {
      const re = /\/.*/g;
      let currentUrlstr = "";
      if (re.test(this.$route.path)) {
        currentUrlstr = this.$route.path.substr(1);
      }
      if (child) {
        child.map(item => {
          if (currentUrlstr === util.transformUrlpathstr(item.name)) {
            this.defaultOpenKeys.push(parent.name);
            this.defaultMenu.push(item.name);
            this.$store.commit("setCurrentMenu", [item.name]);
            this.$store.commit("setBreadcrumb", [parent.name, item.name]);
          }
        });
      } else {
        if (currentUrlstr === util.transformUrlpathstr(parent.name)) {
          this.defaultMenu.push(parent.name);
          this.$store.commit("setCurrentMenu", [parent.name]);
          this.$store.commit("setBreadcrumb", [parent.name]);
        }
      }
    },
    clickMenu(e) {
      this.$store.commit("setCurrentMenu");
      let routePath = e.keyPath.reverse();
      this.openKeys = routePath.length>1?[routePath[0]]:[];
      let routeStr = util.transformUrlpathstr(e.key);
      this.$store.commit("setCurrentMenu", [e.key]);
      this.$store.commit("setBreadcrumb", routePath);
      this.$router.push({
        path: routeStr
      });
    },
      onOpenChange(openKeys) {
          this.openKeys = openKeys;
      },
  }
};
</script>
<style lang="less" scoped>
.layout-siderbar {
  .layout-siderbar__logo {
    height: 32px;
    margin: 16px;
    text-align: center;
    img {
      height: 120%;
    }
  }
}
</style>
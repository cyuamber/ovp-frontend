<template>
  <div class="layout-header">
    <div class="layout-header__router">
      <a-breadcrumb separator="-">
        <a-breadcrumb-item>OVP</a-breadcrumb-item>
        <a-breadcrumb-item
          v-for="(route, index) in breadcrumbArr"
          :key="index"
          >{{ $t(`T.${route}`) }}</a-breadcrumb-item
        >
      </a-breadcrumb>
    </div>
    <div>
      <!--<a-button :style="headerbuttonStyle" @click="handleCreateTestJob">{{$t('T.CreateTestJob')}}</a-button>-->
      <a-dropdown>
        <a-menu slot="overlay" @click="handleMenuClick">
          <!-- <a-menu-item key="1">
            <a-icon type="login" />
            {{$t(`T.${'Log in'}`)}}
          </a-menu-item>-->
          <!-- <a-menu-divider /> -->
          <a-menu-item key="2">
            <a-icon type="mail" />
            {{ $t(`T.${'Change E-mail'}`) }}
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="user" />
            {{ $t(`T.${'Change passport'}`) }}
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="4">
            <a-icon type="logout" />
            {{ $t(`T.${'Log out'}`) }}
          </a-menu-item>
        </a-menu>
        <a-button :style="headerbuttonStyle">
          <!-- <a-icon type="user" />{{$t('T.LOGIN')}} -->
          <a-icon type="user" />
          {{ userName }}
        </a-button>
      </a-dropdown>
      <a-button
        :style="headerbuttonStyle"
        @click="() => handleLangChange(lang)"
        >{{ $t('T.lang') }}</a-button
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const headerbuttonStyle = {
  height: '100%',
  borderRadius: '0px',
  borderTop: '0px',
  borderBottom: '0px',
  borderRight: '0px',
  boxShadow: 'none',
  lineHeight: '4.6'
}
export default {
  name: 'Header',
  data() {
    return {
      userName: 'Admin',
      headerbuttonStyle
    }
  },
  mounted() {
    this.$store.dispatch('getCurrentLanguage', {}).then(() => {
      this.$i18n.locale = this.lang
    })
  },
  computed: {
    ...mapState({
      lang: state => state.router.lang,
      breadcrumbArr: state => state.router.breadcrumbArr
    })
  },
  watch: {
    lang(val) {
      this.$i18n.locale = val
    }
  },
  methods: {
    handleMenuClick(e) {
      if (e.key === '1' || e.key === '4') {
        this.gotoLogin()
      }
    },
    gotoLogin() {
      this.$router.push({
        path: '/login'
      })
    },
    // handleCreateTestJob() {
    //   if (this.$route.path !== "/testjobmgt") {
    //     this.$store.commit("setCurrentMenu", ["Test Job MGT"]);
    //     this.$store.commit("setBreadcrumb", ["Test Job MGT"]);
    //     this.$router.push({ path: "testjobmgt" });
    //   }
    //   this.$store.commit("testJob/setIsShow", true);
    //   this.$store.dispatch("testJob/getSUTType",{
    //       message: this.$message
    //   });
    //   this.$store.dispatch("testJob/getVNFMOption", {
    //       message: this.$message
    //   });
    //   this.$store.dispatch("testJob/getVIMOption", {
    //       message: this.$message
    //   });
    // },
    handleLangChange(val) {
      let obj = { lang: val === 'en_US' ? 'zh_CN' : 'en_US' }
      this.$store.dispatch('getCurrentLanguage', obj)
    }
  }
}
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

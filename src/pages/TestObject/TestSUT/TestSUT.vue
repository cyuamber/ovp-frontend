<template>
  <div>
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChange">
      <a-tab-pane v-for="tab in tabs" :key="tab.val" :tab="tab.key"></a-tab-pane>
    </a-tabs>
    <Toolbar />
    <DataTable />
    <SUTCreateOrEdit :isEdit="editStatus" />
  </div>
</template>

<script>
import SUTCreateOrEdit from "./SUTCreateOrEdit";
import Toolbar from "./Toolbar";
import DataTable from "./DataTable";
import { TestSUTTabs } from "./constant";
import Loading from "../../../components/Loading/Loading";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "VnfTypeobject",
  data() {
    return {
      tabs: TestSUTTabs
    };
  },
  computed: {
    ...mapState({
      loadingMessage: state => state.loading.loadingMessage,
      currentTab: state => state.testSUT.currentTab,
      editStatus: state => state.testSUT.editStatus
    }),
    keyword: {
      get() {
        return this.$store.state.testSUT.keyword;
      },
      set(val) {
        if (val) {
          this.$store.state.testSUT.keyword = "";
        }
      }
    }
  },
  watch: {
    currentTab(val) {
      if (val) {
        this.getVNFOptions();
      }
    }
  },
  components: {
    SUTCreateOrEdit,
    Toolbar,
    DataTable,
    Loading
  },
  mounted() {
    this.initTestSUTeTable();
  },
  destroyed() {
    this.changeTab(101);
  },
  methods: {
    ...mapActions("testSUT", ["getTableData", "getVNFOptions"]),
    ...mapMutations("testSUT", ["changeTab"]),
    initTestSUTeTable() {
      this.getVNFOptions();
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
    },
    handleTabsChange(key) {
      this.changeTab(key);
      this.keyword = "";
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
    }
  }
};
</script>

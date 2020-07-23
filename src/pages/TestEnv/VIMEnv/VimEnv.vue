<template>
  <div>
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChange">
      <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab"></a-tab-pane>
    </a-tabs>
    <Toolbar :tableType="currentTab" />
    <DataTable :tableType="currentTab" />
    <CreateOrEditModal :isEdit="editStatus" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Loading from "../../../components/Loading/Loading";
import CreateOrEditModal from "./CreateOrEditModal";
import DataTable from "./DataTable";
import Toolbar from "./Toolbar";

export default {
  name: "VimEnv",
  data() {
    return {
      tabs: ["VIM ENV", "VNFM ENV", "MANO ENV"],
    };
  },
  computed: {
    ...mapState({
      loadingMessage: state => state.loading.loadingMessage,
      currentTab: state => state.testENV.currentTab,
      editStatus: state => state.testENV.editStatus
    })
  },
  components: {
    Loading,
    Toolbar,
    CreateOrEditModal,
    DataTable
  },
  mounted() {
    this.initVimEnvTable();
  },
  destroyed() {
    this.changeTab("VIM ENV");
  },
  methods: {
    ...mapActions("testENV", [
      "getTableData",
      "getCloudTypeOptions",
      "getMANOTypeOptions"
    ]),
    ...mapMutations("testENV", ["changeTab"]),
    ...mapMutations("datePicker", ["setDateTime"]),
    ...mapMutations("searching", ["setKeyword"]),
    initVimEnvTable() {
      this.getCloudTypeOptions();
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
    },
    handleTabsChange(key) {
      this.changeTab(key);
      this.setKeyword("");
      this.setDateTime("");
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
      if (key === "MANO ENV") {
        this.getMANOTypeOptions();
      }
    }
  }
};
</script>

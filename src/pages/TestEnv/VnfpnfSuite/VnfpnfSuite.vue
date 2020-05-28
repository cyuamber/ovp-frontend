<template>
  <div class="test-ins__container">
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChanges">
      <a-tab-pane v-for="tab in tabs" :key="tab.val" :tab="tab.key"></a-tab-pane>
    </a-tabs>
    <Toolbar />
    <DataTable />
    <xNFCreateOrEdit :isEdit="editStatus" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { PackageMGTTabs, VnfpnfSuiteColumns } from "./constant";
import Toolbar from "./Toolbar";
import DataTable from "./DataTable";
import xNFCreateOrEdit from "./VnfpnfCreateOrEdit";
import Loading from "../../../components/Loading/Loading";

export default {
  name: "VnfpnfSuite",
  components: {
    DataTable,
    Toolbar,
    xNFCreateOrEdit,
    Loading
  },
  data() {
    return {
      PackageMGTTabs,
      tabs: PackageMGTTabs,
      columns: VnfpnfSuiteColumns,
      currentPage: "VNF/PNFSuiteMGT",
      isEdit: false,
      createTime: "",
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.VnfpnfSuite.tableData,
      pagination: state => state.VnfpnfSuite.pagination,
      SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
      editStatus: state => state.VnfpnfSuite.editStatus,
      loadingMessage: state => state.loading.loadingMessage,
      currentTab: state => state.VnfpnfSuite.currentTab,
      tableLoading: state => state.loading.tableLoading
    })
  },
  watch: {
    currentTab(val) {
      if (val) {
        this.getVNFOptions();
      }
    }
  },
  mounted() {
    this.initVnfPnfSuiteTable();
  },
  methods: {
    ...mapActions("VnfpnfSuite", ["getTableData", "getVNFOptions"]),
    ...mapMutations("VnfpnfSuite", ["changeTab"]),
    ...mapMutations("searching", ["setKeyword"]),
      ...mapMutations("datePicker", ["setDateTime"]),
      initVnfPnfSuiteTable() {
      this.getVNFOptions();
      this.getTableData({});
    },
    handleTabsChanges(key) {
      this.setKeyword("");
      this.setDateTime("");
      this.changeTab(key);
      this.getTableData({});
    }
  },
  destroyed() {
    this.changeTab(101);
  }
};
</script>

<style lang="less" scoped>
.test-ins__container {
  .top {
    margin-bottom: 30px;
    .search {
      display: inline-block;
      margin-left: 40px;
    }
    .calendar {
      float: right;
      width: 280px;
    }
  }
  .tag {
    padding: 0 8px;
    border-radius: 12px;
  }
}
</style>

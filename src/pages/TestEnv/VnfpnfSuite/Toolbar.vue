<template>
  <div class="top">
    <a-button type="primary" @click="handleCreatePackage">Create {{packageName}} TT</a-button>
    <Search class="search" @VNFSuiteSearch="VNFSuiteSearch" :currentPage="currentPage" />
    <a-date-picker class="calendar" @change="handleTimeChange" placeholder="Select date" />
  </div>
</template>

<script>
import Search from "../../../components/Search/Search";
import { PackageMGTTabs } from "./constant";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Toolbar",
  components: { Search },
  data() {
    return {
      currentPage: "VNF/PNFSuiteMGT",
      createTime: ""
    };
  },
  computed: {
    ...mapState({
      currentTab: state => state.VnfpnfSuite.currentTab,
      searchKeyword: state => state.searching.keyword
    }),
    packageName: function() {
      return PackageMGTTabs.filter(item => item.val === this.currentTab)[0].key;
    }
  },

  methods: {
    ...mapActions("VnfpnfSuite", ["getTableData", "clearPagination"]),
    ...mapMutations("VnfpnfSuite", [
      "updateVisible",
      "updateEdit",
      "updateVNFTest"
    ]),

    handleCreatePackage() {
      this.updateVisible(true);
      this.updateEdit(false);
      this.updateVNFTest({});
    },
    // Filter by creating time
    handleTimeChange(date, d) {
      this.createTime = d;
      this.VNFSuiteSearch();
    },
    VNFSuiteSearch() {
      let obj = Object.assign(
        {},
        {
          flag: this.currentTab,
          name: this.searchKeyword,
          createTime: this.createTime
        }
      );
      this.clearPagination();
      this.getTableData(obj);
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>

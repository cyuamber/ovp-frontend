<template>
  <div class="top">
    <a-button type="primary" @click="handleCreatePackage">Create {{PackageName}} TT</a-button>
    <Search class="search" @VNFSuiteSearch="VNFSuiteSearch" :currentPage="currentPage" />
    <a-date-picker class="calendar" @change="handleTimeChange" placeholder="Select date" />
  </div>
</template>

<script>
import Search from "../../../components/Search/Search";
import { PackageMGTTabs } from "./constant";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  props: ["tableType"],
  name: "Toolbar",
  components: { Search },
  data() {
    return {
      currentPage: "VNF/PNFSuiteMGT",
      createTime: "",
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      currentTab: state => state.VnfpnfSuite.currentTab
    }),
    PackageName: function() {
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
    VNFSuiteSearch(keyword, isSearch) {
      let obj = { flag: this.currentTab };
      if (isSearch) this.keyword = keyword;
      if (!(keyword === "" && this.createTime === "")) {
        obj = { name: this.keyword, createTime: this.createTime };
      }
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

<template>
  <div class="top">
    <a-button type="primary" @click="createOrEditSpecShow">Add Spec</a-button>
    <Search
            class="search test-spec__search"
            @searchInput="testSpecSearch"
    />
    <DatePicker class="calendar" @changeDate="changeDate"/>
  </div>
</template>

<script>
import Search from "../../components/Search/Search";
import { mapState, mapActions, mapMutations } from "vuex";
import DatePicker from "../../components/DatePicker/DatePicker";
export default {
  name: "Toolbar",
  components: { Search, DatePicker },
  data() {
    return {
      createTime: ""
    };
  },
  computed: {
    ...mapState({
      searchKeyword: state => state.searching.keyword,
      selectDateTime: state => state.datePicker.selectDateTime
    })
  },

  methods: {
    ...mapActions("testSpecMGT", [
        "getTableData",
        "clearPagination",
        "getTestSpec"
    ]),
    ...mapMutations("testSpecMGT", [
      "updateVisible",
      "updateEdit"
    ]),

      createOrEditSpecShow() {
          this.updateVisible(true);
          this.updateEdit(false);
          this.getTestSpec("");
      },
      // Filter by creating time
      changeDate() {
          this.publishTime = this.selectDateTime;
          this.keyword = this.searchKeyword;
          this.testSpecSearch();
      },
      testSpecSearch(keyword, isSearch) {
          let obj = {};
          if (isSearch) this.keyword = keyword;
          obj = {
              testSpecName: this.searchKeyword,
              publishTime: this.publishTime
          };
          this.clearPagination();
          // Simulation request
          this.getTableData(obj);
      },
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

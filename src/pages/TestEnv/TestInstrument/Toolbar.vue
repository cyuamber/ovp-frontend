<template>
  <div class="top">
    <a-button type="primary" @click="createOrEditTestInstrument">Register TTMS</a-button>
    <Search class="search" @searchInput="testInsSearch" />
    <DatePicker class="calendar" @changeDate="changeDate"/>
  </div>
</template>

<script>
import Search from "../../../components/Search/Search";
import { mapState, mapActions, mapMutations } from "vuex";
import DatePicker from "../../../components/DatePicker/DatePicker";
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
    ...mapActions("TestInstrument", ["getTableData", "clearPagination"]),
    ...mapMutations("TestInstrument", [
      "updateVisible",
      "updateEdit",
      "updateMeterSys"
    ]),

    createOrEditTestInstrument() {
      this.updateVisible(true);
      this.updateEdit(false);
      this.updateMeterSys({});
    },
    // Filter by creating time
    changeDate() {
        this.createTime = this.selectDateTime;
        this.keyword = this.searchKeyword;
        this.testInsSearch();
    },
    testInsSearch(keyword, isSearch) {
        let obj = {};
        if (isSearch) this.keyword = keyword;
        obj = Object.assign(
            {},
            {
                name: this.searchKeyword,
                createTime: this.createTime
            }
        );
        this.clearPagination();
        // Simulation request
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

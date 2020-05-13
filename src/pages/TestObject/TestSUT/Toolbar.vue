<template>
  <div class="tab-content tab-content--margin">
    <a-button type="primary" @click="handleCreate">Create {{SUTName}} SUT</a-button>
    <Search class="tab-content__button" @serchTestSUT="serchTestSUT" :currentPage="currentPage" />
    <a-date-picker class="tab-content__calendar" @change="onChange" placeholder="Select date" />
  </div>
</template>

<script>
import Search from "../../../components/Search/Search";
import { TestSUTTabs, TestSUTColumns } from "./constant";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Toolbar",
  data() {
    return {
      tabs: TestSUTTabs,
      currentPage: "TestSUT",
      columns: TestSUTColumns
    };
  },
  computed: {
    ...mapState({
      currentTab: state => state.testSUT.currentTab
    }),
    SUTName: function() {
      return TestSUTTabs.filter(item => item.val === this.currentTab)[0].key;
    },
    keyword: {
      get() {
        console.log(this.$store.state.testSUT.keyword, "===>get keyword");
        return this.$store.state.testSUT.keyword;
      },
      set(val) {
        if (val) {
          this.$store.state.testSUT.keyword = "";
        }
      }
    }
  },
  components: { Search },
  methods: {
    ...mapActions("testSUT", ["setParams"]),
    ...mapMutations("testSUT", [
      "updateVisible",
      "updateEdit",
      "setFilterItem"
    ]),
    handleCreate() {
      this.updateVisible(true);
      this.updateEdit(false);
    },
    // Get table data by entering information or selecting time
    serchTestSUT(keyword) {
      this.setFilterItem({
        key: keyword,
        isSearch: true,
        message: this.$message
      });
      this.setParams(true);
    },
    // Filter by creating time
    onChange(date, d) {
      this.setFilterItem({ time: d });
      this.setParams(true);
    }
  }
};
</script>

<style lang="less" scoped>
.tab-content--margin {
  margin-top: 10px;
  margin-bottom: 30px;
  .tab-content__button {
    display: inline-block;
    margin-left: 40px;
  }
  .tab-content__calendar {
    float: right;
    width: 280px;
  }
}
</style>>


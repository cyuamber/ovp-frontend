<template>
  <div class="tab-content tab-content--margin">
    <a-button type="primary" @click="handleRigister">Register {{tableType}}</a-button>
    <a-input
      class="tab-content__button"
      :placeholder="tableType === 'VIM ENV'?'Cloud Type':'Name'"
      @keyup.enter="searchTypeID"
      @change="setSearchWord"
      v-model="keyword"
    >
      <a-icon slot="prefix" type="search" />
    </a-input>
    <a-date-picker
      v-if="tableType!=='MANO ENV'"
      class="tab-content__calendar"
      @change="selectedTime"
      placeholder="Select date"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  props: ["tableType"],
  name: "Toolbar",
  data() {
    return {
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      searchKeyword: state => state.searching.keyword
    })
  },
  watch: {
    searchKeyword(val) {
      this.keyword = val;
    }
  },
  methods: {
    ...mapMutations("testENV", [
      "updateVisible",
      "setFilterItem",
      "updateEdit"
    ]),
    ...mapMutations("searching", ["setKeyword"]),
    ...mapActions("testENV", ["setParams"]),
    handleRigister() {
      this.updateVisible(true);
      this.updateEdit(false);
    },
    setSearchWord(e) {
      this.setKeyword(e.target.value);
    },
    searchTypeID() {
      this.setFilterItem({
        key: this.keyword,
        isSearch: true,
        message: this.$message
      });
      this.setParams();
    },
    selectedTime(date, d) {
      this.setFilterItem({ time: d });
      this.setParams();
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
    width: 240px;
    margin-left: 40px;
    /deep/ .ant-input {
      border-radius: 20px;
    }
  }
  .tab-content__calendar {
    float: right;
    width: 280px;
  }
}

/deep/ .ant-table-thead > tr > th {
  text-align: center;
  white-space: nowrap;
}
</style>

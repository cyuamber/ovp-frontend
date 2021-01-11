<template>
  <div class="tab-content tab-content--margin">
    <a-button type="primary" @click="showRigisterOrEditModel"
      >Register {{ tableType }}</a-button
    >
    <Search class="search" @searchInput="testENVSearch" />
    <DatePicker
      v-if="tableType !== 'MANO ENV'"
      class="calendar"
      @changeDate="changeDate"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Search from '../../../components/Search/Search'
import DatePicker from '../../../components/DatePicker/DatePicker'
export default {
  props: ['tableType'],
  name: 'Toolbar',
  components: {
    Search,
    DatePicker
  },
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    ...mapState({
      searchKeyword: state => state.searching.keyword,
      selectDateTime: state => state.datePicker.selectDateTime
    })
  },
  watch: {
    searchKeyword(val) {
      this.keyword = val
    }
  },
  methods: {
    ...mapMutations('testENV', [
      'updateVisible',
      'setFilterItem',
      'updateEdit'
    ]),
    ...mapActions('testENV', ['setParams']),
    showRigisterOrEditModel() {
      this.updateVisible(true)
      this.updateEdit(false)
    },
    testENVSearch(keyword, isSearch) {
      this.setFilterItem({
        key: this.keyword,
        isSearch: isSearch,
        message: this.$message
      })
      this.setParams()
    },
    changeDate() {
      this.keyword = this.searchKeyword
      this.setFilterItem({ time: this.selectDateTime, key: this.keyword })
      this.testENVSearch()
    }
  }
}
</script>

<style lang="less" scoped>
.tab-content--margin {
  margin-top: 10px;
  margin-bottom: 30px;
  .search {
    display: inline-block;
    width: 240px;
    margin-left: 40px;
    /deep/ .ant-input {
      border-radius: 20px;
    }
  }
  .calendar {
    float: right;
    width: 280px;
  }
}

/deep/ .ant-table-thead > tr > th {
  text-align: center;
  white-space: nowrap;
}
</style>

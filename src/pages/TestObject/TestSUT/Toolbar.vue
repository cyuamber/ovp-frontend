<template>
  <div class="tab-content tab-content--margin">
    <a-button type="primary" @click="createOrEditSUTshow"
      >Create {{ SUTName }} SUT</a-button
    >
    <Search class="tab-content__button" @searchInput="serchTestSUT" />
    <DatePicker class="calendar" @changeDate="changeDate" />
  </div>
</template>

<script>
import Search from '../../../components/Search/Search'
import { TestSUTTabs, TestSUTColumns } from './constant'
import { mapState, mapActions, mapMutations } from 'vuex'
import DatePicker from '../../../components/DatePicker/DatePicker'
export default {
  name: 'Toolbar',
  data() {
    return {
      tabs: TestSUTTabs,
      currentPage: 'TestSUT',
      columns: TestSUTColumns
    }
  },
  computed: {
    ...mapState({
      currentTab: state => state.testSUT.currentTab,
      keyword: state => state.searching.keyword,
      selectDateTime: state => state.datePicker.selectDateTime
    }),
    SUTName: function() {
      return TestSUTTabs.filter(item => item.val === this.currentTab)[0].key
    },
    keyword: {
      get() {
        return this.$store.state.testSUT.keyword
      },
      set(val) {
        if (val) {
          this.$store.state.testSUT.keyword = ''
        }
      }
    }
  },
  components: { Search, DatePicker },
  methods: {
    ...mapActions('testSUT', ['setParams']),
    ...mapMutations('testSUT', [
      'updateVisible',
      'updateEdit',
      'setFilterItem'
    ]),
    createOrEditSUTshow() {
      this.updateVisible(true)
      this.updateEdit(false)
    },
    // Get table data by entering information or selecting time
    serchTestSUT(keyword) {
      this.setFilterItem({
        key: keyword,
        isSearch: true,
        message: this.$message
      })
      this.setParams(true)
    },
    // Filter by creating time
    changeDate() {
      this.setFilterItem({
        time: this.selectDateTime,
        key: this.$store.state.searching.keyword
      })
      this.setParams(true)
    }
  }
}
</script>

<style lang="less" scoped>
.tab-content--margin {
  margin-top: 10px;
  margin-bottom: 30px;
  .tab-content__button {
    display: inline-block;
    margin-left: 40px;
  }
  .calendar {
    float: right;
    width: 280px;
  }
}</style
>>

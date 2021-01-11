<template>
  <div class="test-spec">
    <Loading :loadingMessage="loadingMessage" />
    <Toolbar />
    <DataTable />
    <TestSpecMGTAddOrEdit :isEdit="editStatus" />
  </div>
</template>
<script>
import Toolbar from './Toolbar'
import DataTable from './DataTable'
import { mapState, mapActions, mapMutations } from 'vuex'
import Loading from '../../components/Loading/Loading'
import TestSpecMGTAddOrEdit from './TestSpecMGTAddOrEdit'

export default {
  name: 'TestSpecMGT',
  components: {
    TestSpecMGTAddOrEdit,
    Loading,
    Toolbar,
    DataTable
  },
  computed: {
    ...mapState({
      tableData: state => state.testSpecMGT.tableData,
      pagination: state => state.testSpecMGT.pagination,
      testSpecSingleData: state => state.testSpecMGT.testSpecSingleData,
      loadingMessage: state => state.loading.loadingMessage,
      tableLoading: state => state.loading.tableLoading,
      testCasetableLoading: state => state.testSpecMGT.testCasetableLoading,
      editStatus: state => state.testSpecMGT.editStatus,
      searchKeyword: state => state.searching.keyword,
      selectDateTime: state => state.datePicker.selectDateTime
    })
  },
  mounted() {
    this.initTestStandardTable()
  },
  methods: {
    ...mapActions('testSpecMGT', [
      'getTableData',
      'getTestCaseTableData',
      'getTestCaseList',
      'getTestSpec',
      'deleteTestSpec',
      'getPagination',
      'getSUTOptions'
    ]),
    ...mapMutations('searching', ['setKeyword']),
    ...mapMutations('datePicker', ['setDateTime']),
    initTestStandardTable() {
      this.getSUTOptions()
      this.getTableData({})
    },
    beforeDestroy() {
      this.setKeyword('')
      this.setDateTime('')
    }
  }
}
</script>

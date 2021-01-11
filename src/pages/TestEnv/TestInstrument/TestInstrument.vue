<template>
  <div class="test-ins__container">
    <Loading :loadingMessage="loadingMessage" />
    <Toolbar />
    <DataTable />
    <RigisterCreateOrEdit :isEdit="editStatus" />
  </div>
</template>

<script>
import Loading from '../../../components/Loading/Loading'
import RigisterCreateOrEdit from './TestInsrigisterOrEdit'
import Toolbar from './Toolbar'
import DataTable from './DataTable'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'TestInstrument',
  components: {
    DataTable,
    RigisterCreateOrEdit,
    Loading,
    Toolbar
  },
  data() {
    return {
      isVisibleEditModel: false,
      createTime: '',
      keyword: ''
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.TestInstrument.tableData,
      pagination: state => state.TestInstrument.pagination,
      singleData: state => state.TestInstrument.singleData,
      editStatus: state => state.TestInstrument.editStatus,
      loadingMessage: state => state.loading.loadingMessage,
      tableLoading: state => state.loading.tableLoading
    })
  },
  mounted() {
    this.initTestInsTable()
  },
  methods: {
    ...mapMutations('searching', ['setKeyword']),
    ...mapMutations('datePicker', ['setDateTime']),
    ...mapActions('TestInstrument', [
      'getTableData',
      'getPagination',
      'clearPagination',
      'deleteMeterSys'
    ]),
    initTestInsTable() {
      this.getTableData({})
    }
  },
  beforeDestroy() {
    this.setKeyword('')
    this.setDateTime('')
  }
}
</script>

<style lang="less" scoped></style>

<template>
  <div class="test-ins__container">
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChanges">
      <a-tab-pane
        v-for="tab in tabs"
        :key="tab.val"
        :tab="tab.key"
      ></a-tab-pane>
    </a-tabs>
    <Toolbar />
    <DataTable />
    <xNFCreateOrEdit :isEdit="editStatus" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { PackageMGTTabs } from './constant'
import Toolbar from './Toolbar'
import DataTable from './DataTable'
import xNFCreateOrEdit from './VnfpnfCreateOrEdit'
import Loading from '../../../components/Loading/Loading'

export default {
  name: 'VnfpnfSuite',
  components: {
    DataTable,
    Toolbar,
    xNFCreateOrEdit,
    Loading
  },
  data() {
    return {
      PackageMGTTabs,
      tabs: PackageMGTTabs,
      currentPage: 'VNF/PNFSuiteMGT'
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.VnfpnfSuite.tableData,
      pagination: state => state.VnfpnfSuite.pagination,
      SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
      editStatus: state => state.VnfpnfSuite.editStatus,
      loadingMessage: state => state.loading.loadingMessage,
      currentTab: state => state.VnfpnfSuite.currentTab,
      tableLoading: state => state.loading.tableLoading
    })
  },
  watch: {
    currentTab(val) {
      if (val) {
        this.getVNFOptions()
      }
    }
  },
  mounted() {
    this.initVnfPnfSuiteTable()
  },
  methods: {
    ...mapActions('VnfpnfSuite', ['getTableData', 'getVNFOptions']),
    ...mapMutations('VnfpnfSuite', ['changeTab']),
    ...mapMutations('searching', ['setKeyword']),
    ...mapMutations('datePicker', ['setDateTime']),
    initVnfPnfSuiteTable() {
      this.getVNFOptions()
      this.getTableData({})
    },
    handleTabsChanges(key) {
      this.setKeyword('')
      this.setDateTime('')
      this.changeTab(key)
      this.getTableData({})
    }
  },
  destroyed() {
    this.changeTab(101)
  }
}
</script>

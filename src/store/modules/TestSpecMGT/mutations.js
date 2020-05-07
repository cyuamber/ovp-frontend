import moment from 'moment'
import * as types from './mutations_types'

const mutations = {
  [types.updateTableData] (state, tableData) {
    state.pagination.total = tableData.total
    state.tableData = tableData.body.map((item, index) => {
      item.publishTime =
        item.publishTime !== null
          ? moment(item.publishTime).format('YYYY-MM-DD')
          : item.publishTime
      item.index = index
      item.caseMgt = []
      item.specpagination = { current: 1, total: 0, pageSize: 5 }
      item.action = ['Edit', 'Delete']
      return item
    })
  },
  [types.updatecaseMgtTableData] (state, { testCaseData, record }) {
    let index = record.index
    if (testCaseData.length > 0) {
      state.tableData[index].specpagination.total = testCaseData.length
      state.tableData[index].caseMgt = testCaseData.map(item => {
        item.action = 'activate'
        return item
      })
    }
  },
  [types.updateVNFTest] (state, testSpecSingleData) {
    state.testSpecSingleData = testSpecSingleData
  },
  [types.updateSUTOptions] (state, Options) {
    state.SUTOptions = Options
  },
  [types.updateVNFOptions] (state, Options) {
    state.VNFOptions = Options
  },
  [types.updateTestCaseList] (state, { list }) {
    state.testCaseList = []
    if (list) state.testCaseList = list
  },
  [types.changeCaseCheckAll] (state, bool) {
    state.testCaseCheckAll = bool
  },
  [types.updateCheckboxGroup] (state, { testCaseData }) {
    if (testCaseData) {
      state.initcheckboxGroup = testCaseData.map(item => {
        return item.id
      })
    } else {
      state.initcheckboxGroup = []
    }
    state.testCaseCheckAll =
      state.initcheckboxGroup.length === state.testCaseList.length
  },
  [types.updatePagination] (state, Options) {
    state.pagination = Options
  },
  [types.updateSpecPagination] (state, { pagination, index }) {
    state.tableData[index].specpagination = pagination
  },
  [types.updateTestCaseTableLoading] (state, testCasetableLoading) {
    state.testCasetableLoading = testCasetableLoading
  },
  [types.updateVisible] (state, bool) {
    state.visible = bool
  }
}

export default mutations
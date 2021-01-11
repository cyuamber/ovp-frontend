import moment from 'moment'
import * as types from './mutations_types'

const mutations = {
  [types.UPDATE_TABLE_DATA](state, tableData) {
    state.pagination.total = tableData.total
    state.tableData = tableData.body.map((item, index) => {
      item.publishTime =
        item.publishTime !== null
          ? moment(item.publishTime).format('YYYY-MM-DD')
          : item.publishTime
      item.index = index
      item.caseMgt = []
      item.specpagination = {
        current: 1,
        total: 0,
        pageSize: 5,
        size: 'small'
      }
      item.action = ['Edit', 'Delete']
      return item
    })
  },
  [types.UPDATE_CASEMGT_TABLE_DATA](state, { testCaseData, record }) {
    let index = record.index
    if (testCaseData.length > 0) {
      state.tableData[index].specpagination.total = testCaseData.length
      state.tableData[index].caseMgt = testCaseData.map(item => {
        item.action = 'activate'
        return item
      })
    }
  },
  [types.UPDATE_VNF_TEST](state, testSpecSingleData) {
    state.testSpecSingleData = testSpecSingleData
  },
  [types.UPDATE_SUT_OPTIONS](state, Options) {
    state.SUTOptions = Options
  },
  [types.UPDATE_VNF_OPTIONS](state, Options) {
    state.VNFOptions = Options
  },
  [types.UPDATE_TEST_CASE_LIST](state, { list }) {
    state.testCaseList = []
    if (list) state.testCaseList = list
  },
  [types.CHANGE_CASE_CHECK_ALL](state, bool) {
    state.testCaseCheckAll = bool
  },
  [types.UPDATE_CHECKBOX_GROUP](state, { testCaseData }) {
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
  [types.UPDATE_PAGINATION](state, Options) {
    state.pagination = Options
  },
  [types.UPDATE_SPEC_PAGINATION](state, { pagination, index }) {
    state.tableData[index].specpagination = pagination
  },
  [types.UPDATE_TEST_CASE_TABLE_LOADING](state, testCasetableLoading) {
    state.testCasetableLoading = testCasetableLoading
  },
  [types.UPDATE_VISIBLE](state, bool) {
    state.visible = bool
  },
  [types.UPDATE_EDIT](state, bool) {
    state.editStatus = bool
  }
}

export default mutations

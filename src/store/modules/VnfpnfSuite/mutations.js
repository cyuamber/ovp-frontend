import moment from 'moment'
import * as types from './mutations_types'

const mutations = {
  [types.updateTableData] (state, tableData) {
    state.pagination.total = tableData.total
    state.tableData = tableData.body.map((item, index) => {
      item.createTime =
        item.createTime !== null
          ? moment(item.createTime).format('YYYY-MM-DD')
          : item.createTime
      item.index =
        tableData.body.length * (state.pagination.current - 1) + index + 1
      item.action = ['Edit', 'Delete', 'Download']
      return item
    })
  },
  [types.updateVNFTest] (state, SuiteSingleData) {
    state.SuiteSingleData = SuiteSingleData
  },
  [types.updateVNFOptions] (state, Options) {
    state.VNFOptions = Options
  },
  [types.updateSystemOptions] (state, Options) {
    state.SystemOptions = Options
  },
  [types.updatePagination] (state, Options) {
    state.pagination = Options
  },
  [types.changeTab] (state, tab) {
    state.currentTab = tab
  },
  [types.updateToken] (state, source) {
    state.source = source
  },
  [types.updateVisible] (state, bool) {
    state.visible = bool
  }
}

export default mutations
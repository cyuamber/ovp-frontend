import moment from 'moment'
import * as types from './mutations_types'

const mutations = {
  [types.UPDATE_TABLE_DATA](state, res) {
    state.pagination = {
      current: state.pageNum,
      total: res.total
    }
    let data = res.body.map((item, index) => {
      item.action = ['Edit', 'Delete']
      item.index = res.body.length * (state.pagination.current - 1) + index + 1
      item.createTime =
        item.createTime !== null
          ? moment(item.createTime).format('YYYY-MM-DD')
          : item.createTime
      return item
    })
    if (state.currentTab === 'VIM ENV') {
      state.VIMTableData = data
    } else if (state.currentTab === 'VNFM ENV') {
      state.VNFMTableData = data
    } else if (state.currentTab === 'MANO ENV') {
      state.MANOTableData = data
    }
  },
  [types.CHANGE_TAB](state, tab) {
    state.currentTab = tab
  },
  [types.SET_FILTER_ITEM](state, { time, key, pageObj, isSearch, message }) {
    if (isSearch) {
      if (key === '' && state.createTime === '' && state.searchKeyword === '') {
        message.warning('Please enter valid search information')
        return
      }
    }
    if (time !== undefined) {
      state.createTime = time
      // Jump to the first page after adding search criteria
      if (state.pageNum !== 1) {
        state.pageNum = 1
      }
    } else if (key !== undefined) {
      state.searchKeyword = key
      // Jump to the first page after adding search criteria
      if (state.pageNum !== 1) {
        state.pageNum = 1
      }
    } else if (pageObj !== undefined) {
      state.pageNum = pageObj.current
      state.pageSize = pageObj.pageSize
    }
  },
  [types.UPDATE_VISIBLE](state, bool) {
    state.visible = bool
  },
  [types.UPDATE_REGION_ID_OPTIONS](state, { regionIdList }) {
    state.regionIdOptions = regionIdList
  },
  [types.UPDATE_CLOUD_TYPE_OPTIONS](state, { CloudTypeList }) {
    state.cloudTypeOptions = CloudTypeList
  },
  [types.SET_INIT_VALUES](state, values) {
    if (values.item !== 'Edit') {
      state.initValues = values
    } else {
      state.initValues = values.record
    }
  },
  [types.UPDATE_MANO_TYPE_OPTIONS](state, { CloudTypeList }) {
    state.MANOTypeOptions = CloudTypeList
  },
  [types.EDIT_STATUS](state, bool) {
    state.editStatus = bool
  }
}

export default mutations

import { axiosdelete, axiosget, axiospost, axiosput } from '../../../utils/http'
import API from '../../../const/apis'
import state from './state'
import * as types from './mutations_types'

const actions = {
  getTableData({ dispatch, commit }, obj) {
    let req = {
      pageNum: state.pagination.current,
      pageSize: state.pagination.pageSize
    }
    Object.keys(obj).forEach(item => {
      if (obj[item] !== '' && obj[item] !== undefined) {
        req[item] = obj[item]
      }
    })
    dispatch('loading/tableLoading', true, { root: true })
    axiosget(API.TestSpecMgt.specMgtTable, req).then(
      res => {
        commit(types.UPDATE_TABLE_DATA, res)
        dispatch('loading/tableLoading', false, { root: true })
        if (req.publishTime || req.testSpecName)
          dispatch(
            'loading/showLoading',
            { type: 'success', toast: 'Successfully get table data' },
            { root: true }
          )
      },
      () => {
        if (req.publishTime || req.testSpecName)
          dispatch(
            'loading/showLoading',
            { type: 'failed', toast: 'Network exception, please try again' },
            { root: true }
          )
      }
    )
  },
  getTestCaseTableData(
    { dispatch, commit, state },
    { record, expanded, editModelShow = false }
  ) {
    commit(types.UPDATE_TEST_CASE_TABLE_LOADING, true)
    state.dropdownSpec[record.index] = Object.assign({}, record)
    state.dropdownSpecIndex = record.index
    axiosget(API.TestSpecMgt.testCaseTable.replace(':specId', record.id)).then(
      res => {
        commit(types.UPDATE_CASEMGT_TABLE_DATA, {
          testCaseData: res.body,
          record
        })
        if (!expanded && editModelShow === true) {
          commit(types.UPDATE_CHECKBOX_GROUP, { testCaseData: res.body })
        }
        commit(types.UPDATE_TEST_CASE_TABLE_LOADING, false)
      },
      () => {
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        )
      }
    )
  },
  getTestSpec({ commit }, data) {
    commit(types.UPDATE_VNF_TEST, data)
  },
  getSUTOptions({ commit, dispatch }) {
    axiosget(API.TestSpecMgt.TestSpecSUTType).then(res => {
      commit(types.UPDATE_SUT_OPTIONS, res.body)
      dispatch('getVNFOptions', { SUTType: res.body[0].code })
    })
  },
  getVNFOptions({ commit }, obj) {
    let url = API.TestSpecMgt.TestSpecVNFType.replace(':flag', obj.SUTType)
    axiosget(url).then(res => {
      commit(types.UPDATE_VNF_OPTIONS, res.body)
    })
  },
  getTestCaseList(
    { dispatch, commit },
    { sutCode, subSutCode, testSpecSingleData, message }
  ) {
    // console.log(sutCode, subSutCode, '---sutCode, subSutCode')
    axiosget(
      API.TestSpecMgt.testCaseList
        .replace(':flag', sutCode)
        .replace(':subSutType', subSutCode)
    ).then(
      res => {
        commit(types.UPDATE_TEST_CASE_LIST, { list: res.body })
        if (Object.keys(testSpecSingleData).length > 0) {
          dispatch('getTestCaseTableData', {
            record: testSpecSingleData,
            expanded: false,
            editModelShow: true
          })
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },
  getPagination({ commit }, { pagination }) {
    commit(types.UPDATE_PAGINATION, pagination)
  },
  clearPagination({ commit }) {
    commit(types.UPDATE_PAGINATION, { current: 1, total: 0 })
  },
  getSpecPagination({ commit }, { pagination, index }) {
    commit(types.UPDATE_SPEC_PAGINATION, { pagination, index })
  },
  clearOptions({ commit }) {
    commit(types.UPDATE_VNF_OPTIONS, [])
    commit(types.UPDATE_TEST_CASE_LIST, [])
    commit(types.UPDATE_CHECKBOX_GROUP, { testCaseData: [] })
    commit(types.CHANGE_CASE_CHECK_ALL, false)
  },
  createOrEditTestSpec({ dispatch, state }, { isEdit, data }) {
    let url = isEdit
      ? API.TestSpecMgt.specMgtUpdate
      : API.TestSpecMgt.specMgtInsert
    let axiosType = isEdit ? axiosput : axiospost
    axiosType(url, data).then(
      () => {
        dispatch(
          'loading/showLoading',
          {
            type: 'success',
            toast: isEdit
              ? 'Successfully updated'
              : 'Has been added successfully'
          },
          { root: true }
        )
        let obj = {
          flag: state.currentTab,
          pageNum: state.pagination.current,
          pageSize: state.pagination.pageSize
        }
        dispatch('getTableData', obj)
      },
      () => {
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        )
      }
    )
  },
  deleteTestSpec({ dispatch, state }, { id }) {
    axiosdelete(API.TestSpecMgt.specMgtDelete.replace(':id', id)).then(
      () => {
        dispatch(
          'loading/showLoading',
          { type: 'success', toast: 'Deleted successfully' },
          { root: true }
        )
        let obj = {
          flag: state.currentTab,
          pageNum: state.pagination.current,
          pageSize: state.pagination.pageSize
        }
        dispatch('getTableData', obj)
      },
      () => {
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        )
      }
    )
  },
  activateTestCase({ dispatch, state }, { obj }) {
    axiosput(
      API.TestSpecMgt.specMgtCaseActivate
        .replace(':id', obj.id)
        .replace(':status', obj.status)
    ).then(
      () => {
        dispatch(
          'loading/showLoading',
          { type: 'success', toast: 'Update activation status successfully' },
          { root: true }
        )
        dispatch('getTestCaseTableData', {
          record: state.dropdownSpec[state.dropdownSpecIndex],
          expanded: true
        })
      },
      () => {
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        )
      }
    )
  }
}

export default actions

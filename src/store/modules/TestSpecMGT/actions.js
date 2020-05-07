import { axiosdelete, axiosget, axiospost, axiosput } from '../../../utils/http'
import API from '../../../const/apis'
import { axiosgetType } from '../../../const/constant'
import state from './state';
import * as types from './mutations_types';

const actions = {
  getTableData ({ dispatch, commit }, obj) {
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
    let axiosrequest = axiosgetType ? axiospost : axiosget
    axiosrequest(API.TestSpecMgt.specMgtTable, req).then(
      res => {
        if (res.code === 200) {
          commit(types.updateTableData, res)
          dispatch('loading/tableLoading', false, { root: true })
          if (req.publishTime || req.testSpecName)
            dispatch(
              'loading/showLoading',
              { type: 'success', toast: 'Successfully get table data' },
              { root: true }
            )
        } else {
          if (req.publishTime || req.testSpecName)
            dispatch(
              'loading/showLoading',
              { type: 'failed', toast: 'Network exception, please try again' },
              { root: true }
            )
        }
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
  getTestCaseTableData ({ dispatch, commit, state }, { record, expanded }) {
    commit(types.updateTestCaseTableLoading, true)
    state.dropdownSpec[record.index] = Object.assign({}, record)
    state.dropdownSpecIndex = record.index
    axiosget(API.TestSpecMgt.testCaseTable.replace(':specId', record.id)).then(
      res => {
        if (res.code === 200) {
          commit(types.updatecaseMgtTableData, { testCaseData: res.body, record })
          if (!expanded) {
            commit(types.updateCheckboxGroup, { testCaseData: res.body })
          }
          commit(types.updateTestCaseTableLoading, false)
        } else {
          dispatch(
            'loading/showLoading',
            { type: 'failed', toast: 'Network exception, please try again' },
            { root: true }
          )
        }
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
  getTestSpec ({ commit }, data) {
    commit(types.updateVNFTest, data)
  },
  getSUTOptions ({ commit, dispatch }) {
    axiosget(API.TestSpecMgt.TestSpecSUTType).then(res => {
      if (res.code === 200) {
        commit(types.updateSUTOptions, res.body)
        dispatch('getVNFOptions', { SUTType: res.body[0].code })
      } else {
        this.$message.error('Network exception, please try again')
      }
    })
  },
  getVNFOptions ({ commit }, obj) {
    let url = API.TestSpecMgt.TestSpecVNFType.replace(':flag', obj.SUTType)
    axiosget(url).then(res => {
      if (res.code === 200) {
        commit(types.updateVNFOptions, res.body)
      } else {
        this.$message.error('Network exception, please try again')
      }
    })
  },
  getTestCaseList (
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
        if (res.code === 200) {
          commit(types.updateTestCaseList, { list: res.body })
          if (Object.keys(testSpecSingleData).length > 0) {
            dispatch('getTestCaseTableData', {
              record: testSpecSingleData,
              expanded: false
            })
          }
        } else {
          message.error('Failed to get Test Case list')
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },
  getPagination ({ commit }, { pagination }) {
    commit(types.updatePagination, pagination)
  },
  clearPagination ({ commit }) {
    commit(types.updatePagination, { current: 1, total: 0 })
  },
  getSpecPagination ({ commit }, { pagination, index }) {
    commit(types.updateSpecPagination, { pagination, index })
  },
  clearOptions ({ commit }) {
    commit(types.updateVNFOptions, [])
    commit(types.updateTestCaseList, [])
    commit(types.updateCheckboxGroup, { testCaseData: [] })
    commit(types.changeCaseCheckAll, false)
  },
  createOrEditTestSpec ({ dispatch, state }, { isEdit, data }) {
    let url = isEdit
      ? API.TestSpecMgt.specMgtUpdate
      : API.TestSpecMgt.specMgtInsert
    let axiosType = isEdit ? axiosput : axiospost
    axiosType(url, data).then(
      res => {
        if (res.code === 200) {
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
        }
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
  deleteTestSpec ({ dispatch, state }, { id }) {
    axiosdelete(API.TestSpecMgt.specMgtDelete.replace(':id', id)).then(
      res => {
        if (res.code === 200) {
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
        }
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
  activateTestCase ({ dispatch, state }, { obj }) {
    axiosput(
      API.TestSpecMgt.specMgtCaseActivate
        .replace(':id', obj.id)
        .replace(':status', obj.status)
    ).then(
      res => {
        if (res.code === 200) {
          dispatch(
            'loading/showLoading',
            { type: 'success', toast: 'Update activation status successfully' },
            { root: true }
          )
          dispatch('getTestCaseTableData', {
            record: state.dropdownSpec[state.dropdownSpecIndex],
            expanded: true
          })
        }
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
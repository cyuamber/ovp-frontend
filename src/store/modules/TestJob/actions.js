import moment from 'moment'
import API from '../../../const/apis'
import util from '../../../utils/utils'
import router from '../../../router/router'
import { axiospost, axiosget, axiosput, axiosdelete } from '../../../utils/http'
import { axiosgetType } from '../../../const/constant'
import state from './state'
import * as types from './mutations_types'

const actions = {
  getTableData ({ dispatch, commit }, { bool, loading = true }) {
    let obj = { pageNum: state.pageNum, pageSize: state.pageSize }
    if (state.createTime !== '') obj.createTime = state.createTime
    if (state.searchKeyword !== 'All' && state.dashboardJumpStatus === 'All')
      obj.jobStatus = state.searchKeyword
    if (state.searchKeyword === 'All' && state.dashboardJumpStatus !== 'All')
      obj.jobStatus = state.dashboardJumpStatus
    let axiosrequest = axiosgetType ? axiospost : axiosget
    if (loading) dispatch('loading/tableLoading', true, { root: true })
    axiosrequest(API.testJobMgt.testJobTable, obj)
      .then(res => {
        if (loading) dispatch('loading/tableLoading', false, { root: true })
        if (res.code === 200) {
          state.pagination = {
            current: state.pageNum,
            total: res.total
          }
          let tableData = res.body.map((item, index) => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD')
            item.index =
              res.body.length * (state.pagination.current - 1) + index + 1
            item.actions = [
              item.status === 'RUNNING' ? 'Stop' : 'Start',
              'Edit',
              'Delete',
              'Download',
              'More'
            ]
            return item
          })
          commit(types.updateTableData, tableData)
        } else if (bool)
          dispatch(
            'loading/showLoading',
            { type: 'failed', toast: 'Network exception, please try again' },
            { root: true }
          )
      })
      .catch(() => {
        if (bool)
          dispatch(
            'loading/showLoading',
            { type: 'failed', toast: 'Network exception, please try again' },
            { root: true }
          )
      })
  },
  createrTestJobMGT (
    { dispatch, commit, state },
    { isEdit, values, caseReqs, message }
  ) {
    let body = {
      cronExpression: '',
      endpoint: '/portal/business/jobs/case/start',
      executionType: 'ONCE',
      fixedExecutionInterval: '0',
      fixedExecutionUnit: '',
      jobName: values.JobName,
      remark: values.JobDescription,
      // SUTType: values.SUTType,
      sutId: values.SUTName.split('+')[1],
      specId: values.TestSpecification,
      // createrTime: moment(new Date()).format('YYYY-MM-DD'),
      caseReqs: caseReqs
    }
    if (values.TestVIMENV) body.vimId = values.TestVIMENV
    if (values.TestVNFMENV) body.vnfmId = values.TestVNFMENV
    if (values.TestMANOENV) body.manoId = values.TestMANOENV
    if (values.TestInstrument) body.suiteId = values.TestInstrument
    let jobId = isEdit ? state.testJobSingleData.jobId : ''
    // if (isEdit) body.jobId = jobId;
    let url = isEdit
      ? API.testJobMgt.testJobUpdate.replace(':jobId', jobId)
      : API.testJobMgt.testJobInsert
    let axiosType = isEdit ? axiosput : axiospost
    axiosType(url, body)
      .then(
        res => {
          if (res.code === 200) {
            dispatch(
              'loading/showLoading',
              { type: 'success', toast: 'Has been added successfully' },
              { root: true }
            )
          } else
            dispatch(
              'loading/showLoading',
              { type: 'failed', toast: 'add failed' },
              { root: true }
            )
          commit(types.setIsShow, false)
          dispatch('getTableData', false)
        },
        () => {
          message.error('Network exception, please try again')
        }
      )
      .catch(() => {
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        )
      })
  },
  getSUTType ({ commit }, { message }) {
    commit(types.updataSUTType, {
      get: false,
      spin: true
    })
    axiosget(API.testJobMgt.testJobSUTType).then(
      res => {
        if (res.code === 200) {
          // Simulation request
          setTimeout(() => {
            commit(types.updataSUTType, {
              list: res.body
            })
          }, 1000)
        } else {
          message.error('Failed to get SUT Name list')
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },
  getSUTName ({ commit }, { SUTType, message }) {
    commit(types.updataSUTName, {
      get: false,
      spin: true
    })
    axiosget(API.testJobMgt.testJobSUTName.replace(':code', SUTType)).then(
      res => {
        if (res.code === 200) {
          // Simulation request
          setTimeout(() => {
            commit(types.updataSUTName, {
              get: true,
              spin: false,
              list: res.body
            })
          }, 1000)
        } else {
          message.error('Failed to get SUT Name list')
          commit(types.updataSUTName, {
            get: false,
            spin: false
          })
        }
      },
      () => {
        message.error('Network exception, please try again')
        commit(types.updataSUTName, {
          get: false,
          spin: false
        })
      }
    )
  },
  getSpecification ({ commit }, { SUTName, message }) {
    commit(types.updateSpecification, {
      get: false,
      spin: true
    })
    axiosget(API.testJobMgt.testJobSpec.replace(':type', SUTName)).then(
      res => {
        if (res.code === 200) {
          // Simulation request
          setTimeout(() => {
            commit(types.updateSpecification, {
              get: true,
              spin: false,
              list: res.body
            })
          }, 1000)
        } else {
          message.error('Failed to get Test Specification list')
          commit(types.updateSpecification, {
            get: false,
            spin: false
          })
        }
      },
      () => {
        message.error('Network exception, please try again')
        commit(types.updateSpecification, {
          get: false,
          spin: false
        })
      }
    )
  },
  getTestCase ({ commit }, { obj, message }) {
    console.log(obj, '======getTestCase')
    commit(types.updateTestCaseList, { spin: true })
    commit(types.updateFailDetail, '')
    axiosget(API.testJobMgt.testJobTestCase, obj).then(
      res => {
        if (res.code === 200) {
          commit(types.updateTestCaseList, { spin: false, list: res.body })
        } else {
          message.error('Failed to get Test Case list')
          commit(types.updateTestCaseList, { spin: false })
        }
      },
      () => {
        message.error('Network exception, please try again')
        commit(types.updateTestCaseList, {
          spin: false
        })
      }
    )
  },
  getTestFail ({ dispatch }, data) {
    axiosget(
      API.testJobMgt.testFailedDetail.replace(':requestId', data.requestId)
    )
      .then(res => {
        if (+res.code === 200) {
          let reason = JSON.stringify(res.body)
          util.pasteContent(reason)
          // commit('updateFailDetail', reason);
        } else {
          util.pasteContent('')
          dispatch(
            'loading/showLoading',
            { type: 'failed', toast: 'Get detail reason failed' },
            { root: true }
          )
        }
      })
      .catch(err => {
        console.warn(err)
      })
  },
  delete ({ dispatch }, { data }) {
    axiosdelete(
      API.testJobMgt.testJobDelete.replace(':jobId', data.jobId)
    ).then(
      res => {
        if (res.code === 200) {
          dispatch(
            'loading/showLoading',
            { type: 'success', toast: 'Deleted successfully' },
            { root: true }
          )
          dispatch('getTableData', false)
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
  download ({ dispatch }, data) {
    let url =
      API.testJobMgt.testJobDownLoad.replace(':jobId', data.jobId) +
      '?lang=' +
      data.lang
    window.open(window.location.protocol + '//' + window.location.host + url)
    dispatch(
      'loading/showLoading',
      { type: 'success', toast: 'DownLoad File successfully' },
      { root: true }
    )
  },
  runTestJobMGT ({ dispatch, commit }, { data }) {
    axiosput(API.testJobMgt.testJobStart.replace(':jobId', data.jobId)).then(
      res => {
        if (res.code === 200) {
          dispatch(
            'loading/showLoading',
            { type: 'success', toast: 'Successfully started testing' },
            { root: true }
          )
          data.status = 'RUNNING'
          data.jobStatus = 'STARTED'
          data.actions[0] = 'Stop'
          data.jobId = res.body.jobId
          data.executionStartTime = res.body.executionStartTime
          commit(types.updateTableItemData, data)
          router.push({
            name: 'JobDetail',
            query: {
              detail: JSON.stringify(data)
            }
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
  },
  getProgress ({ commit }, { jobId, message }) {
    axiosget(API.testJobMgt.testJobProgress.replace(':jobId', jobId)).then(
      res => {
        if (res.code === 200) {
          commit(types.updateProgress, {
            percent: res.body.jobProgress,
            status: res.body.jobStatus
          })
          // res.body.cases.map(item => {
          //    res.body.scheduleCases.map(items=>{
          //    	if(item.id === items.caseId){
          //            items.name = item.name
          // 		}
          // 	})
          // });
          commit(types.updateDetailTestCase, res.body.scheduleCases)
          let doneCaseNum = 0,
            failedCaseNum = 0
          if (res.body.scheduleCases && res.body.scheduleCases.length !== 0) {
            res.body.scheduleCases.forEach(item => {
              if (item.caseStatus === 'DONE') {
                doneCaseNum++
              } else if (item.caseStatus === 'FAILED') {
                failedCaseNum++
              }
            })
          }
          commit(types.updateTestCasePieData, { doneCaseNum, failedCaseNum })
          if (
            res.body.jobProgress !== null &&
            res.body.jobProgress !== undefined
          ) {
            commit(types.updateDetailLoading, false)
            commit(types.updateExecutionStartTime, res.body.executionStartTime)
          }
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },

  getTestJobCaseExecutions (
    { dispatch, commit },
    { record, expanded, message }
  ) {
    dispatch('loading/tableLoading', true, { root: true })
    axiosget(
      API.testJobMgt.testJobCaseExecutions.replace(
        ':requestId',
        record.requestId
      )
    ).then(
      res => {
        dispatch('loading/tableLoading', false, { root: true })
        if (Number(res.code) === 200) {
          if (res.body.length !== 0) {
            commit(types.updateExpandedRowKeys, { key: record.index, expanded })
            commit(types.updatecaseChildTableData, {
              testCaseChildData: res.body,
              record
            })
          } else {
            message.info('No child data under this test case.')
          }
        }
      },
      () => {
        commit('setTestCaseChildtableLoading', false)
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        )
      }
    )
  },

  stopJop ({ dispatch, commit }, { data }) {
    // Simulation request
    axiosput(API.testJobMgt.testJobStop.replace(':jobId', data.jobId)).then(
      res => {
        if (res.code === 200) {
          dispatch(
            'loading/showLoading',
            { type: 'success', toast: 'Successfully stoped testing' },
            { root: true }
          )
          data.status = 'STOPPED'
          data.actions[0] = 'Start'
          commit(types.updateTableItemData, data)
          dispatch('getTableData', true)
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
    dispatch('getTableData', true)
  },
  getVNFMOption ({ commit }, { message }) {
    axiosget(API.vimVnfmMgt.vnfmEnvMgtTable).then(
      res => {
        if (res.code === 200) {
          // Simulation request
          commit(types.updateVNFMOption, res.body)
        } else {
          message.error('Failed to get SUT Name list')
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },
  getVIMOption ({ commit }, { message }) {
    axiosget(API.vimVnfmMgt.vimEnvMgtTable).then(
      res => {
        if (res.code === 200) {
          // Simulation request
          commit(types.updateVIMOption, res.body)
        } else {
          message.error('Failed to get SUT Name list')
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },
  getMANOOption ({ commit }, { message, pageSize }) {
    let obj = { pageSize: pageSize }
    axiosget(API.vimVnfmMgt.manoEnvMgtTable, obj).then(
      res => {
        if (res.code === 200) {
          // Simulation request
          commit(types.updateMANOOption, res.body)
        } else {
          message.error('Failed to get SUT Name list')
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },
  getTestInstrumentOption ({ commit }, { message, pageSize }) {
    let obj = {
      pageSize: pageSize,
      flag: 101
    }
    axiosget(API.suiteMgt.suiteMgtTable, obj).then(
      res => {
        if (res.code === 200) {
          // Simulation request
          commit(types.updateTestInstrumentOption, res.body)
        } else {
          message.error('Failed to get SUT Name list')
        }
      },
      () => {
        message.error('Network exception, please try again')
      }
    )
  },
  getEditTestJob ({ dispatch, commit }, { data }) {
    axiosget(API.testJobMgt.testJobProgress.replace(':jobId', data.jobId)).then(
      res => {
        if (res.code === 200) {
          commit(types.updateTestJobSingleData, res.body)
          if (Object.keys(res.body).length > 0) {
            let checkedboxGroup = res.body.cases.map(item => {
              return item.id
            })
            commit(types.updateInitcheckboxGroup, checkedboxGroup)
          }
          let obj = {
            specId: res.body.spec.id,
            sutId: res.body.sut.id
          }
          dispatch('getTestCase', { obj, message: this.$message })
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
  jobVNFCsarsUplaod ({ dispatch }, { jobId, sutvalidLind, confirm }) {
    dispatch(
      'loading/showLoading',
      { type: 'success', toast: '', toastOpen: false },
      { root: true }
    )
    let updata = () => {
      confirm({
        title: 'Do you need to upload this file again?',
        content: 'jobId: ' + jobId,
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          dispatch('jobCaseVNFReupload', { jobId, sutvalidLind })
        }
      })
    }
    axiospost(
      API.testJobMgt.testJobCaseVNFUplaod.replace(':jobId', jobId),
      null,
      null,
      updata
    ).then(
      res => {
        if (res.code === 200) {
          dispatch(
            'loading/showLoading',
            { type: 'success', toast: '', toastOpen: false },
            { root: true }
          )
          window.open(sutvalidLind, '_blank')
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
  jobCaseVNFReupload ({ dispatch }, { jobId, sutvalidLind }) {
    dispatch(
      'loading/showLoading',
      { type: 'success', toast: '', toastOpen: false },
      { root: true }
    )
    axiospost(
      API.testJobMgt.testJobCaseVNFReupload.replace(':jobId', jobId)
    ).then(
      res => {
        if (res.code === 200) {
          window.open(sutvalidLind, '_blank')
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
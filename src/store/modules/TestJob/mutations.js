import * as types from './mutations_types'

const mutations = {
  [types.setIsShow] (state, bool) {
    state.isShow = bool
  },
  [types.setCaseParamsIsShow] (state, bool) {
    state.caseParamsIsShow = bool
  },
  [types.updateExpandedRowKeys] (state, { key, expanded }) {
    if (expanded) {
      if (state.expandedRowKeys.indexOf(key) > -1) {
        let index = state.expandedRowKeys.indexOf(key)
        state.expandedRowKeys.splice(index, 1)
      }
      state.expandedRowKeys.push(key)
    } else {
      state.expandedRowKeys.splice(key, 1)
    }
  },
  [types.updateDetailLoading] (state, detailLoading) {
    state.detailLoading = detailLoading
  },
  [types.updataSUTType] (state, { list }) {
    if (list) {
      state.SUTTypeList = list
    } else {
      state.getSpecification = false
      state.specificationSpin = false
      state.SUTNameList = []
      state.specificationList = []
      state.testCaseList = []
    }
  },
  [types.updataSUTName] (state, { get, spin, list }) {
    state.getSUTName = get
    state.nameSpin = spin
    if (list) {
      state.SUTNameList = list
    } else {
      state.getSpecification = false
      state.specificationSpin = false
      state.specificationList = []
      state.testCaseList = []
    }
  },
  [types.updateFailDetail] (state, detail) {
    state.testFailDetail = detail
  },
  [types.updateSpecification] (state, { get, spin, list }) {
    state.getSpecification = get
    state.specificationSpin = spin
    if (list) {
      state.specificationList = list
    } else {
      state.testCaseList = []
    }
  },
  [types.updateTestCaseList] (state, { spin, list }) {
    state.testCaseSpin = spin
    if (list) {
      state.testCaseList = list
    }
    state.testCaseCheckAll =
      state.initcheckboxGroup.length === state.testCaseList.length
  },
  [types.clean] (state) {
    state.getSUTName = false
    state.SUTNameList = []
    state.specificationList = []
    state.getSpecification = false
    state.specificationSpin = false
    state.testCaseList = []
    state.testCaseSpin = false
    state.testJobSingleData = {}
    state.initcheckboxGroup = []
    state.VNFMOption = []
    state.VIMOption = []
    state.MANOOption = []
    state.TestInstrumentOption = []
  },
  [types.clearexpandedRowKeys] (state) {
    state.expandedRowKeys = []
  },
  [types.updateTableData] (state, tableData) {
    state.tableData = tableData
  },
  [types.updateProgress] (state, { percent, status }) {
    state.percent = percent
    state.statusText = status
  },
  [types.changeComponent] (state, bool) {
    state.isJobDetail = bool
  },
  [types.changeCaseCheckAll] (state, bool) {
    state.testCaseCheckAll = bool
  },
  [types.setFilter] (state, { time, key, pageObj }) {
    if (time !== undefined) {
      state.createTime = time
      if (state.pageNum !== 1) {
        state.pageNum = 1
      }
    }
    if (key !== 'All') {
      state.searchKeyword = key
      state.dashboardJumpStatus = 'All'
      if (state.pageNum !== 1) {
        state.pageNum = 1
      }
    }
    if (pageObj !== undefined) {
      state.pageNum = pageObj.current
      state.pageSize = pageObj.pageSize
    }
  },
  [types.updateTableItemData] (state, data) {
    let index = data.index - 1
    state.tableData.splice(index, 1, data)
  },
  [types.updateDetailTestCase] (state, detailTestCase) {
    state.detailTestCase = detailTestCase.map((item, index) => {
      item.index = index
      return item
    })
  },
  [types.updateVNFMOption] (state, options) {
    state.VNFMOption = options
  },
  [types.updateVIMOption] (state, options) {
    state.VIMOption = options
  },
  [types.updateMANOOption] (state, options) {
    state.MANOOption = options
  },
  [types.updateTestInstrumentOption] (state, options) {
    state.TestInstrumentOption = options
  },
  [types.updateExecutionStartTime] (state, options) {
    state.executionStartTime = options
  },
  [types.updateTestCasePieData] (state, { doneCaseNum, failedCaseNum }) {
    state.testCasePieData[0].y = doneCaseNum
    state.testCasePieData[1].y = failedCaseNum
  },
  [types.updateTestJobSingleData] (state, data) {
    state.testJobSingleData = data
  },
  [types.updateDashboardJumpStatus] (state, data) {
    state.dashboardJumpStatus = data
  },
  [types.clearSearchKeyword] (state, data) {
    state.searchKeyword = data
  },
  [types.updateInitcheckboxGroup] (state, data) {
    state.initcheckboxGroup = data
  },
  [types.updateCaseParamsData] (state, data) {
    state.caseParamsData = data
  },
  [types.updatecaseChildTableData] (state, { testCaseChildData, record }) {
    let index = record.index
    state.detailTestCase[index].caseMgt = testCaseChildData
  }
}

export  default mutations

import * as types from './mutations_types';

const mutations = {
  [types.SET_IS_SHOW] (state, bool) {
    state.isShow = bool;
  },
  [types.SET_CASE_PARAMS_IS_SHOW] (state, bool) {
    state.caseParamsIsShow = bool;
  },
  [types.UPDATE_EXPANDED_ROW_KEYS] (state, { key, expanded }) {
    if (expanded) {
      if (state.expandedRowKeys.indexOf(key) > -1) {
        let index = state.expandedRowKeys.indexOf(key);
        state.expandedRowKeys.splice(index, 1);
      }
      state.expandedRowKeys.push(key);
    } else {
      state.expandedRowKeys.splice(state.expandedRowKeys.indexOf(key), 1);
      state.expandedRowKeys = [...state.expandedRowKeys]
    }
  },
  [types.UPDATE_DETAIL_LOADING] (state, detailLoading) {
    state.detailLoading = detailLoading;
  },
  [types.UPDATA_SUT_TYPE] (state, { list }) {
    if (list) {
      state.SUTTypeList = list;
    } else {
      state.getSpecification = false;
      state.specificationSpin = false;
      state.SUTNameList = [];
      state.specificationList = [];
      state.testCaseList = [];
    }
  },
  [types.UPDATA_SUT_NAME] (state, { get, spin, list }) {
    state.getSUTName = get;
    state.nameSpin = spin;
    if (list) {
      state.SUTNameList = list;
    } else {
      state.getSpecification = false;
      state.specificationSpin = false;
      state.specificationList = [];
      state.testCaseList = [];
    }
  },
  [types.UPDATE_FAIL_DETAIL] (state, detail) {
    state.testFailDetail = detail;
  },
  [types.UPDATE_SPECIFICATION] (state, { get, spin, list }) {
    state.getSpecification = get;
    state.specificationSpin = spin;
    if (list) {
      state.specificationList = list;
    } else {
      state.testCaseList = [];
    }
  },
  [types.UPDATE_TEST_CASE_LIST] (state, { spin, list }) {
    state.testCaseSpin = spin;
    if (list) {
      state.testCaseList = list;
    }
    state.testCaseCheckAll =
      state.initcheckboxGroup.length === state.testCaseList.length;
  },
  [types.CLEAN] (state) {
    state.getSUTName = false;
    state.SUTNameList = [];
    state.specificationList = [];
    state.getSpecification = false;
    state.specificationSpin = false;
    state.testCaseList = [];
    state.testCaseSpin = false;
    state.testJobSingleData = {};
    state.initcheckboxGroup = [];
    state.VNFMOption = [];
    state.VIMOption = [];
    state.MANOOption = [];
    state.TestInstrumentOption = [];
  },
  [types.CLEAR_EXPANDED_ROW_KEYS] (state) {
    state.expandedRowKeys = [];
  },
  [types.UPDATE_TABLE_DATA] (state, tableData) {
    state.tableData = tableData;
  },
  [types.UPDATE_PROGRESS] (state, { percent, status }) {
    state.percent = percent;
    state.statusText = status;
  },
  [types.CHANGE_COMPONENT] (state, bool) {
    state.isJobDetail = bool;
  },
  [types.CHANGE_CASE_CHECK_ALL] (state, bool) {
    state.testCaseCheckAll = bool;
  },
  [types.SET_FILTER] (state, { time, key, pageObj }) {
    if (time !== undefined) {
      state.createTime = time;
      if (state.pageNum !== 1) {
        state.pageNum = 1;
      }
    }
    if (key !== 'All') {
      state.searchKeyword = key;
      state.dashboardJumpStatus = 'All';
      if (state.pageNum !== 1) {
        state.pageNum = 1;
      }
    }
    if (pageObj !== undefined) {
      state.pageNum = pageObj.current;
      state.pageSize = pageObj.pageSize;
    }
  },
  [types.UPDATE_TABLE_ITEM_DATA] (state, data) {
    let index = data.index - 1;
    state.tableData.splice(index, 1, data);
  },
  [types.UPDATE_DETAIL_TEST_CASE] (state, detailTestCase) {
    state.detailTestCase = detailTestCase.map((item, index) => {
      item.index = index;
      return item;
    });
  },
  [types.UPDATE_VNFM_OPTION] (state, options) {
    state.VNFMOption = options;
  },
  [types.UPDATE_VIM_OPTION] (state, options) {
    state.VIMOption = options;
  },
  [types.UPDATE_MANO_OPTION] (state, options) {
    state.MANOOption = options;
  },
  [types.UPDATE_TEST_INSTRUMENT_OPTION] (state, options) {
    state.TestInstrumentOption = options;
  },
  [types.UPDATE_EXECUTION_START_TIME] (state, options) {
    state.executionStartTime = options;
  },
  [types.UPDATE_TEST_CASE_PIE_DATA] (state, { doneCaseNum, failedCaseNum }) {
    state.testCasePieData[0].y = doneCaseNum;
    state.testCasePieData[1].y = failedCaseNum;
  },
  [types.UPDATE_TESTJOB_SINGLE_DATA] (state, data) {
    state.testJobSingleData = data;
  },
  [types.UPDATE_DASHBOARD_JUMP_STATUS] (state, data) {
    state.dashboardJumpStatus = data;
  },
  [types.CLEAR_SEARCH_KEYWORD] (state, data) {
    state.searchKeyword = data;
  },
  [types.UPDATE_INIT_CHECKBOX_GROUP] (state, data) {
    state.initcheckboxGroup = data;
  },
  [types.UPDATE_CASE_PARAMS_DATA] (state, data) {
    state.caseParamsData = data;
  },
  [types.UPDATE_CASE_CHILD_TABLE_DATA] (state, { testCaseChildData, record }) {
    let index = record.index;
    state.detailTestCase[index].caseMgt = testCaseChildData;
  },
  [types.UPDATE_EDIT](state, bool) {
      state.editStatus = bool;
  }
};

export  default mutations;

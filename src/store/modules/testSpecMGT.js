import {axiosdelete, axiosget, axiospost, axiosput} from '../../utils/http';
import API from '../../const/apis';
import moment from 'moment';
import { axiosgetType } from "../../const/constant";

const state = {
  tableData: [
      {
          caseMgt:[]
      }
  ],
  tableLoading: false,
    testCasetableLoading: false,
  visible: false,
  SUTOptions: [],
  VNFOptions: [],
    testCaseList:[],
  testSpecSingleData: {},
    initcheckboxGroup:[],
    dropdownSpec:[],
    dropdownSpecIndex:0,
  pagination: { current: 1, total: 0, pageSize: 10 },
  loadingMessage: { type: '', toast: '' }
}
const mutations = {
  updateTableData(state, tableData) {
    state.pagination.total = tableData.total;
    state.tableData = tableData.body.map((item, index) => {
      item.publishTime = moment(item.publishTime).format('YYYY-MM-DD');
      item.index = tableData.body.length * (state.pagination.current - 1) + index;
      item.caseMgt = [];
      item.action = ['Edit', 'Delete'];
      return item
    })
  },
  updatecaseMgtTableData(state, {testCaseData,record}) {
    let index = record.index;
    state.tableData[index].caseMgt = testCaseData.map((item) => {
        item.action = 'activate';
        return item
    });
  },
  updateVNFTest(state, testSpecSingleData) {
    state.testSpecSingleData = testSpecSingleData;
      console.log(state.testSpecSingleData,"state.testSpecSingleData")
  },
  updateSUTOptions(state, Options) {
    state.SUTOptions = Options;
  },
  updateVNFOptions(state, Options) {
    state.VNFOptions = Options;
  },
    updateTestCaseList(state, { list }) {
        if (list) state.testCaseList = list
    },
    updateCheckboxGroup(state, {testCaseData}){
        state.initcheckboxGroup = testCaseData.map((item) => {
           return item.id
        });
    },
  updatePagination(state, Options) {
    state.pagination = Options;
  },
  updateFailedMessage(state, toast) {
    state.loadingMessage = {
      type: 'failed',
      toast
    }
  },
  updateSuccessMessage(state, toast) {
    state.loadingMessage = {
      type: 'success',
      toast
    }
  },
  updateTableLoading(state, tableLoading) {
    state.tableLoading = tableLoading
  },
    updateTestCaseTableLoading(state, testCasetableLoading) {
        state.testCasetableLoading = testCasetableLoading
    },
  updateVisible(state, bool) {
      state.visible = bool
  },
}
const actions = {
  getTableData({ commit }, obj) {
    let req = { pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
    Object.keys(obj).forEach(item => {
      if (obj[item] !== '' && obj[item] !== undefined) {
        req[item] = obj[item];
      }
    });
    commit('updateTableLoading', true);
    let axiosrequest = axiosgetType ? axiospost : axiosget;
    axiosrequest(API.TestSpecMgt.specMgtTable, req).then(res => {
      if (res.code === 200) {
        commit('updateTableData', res);
        commit('updateTableLoading', false);
        if (req.publishTime || req.testSpecName) commit('updateSuccessMessage', 'Successfully get table data')
      } else {
        if (req.publishTime || req.testSpecName) commit('updateFailedMessage', 'Network exception, please try again')
      }
    },
      () => {
        if (req.publishTime || req.testSpecName) commit('updateFailedMessage', 'Network exception, please try again')
      }
    )
  },
  getTestCaseTableData({ commit,state }, record){
      commit('updateTestCaseTableLoading', true);
      state.dropdownSpec[record.index] = Object.assign({},record);
      state.dropdownSpecIndex = record.index;
      axiosget(API.TestSpecMgt.testCaseTable.replace(":specId",record.id)).then(res => {
              if (res.code === 200) {
                  commit('updatecaseMgtTableData', {testCaseData:res.body,record});
                  commit('updateCheckboxGroup', {testCaseData:res.body});
                  commit('updateTestCaseTableLoading', false);
              } else {
                  commit('updateFailedMessage', 'Network exception, please try again')
              }
          },
          () => {
              commit('updateFailedMessage', 'Network exception, please try again')
          }
      )
  },
  getTestSpec({ commit }, data) {
    commit('updateVNFTest', data)
  },
  getSUTOptions({ commit, dispatch }) {
    axiosget(API.TestSpecMgt.TestSpecSUTType).then(res => {
      if (res.code === 200) {
        commit('updateSUTOptions', res.body);
        dispatch('getVNFOptions', { STUType: res.body[0].code })
      } else {
        this.$message.error('Network exception, please try again');
      }
    })
  },
  getVNFOptions({ commit }, obj) {
    let url = API.TestSpecMgt.TestSpecVNFType.replace(":flag", obj.STUType);
    axiosget(url).then(res => {
      if (res.code === 200) {
        commit('updateVNFOptions', res.body)
      } else {
        this.$message.error('Network exception, please try again');
      }
    })
  },
    getTestCaseList({ commit },{sutCode,subSutCode,message}){
        axiosget(API.TestSpecMgt.testCaseList.replace(":flag", sutCode).replace(":subSutType", subSutCode)).then(res => {
            if (res.code === 200) {
                commit('updateTestCaseList', {list: res.body})
            } else {
                message.error('Failed to get Test Case list')
            }
        }, () => {
            message.error('Network exception, please try again')
        })
    },
  getPagination({ commit }, { pagination }) {
    commit('updatePagination', pagination)
  },
  clearPagination({ commit }) {
    commit('updatePagination', { current: 1, total: 0 })
  },
  clearOptions({ commit }) {
    commit('updateVNFOptions', []);
    commit('updateTestCaseList', []);
  },
  createOrEditTestSpec({ commit, dispatch, state }, { isEdit, data }) {
    let url = isEdit ? API.TestSpecMgt.specMgtUpdate : API.TestSpecMgt.specMgtInsert;
    let axiosType = isEdit ? axiosput : axiospost;
    axiosType(url, data)
      .then((res) => {
        if (res.code === 200) {
          commit('updateSuccessMessage', isEdit ? 'Successfully updated' : 'Has been added successfully');
          let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
          dispatch('getTableData', obj)
        } else commit('updateFailedMessage', isEdit ? 'Update failed' : 'add failed')
      },
        () => {
          commit('updateFailedMessage', 'Network exception, please try again')
        })
  },
  deleteTestSpec({ commit, dispatch, state }, id) {
    axiosdelete(API.TestSpecMgt.specMgtDelete.replace("id", id)).then(res => {
      if (res.code === 200) {
        commit('updateSuccessMessage', 'Deleted successfully');
        let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
        dispatch('getTableData', obj)
      } else commit('updateFailedMessage', 'Network exception, please try again')
    })
  },
    activateTestCase({ commit, dispatch, state }, obj){
        axiosput(API.TestSpecMgt.specMgtCaseActivate.replace(":id", obj.id).replace(":status", obj.status)).then(res => {
            if (res.code === 200) {
                commit('updateSuccessMessage', 'Deleted successfully');
                dispatch('getTestCaseTableData', state.dropdownSpec[state.dropdownSpecIndex])
            } else commit('updateFailedMessage', 'Network exception, please try again')
        })
    }
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
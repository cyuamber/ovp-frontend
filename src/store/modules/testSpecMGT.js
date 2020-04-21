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
    testCaseCheckAll: false,
    initcheckboxGroup:[],
    dropdownSpec:[],
    dropdownSpecIndex:0,
  pagination: { current: 1, total: 0, pageSize: 10 },
// specpagination:{ current: 1, total: 0, pageSize: 5 },
}
const mutations = {
  updateTableData(state, tableData) {
    state.pagination.total = tableData.total;
    state.tableData = tableData.body.map((item, index) => {
      item.publishTime = item.publishTime !== null ? moment(item.publishTime).format('YYYY-MM-DD'):item.publishTime;
      item.index = index;
      item.caseMgt = [];
      item.specpagination = { current: 1, total: 0, pageSize: 5 };
      item.action = ['Edit', 'Delete'];
      return item
    })
  },
  updatecaseMgtTableData(state, {testCaseData,record}) {
    let index = record.index;
    if(testCaseData.length > 0){
        state.tableData[index].specpagination.total = testCaseData.length;
        state.tableData[index].caseMgt = testCaseData.map((item) => {
            item.action = 'activate';
            return item
        });
    }
  },
  updateVNFTest(state, testSpecSingleData) {
    state.testSpecSingleData = testSpecSingleData;
  },
  updateSUTOptions(state, Options) {
    state.SUTOptions = Options;
  },
  updateVNFOptions(state, Options) {
    state.VNFOptions = Options;
  },
    updateTestCaseList(state, { list }) {
        state.testCaseList = [];
        if (list) state.testCaseList = list
    },
    changeCaseCheckAll(state, bool) {
        state.testCaseCheckAll = bool
    },
    updateCheckboxGroup(state, {testCaseData}){
        if(testCaseData){
            state.initcheckboxGroup = testCaseData.map((item) => {
                return item.id
            })
        }else {
            state.initcheckboxGroup = [];
        }
        state.testCaseCheckAll = state.initcheckboxGroup.length === state.testCaseList.length
    }
    ,
  updatePagination(state, Options) {
    state.pagination = Options;
  },
    updateSpecPagination(state, {pagination,index}) {
        console.log(pagination,index,"updateSpecPagination")
        state.tableData[index].specpagination = pagination;
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
  getTableData({ dispatch, commit }, obj) {
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
        if (req.publishTime || req.testSpecName) dispatch('loading/showLoading', { type: 'success', toast: 'Successfully get table data' }, { root: true })
      } else {
        if (req.publishTime || req.testSpecName) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
      }
    },
      () => {
        if (req.publishTime || req.testSpecName) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
      }
    )
  },
  getTestCaseTableData({ dispatch, commit,state }, {record,expanded}){
      commit('updateTestCaseTableLoading', true);
      state.dropdownSpec[record.index] = Object.assign({},record);
      state.dropdownSpecIndex = record.index;
      axiosget(API.TestSpecMgt.testCaseTable.replace(":specId",record.id)).then(res => {
              if (res.code === 200) {
                  commit('updatecaseMgtTableData', {testCaseData:res.body,record});
                    if(!expanded){
                        commit('updateCheckboxGroup', {testCaseData:res.body});
                    }
                  commit('updateTestCaseTableLoading', false);
              } else {
                  dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })              }
          },
          () => {
              dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })          }
      )
  },
  getTestSpec({ commit }, data) {
    commit('updateVNFTest', data)
  },
  getSUTOptions({ commit, dispatch }) {
    axiosget(API.TestSpecMgt.TestSpecSUTType).then(res => {
      if (res.code === 200) {
        commit('updateSUTOptions', res.body);
        dispatch('getVNFOptions', { SUTType: res.body[0].code })
      } else {
        this.$message.error('Network exception, please try again');
      }
    })
  },
  getVNFOptions({ commit }, obj) {
    let url = API.TestSpecMgt.TestSpecVNFType.replace(":flag", obj.SUTType);
    axiosget(url).then(res => {
      if (res.code === 200) {
        commit('updateVNFOptions', res.body)
      } else {
        this.$message.error('Network exception, please try again');
      }
    })
  },
    getTestCaseList({ dispatch, commit },{sutCode, subSutCode, testSpecSingleData, message}){
      console.log(sutCode, subSutCode,"---sutCode, subSutCode")
        axiosget(API.TestSpecMgt.testCaseList.replace(":flag", sutCode).replace(":subSutType", subSutCode)).then(res => {
            if (res.code === 200) {
                commit('updateTestCaseList', {list: res.body});
                if(Object.keys(testSpecSingleData).length > 0){
                    dispatch('getTestCaseTableData', {record:testSpecSingleData,expanded: false})
                }
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
    getSpecPagination({ commit }, { pagination,index }) {
      console.log(pagination,index,"getSpecPagination")
        commit('updateSpecPagination', {pagination,index})
    },
  clearOptions({ commit }) {
    commit('updateVNFOptions', []);
    commit('updateTestCaseList', []);
    commit('updateCheckboxGroup', {testCaseData:[]});
    commit('changeCaseCheckAll', false);
  },
  createOrEditTestSpec({ commit, dispatch, state }, { isEdit, data, message }) {
    let url = isEdit ? API.TestSpecMgt.specMgtUpdate : API.TestSpecMgt.specMgtInsert;
    let axiosType = isEdit ? axiosput : axiospost;
    axiosType(url, data)
      .then((res) => {
        if (res.code === 200) {
            dispatch('loading/showLoading', { type: 'success', toast: isEdit ? 'Successfully updated' : 'Has been added successfully' }, { root: true })
          let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
          dispatch('getTableData', obj)
        }else if(res.code === 417){
            message.error(res.body)
        } else dispatch('loading/showLoading', { type: 'failed', toast: isEdit ? 'Update failed' : 'add failed' }, { root: true })
      },
        () => {
            dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
      })
  },
  deleteTestSpec({ commit, dispatch, state }, {id, message}) {
    axiosdelete(API.TestSpecMgt.specMgtDelete.replace(":id", id)).then(res => {
      if (res.code === 200) {
          dispatch('loading/showLoading', { type: 'success', toast: 'Deleted successfully' }, { root: true });
        let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
        dispatch('getTableData', obj)
      }else if(res.code === 417){
          message.error(res.body)
      }else dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
    })
  },
    activateTestCase({ commit, dispatch, state }, {obj, message}){
        axiosput(API.TestSpecMgt.specMgtCaseActivate.replace(":id", obj.id).replace(":status", obj.status)).then(res => {
            if (res.code === 200) {
                dispatch('loading/showLoading', { type: 'success', toast: 'Update activation status successfully' }, { root: true });
                dispatch('getTestCaseTableData', {record:state.dropdownSpec[state.dropdownSpecIndex],expanded:true})
            }else if(res.code === 417){
                message.error(res.body)
            } else dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
        })
    }
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
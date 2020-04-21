import {axiosdelete, axiosget, axiospost, axiosput} from '../../utils/http';
import API from '../../const/apis';
import { axiosgetType } from "../../const/constant";

import moment from 'moment';

const state = {
  tableData: [],
  singleData: {},
  tableLoading: false,
  pagination: { current: 1, total: 0 }
};
const mutations = {
  updateTableData(state, tableData) {
    state.pagination.total = tableData.total;
    state.tableData = tableData.body.map((item, index) => {
        item.createTime = item.createTime!==null?moment(item.createTime).format('YYYY-MM-DD'):item.createTime;
      item.index = tableData.body.length * (state.pagination.current - 1) + index + 1;
      item.action = ['Edit', 'Delete'];
      return item
    })
  },
  updateMeterSys(state, singleData) {
    state.singleData = singleData
  },
  updatePagination(state, Options) {
    state.pagination = Options;
  },
  updateTableLoading(state, tableLoading) {
    state.tableLoading = tableLoading
  },
};
const actions = {
  getTableData({ dispatch, commit }, obj) {
    let req = {};
    Object.keys(obj).forEach(item => {
      if (obj[item] !== '' && obj[item] !== undefined) {
        req[item] = obj[item];
      }
    });
    commit('updateTableLoading', true);
    let axiosrequest = axiosgetType ? axiospost : axiosget;
    axiosrequest(API.instrumentMgs.instrumentMgsTable, req).then(res => {
      if (res.code === 200) {
        commit('updateTableData', res);
        commit('updateTableLoading', false);
        if (req.createTime || req.name) {
            dispatch('loading/showLoading', { type: 'success', toast: 'Successfully get table data' }, { root: true })
        }
      } else {
        if (req.createTime || req.name) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
      }
    },
      () => {
        if (req.createTime || req.name) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
      }
    )
  },
  getMeterSys({ commit }, data) {
    commit('updateMeterSys', data)
  },
  getPagination({ commit }, { pagination }) {
    commit('updatePagination', pagination)
  },
  clearPagination({ commit }) {
    commit('updatePagination', { current: 1, total: 0 })
  },
  createOrEditTestIns({ dispatch }, { isEdit, data, message }) {
    let url = isEdit ? API.instrumentMgs.instrumentMgsUpdate : API.instrumentMgs.instrumentMgsInsert;
    let axiosType = isEdit ? axiosput : axiospost;
    axiosType(url, data)
      .then((res) => {
        if (res.code === 200) {
            dispatch('loading/showLoading', { type: 'success', toast: isEdit ? 'Successfully updated' : 'Has been added successfully' }, { root: true });
          dispatch('getTableData', {})
        }else if(res.code === 417){
            message.error(res.body)
        } else dispatch('loading/showLoading', { type: 'failed', toast: isEdit ? 'Update failed' : 'add failed' }, { root: true })
      },
        () => {
            dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
        })
  },
  deleteMeterSys({ dispatch }, {id, message}) {
    axiosdelete(API.instrumentMgs.instrumentMgsDelete.replace(":id", id)).then(res => {
      if (res.code === 200) {
        dispatch('loading/showLoading', { type: 'success', toast: 'Deleted successfully' }, { root: true });
        dispatch('getTableData', {})
      }else if(res.code === 417){
          message.error(res.body)
      } else dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
    }, () => {
        message.error('Network exception, please try again')
    })
  }

}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
import {axiosget, axiospost, axiosput} from '../../utils/http';
import API from '../../const/apis';
import { axiosgetType } from "../../const/constant";

import moment from 'moment';

const state = {
  tableData: [],
  singleData: {},
  pagination: {current: 1 , total: 0},
    loadingMessage: {type: '', toast: ''}
};
const mutations = {
  updateTableData (state,tableData) {
      state.pagination.total = tableData.total;
    state.tableData = tableData.body.map( (item, index) => {
      item.createTime = moment(item.createTime).format('YYYY-MM-DD');
      item.index = tableData.body.length * (state.pagination.current -1) + index+1;
      item.action = ['Edit', 'Delete'];
      return item
    })
  },
  updateMeterSys (state, singleData){
    state.singleData = singleData
  },
    updatePagination(state, Options){
    state.pagination = Options;
    },
    updateFailedMessage(state,toast){
        state.loadingMessage = {
            type: 'failed',
            toast
        }
    },
    updateSuccessMessage(state,toast){
        state.loadingMessage = {
            type: 'success',
            toast
        }
    },
};
const actions = {
  getTableData ({commit}, obj){
    let req = {};
      Object.keys(obj).forEach(item =>{
          if(obj[item] !== '' &&obj[item] !== undefined ){
              req[item]=obj[item];
          }
      });
      let axiosrequest = axiosgetType?axiospost:axiosget;
      axiosrequest(API.instrumentMgs.instrumentMgsTable, req).then(res => {
      if(res.code === 200){
        commit('updateTableData',res);
          if(req.createTime || req.name ) commit('updateSuccessMessage','Successfully get table data')
      }else {
          if(req.createTime || req.name ) commit('updateFailedMessage','Network exception, please try again')
      }
    },
    () => {
        if(req.createTime || req.name ) commit('updateFailedMessage','Network exception, please try again')
    }
    )
  },
  getMeterSys({commit},data){
    commit('updateMeterSys',data)
  },
    getPagination({commit},{pagination}){
        commit('updatePagination',pagination)
    },
    clearPagination({commit}){
        commit('updatePagination', {current: 1 , total: 0})
    },
    createOrEditTestIns({commit,dispatch},{isEdit,data}){
        let url = isEdit ? API.instrumentMgs.instrumentMgsUpdate:API.instrumentMgs.instrumentMgsInsert;
        let axiosType = isEdit ? axiosput : axiospost;
        axiosType(url, data)
            .then((res) => {
                    if(res.code === 200){
                        commit('updateSuccessMessage',isEdit ? 'Successfully updated' : 'Has been added successfully');
                        dispatch('getTableData',{})
                    }else commit('updateFailedMessage',isEdit ? 'Update failed' : 'add failed')
                },
                () => {
                    commit('updateFailedMessage','Network exception, please try again')
                })
    },
    deleteMeterSys({commit,dispatch},data){
        axiospost(API.instrumentMgs.instrumentMgsDelete.replace(":name",data.name)).then( res => {
            if(res.code === 200){
                commit('updateSuccessMessage','Deleted successfully')
                dispatch('getTableData',{})
            }else commit('updateFailedMessage','Network exception, please try again')
        })
    }
   
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
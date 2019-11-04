import {axiosget, axiospost} from '../../utils/http';
import moment from 'moment';
import axios from "axios/index";

const state = {
  tableData: [],
  VNFOptions: [],
  SuiteSingleData: {},
source: null,
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
  updateVNFTest (state, SuiteSingleData){
    state.SuiteSingleData = SuiteSingleData
  },
  updateVNFOptions(state, Options){
    state.VNFOptions = Options;
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
    updateToken(state,source){
        state.source = source
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
    axiosget('/getTestMeter', req).then(res => {
        if(res.code === 200){
            commit('updateTableData',res);
            if(req.createTime || req.VNFTestName ) commit('updateSuccessMessage','Successfully get table data')
        }else {
            if(req.createTime || req.VNFTestName ) commit('updateFailedMessage','Network exception, please try again')
        }
        },() => {
            if(req.createTime || req.VNFTestName ) commit('updateFailedMessage','Network exception, please try again')
        }
    )
  },
  getTestMeter({commit},data){
    commit('updateVNFTest',data)
  },
  getVNFOptions({commit}){
      axiosget('/getTestMeterVNFType').then(res => {
          if(res.code === 200){
              commit('updateVNFOptions',res.body)
          }else {
              this.$message.error('Network exception, please try again');
          }
      })
  },
  clearOptions({commit}){ 
    commit('updateVNFOptions', [])
  },
  getPagination({commit},{pagination}){
      commit('updatePagination',pagination)
  },
  clearPagination({commit}){
      commit('updatePagination', {current: 1 , total: 0})
  },
    uploadVNFFile({commit},{data, message}){
        let source = axios.CancelToken.source(
            commit('updateToken',source));
        let body = {...data};
        body.cancelToken = source.token;
        axiospost('/uploadVNFFile',body).then( res => {
            commit('updateToken',null);
            if(res.code === 200) message.success('Upload successfully');
            else message.error('Upload failed')
        },() => {
            message.error('Network exception, please try again');
            commit('updateToken',null)
        })
    },
    createOrEditTestMeter({commit,dispatch},{data, isEdit}){
        let url = isEdit ? '/updateTestMeter':'/createTestMeter';
        axiospost(url, data)
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
    deleteTestMeter({commit,dispatch},data){
        axiospost('/deleteTestMeter',data).then( res => {
            if(res.code === 200){
                commit('updateSuccessMessage','Deleted successfully')
                dispatch('getTableData',{})
            }else commit('updateFailedMessage','Network exception, please try again')
        })
    }
   
};
const getters = {

};
export default {
  state, mutations, actions, getters, namespaced: true,
}
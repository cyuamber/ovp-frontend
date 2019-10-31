import {axiosget} from '../../utils/http';
import moment from 'moment';

const state = {
  tableData: [],
  VNFOptions: [],
  testSpecSingleData: {},
  pagination: {current: 1 , total: 0}
}
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
  updateVNFTest (state, testSpecSingleData){
    state.testSpecSingleData = testSpecSingleData
  },
  updateVNFOptions(state, Options){
    state.VNFOptions = Options;
  },
  updatePagination(state, Options){
      state.pagination = Options;
  }
}
const actions = {
  getTableData ({commit}, obj){
    let req = {};
    Object.keys(obj).forEach(item =>{
        if(obj[item] !== '' &&obj[item] !== undefined ){
            req[item]=obj[item];
        }
    });
    axiosget('/getTestSpec', req).then(res => {
      if(res.code === 200){
        commit('updateTableData',res)
      }else {
        this.$message.error('Network exception, please try again');
      }
    })
  },
  getTestSpec({commit},data){
    commit('updateVNFTest',data)
  },
  getVNFOptions({commit}){
      axiosget('/getTestSpecVNFType').then(res => {
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
   
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
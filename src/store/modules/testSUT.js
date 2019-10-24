import {axiosget} from '../../utils/http';
import moment from 'moment';

const state = {
  tableData: [],
  VNFOptions: [],
  VNFTest: {}
}
const mutations = {
  updateTableData (state,tableData) {
    state.pagination = { current: 1, total: tableData.total }
    state.tableData = tableData.body.map( (item, index) => {
      item.createTime = moment(item.createTime).format('YYYY-MM-DD') 
      item.index = tableData.body.length * (state.pagination.current -1) + index+1;
      item.action = ['Edit', 'Delete']
      return item
    })
  },
  updateVNFTest (state, VNFTest){
    state.VNFTest = VNFTest
  },
  updateVNFOptions(state, Options){
    state.VNFOptions = Options;
  }
}
const actions = {
  getTableData ({commit}, {createTime,keyword}){
    let req = {};
    if(createTime !== '' && createTime !== undefined && keyword !== '' && keyword !== undefined){
      req = {createTime, VNFTestName: keyword}
    }else if(createTime !== '' && createTime !== undefined ){
      req = {createTime}
    }else if(keyword !== ''&& keyword !== undefined){
      req = {VNFTestName: keyword}
    }
    axiosget('/getVNFTest', req).then(res => {
      if(res.code === 200){
        commit('updateTableData',res)
      }else {
        this.$message.error('Network exception, please try again');
      }
    })
  },
  getVNFTest({commit},data){
    commit('updateVNFTest',data)
  },
  getVNFOptions({commit}){
    let Options = ['VNF', 'PNF', 'NFVI']
    setTimeout(() => {
      commit('updateVNFOptions',Options)
    },5000)
  },
  clearOptions({commit}){ 
    commit('updateVNFOptions', [])
  },
   
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
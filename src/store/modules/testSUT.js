import {axiosget, axiospost} from '../../utils/http';
import moment from 'moment';

const state = {
  tableData: [],
  VNFOptions: [],
  VNFTest: [],
  loadingMessage: {type: '', toast: ''}
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
        if(req.createTime || req.VNFTestName ) commit('updateSuccessMessage','Successfully get table data')
        // this.$message.success('Successfully get table data');
      }else {
        if(req.createTime || req.VNFTestName ) commit('updateFailedMessage','Network exception, please try again')
        // this.$message.error('Network exception, please try again')
      }
    },() => {
      if(req.createTime || req.VNFTestName ) commit('updateFailedMessage','Network exception, please try again')
      // this.$message.error('Network exception, please try again')
    }
    
  )},
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
  createOrEditVNFTest({commit,dispatch},{data, isEdit}){  
    let url = this.isEdit ? '/updateVNFTest' : '/createVNFTest';
    axiospost(url, data)
      .then((res) => {
        if(res.code === 200){
          commit('updateSuccessMessage',isEdit ? 'Successfully updated' : 'Has been added successfully')
          dispatch('getTableData',{})
        }else commit('updateFailedMessage',isEdit ? 'Update failed' : 'add failed')
      },
      () => {
        commit('updateFailedMessage','Network exception, please try again')
      })
  },
  deleteVNFTest({commit},data){
    axiospost('/deleteVNFTest',data).then( res => {
      if(res.code === 200){
        commit('updateSuccessMessage','Deleted successfully')
      }else commit('updateFailedMessage','Network exception, please try again')
    })
  }
   
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
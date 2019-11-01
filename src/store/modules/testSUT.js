import {axiosget, axiospost} from '../../utils/http';
import moment from 'moment';
import axios from 'axios'

const state = {
  tableData: [],
  VNFOptions: [],
  VNFTest: {},
  loadingMessage: {type: '', toast: ''},
  source: null,
  visible: false,
  pagination: {},
  createTime: '',
  keyword: '',
  pageNum: 1,
  pageSize: 10
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
  updateVisible(state, bool){
    state.visible = bool
  },
  updateVNFTest (state, VNFTest){
    state.VNFTest = VNFTest
  },
  updateVNFOptions(state, options){
    state.VNFOptions = options;
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
  setFilterItem(state,{time, key, pageObj, isSearch, message}){
    if(isSearch){
      if(key === '' && state.createTime === '' && state.keyword === '') {
        message.warning('Please enter valid search information')
        return
      }    
    }
    if(time !== undefined) {
      state.createTime = time
      // Jump to the first page after adding search criteria
      if(state.pageNum !== 1){
        state.pageNum = 1
      }
    }else if(key !== undefined) {
      state.keyword = key
      // Jump to the first page after adding search criteria
      if(state.pageNum !== 1){
        state.pageNum = 1
      }
    }
    else if(pageObj !== undefined) {
      state.pageNum = pageObj.current
      state.pageSize = pageObj.pageSize
    }
  }
}
const actions = {
  setParams({state, dispatch}){
    let paramsObj = {}
    if(state.createTime !== '') paramsObj.createTime = state.createTime
    if(state.keyword !== '') paramsObj.VNFTestName = state.keyword
    if(state.pageNum !== '') {
      paramsObj.pageNum = state.pageNum
      paramsObj.pageSize = state.pageSize
    }
    console.log(paramsObj)
    dispatch('getTableData',{paramsObj,isFilter: true})
  },
  getTableData ({commit}, {paramsObj,isFilter}){
    axiosget('/getVNFTest', paramsObj).then(res => {
      if(res.code === 200){
        commit('updateTableData',res)
        if(isFilter) commit('updateSuccessMessage','Successfully get table data')
      }else {
        if(isFilter) commit('updateFailedMessage','Network exception, please try again')
      }
    },() => {
      if(isFilter) commit('updateFailedMessage','Network exception, please try again')
    }
    
  )},
  getVNFOptions({commit, state}, fn){
    let Options = ['VNF', 'PNF', 'NFVI']
    setTimeout(() => {
      if(state.visible) {
        console.log(state.visible)
        commit('updateVNFOptions',Options)
        fn && typeof fn === 'function' && fn()
      }
    },5000)
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
  },
  upload({commit},{data, message}){
    let source = axios.CancelToken.source(
    commit('updateToken',source))
    let body = {...data};
    body.cancelToken = source.token;
    axiospost('/uploadVNFFile',body).then( res => {
      commit('updateToken',null)
      if(res.code === 200) message.success('Upload successfully')
      else message.error('Upload failed')
    },() => {
      message.error('Network exception, please try again')
      commit('updateToken',null)
    })
  },
  // inerrupt({commit,state}){
  //   axiosget
  // }
   
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
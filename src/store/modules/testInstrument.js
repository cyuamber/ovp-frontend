import {axiosget} from '../../utils/http';
import moment from 'moment';

const state = {
  tableData: [],
  singleData: {}
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
  updateMeterSys (state, singleData){
    state.singleData = singleData
  }
}
const actions = {
  getTableData ({commit}, {createTime,keyword}){
    let req = {};
    if(createTime !== '' && createTime !== undefined && keyword !== '' && keyword !== undefined){
      req = {createTime, meterSysName: keyword}
    }else if(createTime !== '' && createTime !== undefined ){
      req = {createTime}
    }else if(keyword !== ''&& keyword !== undefined){
      req = {meterSysName:keyword}
    }
    axiosget('/getMeterSys', req).then(res => {
      if(res.code === 200){
        commit('updateTableData',res)
      }else {
        this.$message.error('Network exception, please try again');
      }
    })
  },
  getMeterSys({commit},data){
    commit('updateMeterSys',data)
  }
   
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
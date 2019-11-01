import {axiosget, axiospost} from '../../utils/http';
import moment from 'moment';

const state = {
  tableData: [],
  VNFOptions: [],
  testSpecSingleData: {},
  pagination: {current: 1 , total: 0},
    loadingMessage: {type: '', toast: ''}
}
const mutations = {
  updateTableData (state,tableData) {
    state.pagination.total = tableData.total;
    state.tableData = tableData.body.map( (item, index) => {
      item.publishTime = moment(item.publishTime).format('YYYY-MM-DD');
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
  getTableData ({commit}, obj){
    let req = {};
      Object.keys(obj).forEach(item =>{
          if(obj[item] !== '' &&obj[item] !== undefined ){
              req[item]=obj[item];
          }
      });
    axiosget('/getTestSpec', req).then(res => {
            if(res.code === 200){
                commit('updateTableData',res);
                if(req.publishTime || req.testSpecName ) commit('updateSuccessMessage','Successfully get table data')
            }else {
                if(req.publishTime || req.testSpecName ) commit('updateFailedMessage','Network exception, please try again')
            }
        },
        () => {
            if(req.publishTime || req.testSpecName ) commit('updateFailedMessage','Network exception, please try again')
        }
    )
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
    createOrEditTestSpec({commit,dispatch},{isEdit,data}){
        let url = this.isEdit ? '/updateTestSpec':'/addTestSpec';
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
    deleteTestSpec({commit,dispatch},data){
        axiospost('/deleteTestSpec',data).then( res => {
            if(res.code === 200){
                commit('updateSuccessMessage','Deleted successfully');
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
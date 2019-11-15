import {axiosget, axiospost, axiosput} from '../../utils/http';
import API from '../../const/apis';
import moment from 'moment';
import {axiosgetType} from "../../const/constant";

const state = {
  tableData: [],
    caseMgtTableData: [],
    SUTOptions: [],
  VNFOptions: [],
  testSpecSingleData: {},
  pagination: {current: 1 , total: 0, pageSize:10},
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
    updatecaseMgtTableData(state,record){
        state.caseMgtTableData= [];
        console.log(state.caseMgtTableData,"1")
        state.caseMgtTableData = [].concat(record.caseMgt);
        console.log(state.caseMgtTableData,"2")
    },
  updateVNFTest (state, testSpecSingleData){
    state.testSpecSingleData = testSpecSingleData
  },
updateSUTOptions(state, Options){
    state.SUTOptions = Options;
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
      let req = {pageNum:state.pagination.current,pageSize:state.pagination.pageSize};
      Object.keys(obj).forEach(item =>{
          if(obj[item] !== '' &&obj[item] !== undefined ){
              req[item]=obj[item];
          }
      });
      let axiosrequest = axiosgetType?axiospost:axiosget;
      axiosrequest(API.TestSpecMgt.specMgtTable, req).then(res => {
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
    getSUTOptions({commit,dispatch},obj){
        axiosget(API.TestSpecMgt.TestSpecSUTType,obj).then(res => {
            if(res.code === 200){
                commit('updateSUTOptions',res.body);
                dispatch('getVNFOptions',{STUType:res.body[0].code})
            }else {
                this.$message.error('Network exception, please try again');
            }
        })
    },
  getVNFOptions({commit},obj){
      let url = API.TestSpecMgt.TestSpecVNFType.replace(":flag",obj.STUType);
      axiosget(url).then(res => {
          if(res.code === 200){
            commit('updateVNFOptions',res.body)
          }else {
              this.$message.error('Network exception, please try again');
          }
      })
  },
    getPagination({commit},{pagination}){
        commit('updatePagination',pagination)
    },
    clearPagination({commit}){
        commit('updatePagination', {current: 1 , total: 0})
    },
  clearOptions({commit}){ 
    commit('updateVNFOptions', [])
  },
    createOrEditTestSpec({commit,dispatch,state},{isEdit,data}){
        let url = isEdit ? API.TestSpecMgt.specMgtUpdate:API.TestSpecMgt.specMgtInsert;
        let axiosType = isEdit ? axiosput : axiospost;
        axiosType(url, data)
            .then((res) => {
                    if(res.code === 200){
                        commit('updateSuccessMessage',isEdit ? 'Successfully updated' : 'Has been added successfully');
                        let obj = {flag:state.currentTab,pageNum:state.pagination.current,pageSize:state.pagination.pageSize};
                        dispatch('getTableData',obj)
                    }else commit('updateFailedMessage',isEdit ? 'Update failed' : 'add failed')
                },
                () => {
                    commit('updateFailedMessage','Network exception, please try again')
                })
    },
    deleteTestSpec({commit,dispatch,state},id){
        axiospost(API.TestSpecMgt.specMgtDelete.replace("id",id)).then( res => {
            if(res.code === 200){
                commit('updateSuccessMessage','Deleted successfully');
                let obj = {flag:state.currentTab,pageNum:state.pagination.current,pageSize:state.pagination.pageSize};
                dispatch('getTableData',obj)
            }else commit('updateFailedMessage','Network exception, please try again')
        })
    }
   
}
const getters = {

}
export default {
  state, mutations, actions, getters, namespaced: true,
}
import moment from 'moment'
import { axiospost, axiosget } from '../../utils/http'

const state = {
  isShow: false,
  loadingMessage: null,
  SUTNameList: [],
  getSUTName: false,
  nameSpin: false,
  getSpecification: false,
  specificationSpin: false,
  specificationList: [],
  testCaseList: [],
  testCaseSpin: false,
  tableData: [],
  pagination: {},
  percent: 0,
  status: 'active'
}

const mutations = {
  setIsShow(state,bool){
    state.isShow = bool;
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
  updataSUTName(state,{get,spin,list}){
    state.getSUTName = get
    state.nameSpin = spin
    if(list) {
      state.SUTNameList = list
    }else {
      state.getSpecification = false
      state.specificationSpin = false
      state.specificationList = []
      state.testCaseList = []
    }
  },
  updateSpecification(state,{get,spin,list}){
    state.getSpecification = get
    state.specificationSpin = spin
    if(list) {
      state.specificationList = list
    } else {
      state.testCaseList = []
    }
  },
  updateTestCaseList(state,{spin,list}){
    state.testCaseSpin = spin
    if(list) state.testCaseList = list
  },
  clean(state){
    state.getSUTName = false
    state.SUTNameList = []
    state.specificationList = []
    state.getSpecification = false
    state.specificationSpin = false
    state.testCaseList =  []
    state.testCaseSpin = false
  },
  updateTableData(state,tableData){
    state.tableData = tableData
  },
  updateProgress(state, {percent, status}){
    if(state.percent !== percent)state.percent = percent
    if(state.status !== status)state.status = status
  }
}

const actions = {
  getTableData({commit}){
    axiosget('/getTestJobMGT').then((res) => {
      if(res.code === 200){
        state.pagination = {
          current: 1,
          total: res.total
        }
        let tableData = res.body.map((item,index) => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD');
          item.index =  res.body.length * (state.pagination.current -1) + index+1;
          item.actions = [item.status?'Pause': 'Start', 'Delete', 'Download', 'More']
          return item
        })
        commit('updateTableData',tableData)
      }
    })
  },
  createrTestJobMGT({commit},values){
    let body = {
      jobName: values.JobName,
      jobDescription: values.JobDescription,
      SUTType: values.SUTType,
      SUTName: values.SUTName,
      jobSpecification: values.JobSpecification,
      createrTime:  moment(new Date()).format('YYYY-MM-DD'),
      testCase: values.checkboxGroup
    }
    if(values.TestVIMENV) body.testVIMENV = values.TestVIMENV
    if(values.TestVNFMENV) body.testVNFMENV = values.TestVNFMENV
    axiospost('createrTestJobMGT',body)
      .then((res) => {
        if(res.code === 200){
          commit('updateSuccessMessage','Has been added successfully')
        }else commit('updateFailedMessage', 'add failed')
      })
      .catch(() => {commit('updateFailedMessage','Network exception, please try again')})
  },
  getSUTName({commit},{SUTType, message}){
    commit('updataSUTName',{get: false, spin: true})
    axiosget('/getSUTName',{SUTType}).then(res=>{
      if(res.code === 200){
        // Simulation request
        setTimeout(()=>{
          commit('updataSUTName',{get: true, spin: false, list: res.body.SUTName})
        },1000)
      }else {
        message.error('Failed to get SUT Name list')
        commit('updataSUTName',{get: false, spin: false})
      }
    },()=> {
      message.error('Network exception, please try again')
      commit('updataSUTName',{get: false, spin: false})
    })
  },
  getSpecification({commit},{SUTName, message}){
    commit('updateSpecification',{get: false, spin: true})
    axiosget('/getJobSpecification',{SUTName}).then(res=>{
      if(res.code === 200){
        // Simulation request
        setTimeout(()=>{
          commit('updateSpecification',{get: true, spin: false, list: res.body.JobSpecification})
        },1000)
      }else {
        message.error('Failed to get Job Specification list')
        commit('updateSpecification',{get: false, spin: false})
      }
    },() => {
      message.error('Network exception, please try again')
      commit('updateSpecification',{get: false, spin: false})
    })
  },
  getTestCase({commit},{JobSpecification,message}){
    commit('updateTestCaseList',{spin: true})
    axiosget('getTestCaseList',{JobSpecification}).then(res => {
      if(res.code === 200){
        commit('updateTestCaseList',{spin: false, list: res.body.testCaseList})
      }else {
        message.error('Failed to get Test Case list')
        commit('updateTestCaseList',{ spin: false})
      }
    },() => {
      message.error('Network exception, please try again')
      commit('updateTestCaseList',{ spin: false})
    })
  },
  delete({dispatch, commit},data){
    let {jobId, VNFName, jobName, status} = data
    axiospost('deleteTestJobMGT',{jobId, VNFName, jobName, status}).then(res=> {
      if(res.code === 200){
        commit('updateSuccessMessage','Deleted successfully')
        dispatch('getTableData')
      }
    })
  },
  runTestJobMGT({commit},data){
    let {jobId, VNFName, jobName, status} = data;
    axiospost('runTestJobMGT',{jobId, VNFName, jobName, status}).then(res => {
      if(res.code === 200){
        console.log('成功开始测试')
      }
    })
  },
  getProgress({commit,dispatch}){
    /* const socket = new WebSocket('ws://localhost:8080/getProgress');
    // WebSocket.onopen     Triggered after successful connection
    socket.addEventListener('open', function (event) {
      socket.send('Hello Server!');
    }); 
    // WebSocket.onmessage   Triggered after receiving information from the server
    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
      if(event.data.progress === 100){
        // Disconnect after the test is complete
        socket.close()  
      }
    }); */
    axiosget('/getProgress').then((res) => {
      if(res.code === 200){
        if(res.body.progress === 100){
          commit('updateProgress',{percent: 100, status: 'success'})
        }else{
          commit('updateProgress',{percent: res.body.progress, status: 'active'})
          setTimeout(() => {
            dispatch('getProgress')
          },5000)
        }
      }
    })
  }
  
}

const getters = {

}

export default {state, mutations, actions, getters, namespaced: true}
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
  }
}

const actions = {
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
  
}

const getters = {

}

export default {state, mutations, actions, getters, namespaced: true}
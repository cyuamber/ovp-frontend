import {axiosget, axiospost} from '../../utils/http'
import moment from 'moment'

const state = {
    loadingMessage: null,
    VIMTableData: [],
    VNFMTableData: [],
    pagination: {current:1,total:0},
    searchKeyword: '',
    createTime: '',
    pageNum: 1,
    pageSize: 10,
    currentTab: 'VIM ENV',
    visible: false,
    cloudTypeOptions: [],
    regionIdOptions: [],
    initValues: {}
}

const mutations = {
    updateTableData(state, res){
        state.pagination = {
            current: state.pageNum,
            total: res.total
        }
        let data = res.body.map( (item, index) => {
            item.action = ['Edit', 'Delete']
            item.index = res.body.length * (state.pagination.current -1) + index+1;
            item.createTime = moment(item.createTime).format('YYYY-MM-DD');
            return item
        })
        if(state.currentTab === 'VIM ENV') {
            state.VIMTableData = data
        }
        else state.VNFMTableData = data
    },
    changeTab(state, tab){
        state.currentTab = tab
    },
    setFilterItem(state,{time, key, pageObj, isSearch, message}){
        if(isSearch){
            if(key === '' && state.createTime === '' && state.searchKeyword === '') {
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
            state.searchKeyword = key
            // Jump to the first page after adding search criteria
            if(state.pageNum !== 1){
                state.pageNum = 1
            }
        }
        else if(pageObj !== undefined) {
            state.pageNum = pageObj.current
            state.pageSize = pageObj.pageSize
        }
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
    updateVisible(state, bool){
        state.visible = bool
    },
    updateOptionList(state,{ CloudTypeList, regionIdList }){
        state.cloudTypeOptions = CloudTypeList
        state.regionIdOptions = regionIdList
    },
    setInitValues(state, values){
        state.initValues = values
    }
}

const actions = {
    setParams({state, dispatch}){
        let paramsObj = {}
        if(state.createTime !== '') paramsObj.createTime = state.createTime
        if(state.searchKeyword !== '') {
            if(state.currentTab === 'VIM ENV'){
                paramsObj.cloudRegionId = state.searchKeyword
            }else paramsObj.VNFMname = state.searchKeyword
        }
        if(state.pageNum !== '') {
            paramsObj.pageNum = state.pageNum
            paramsObj.pageSize = state.pageSize
        }
        dispatch('getTableData',{paramsObj,isFilter: true})
    },
    getTableData({commit, state}, {paramsObj, isFilter}){
        let url = state.currentTab === 'VIM ENV' ? '/getVIM': '/getVNFM'
        axiosget(url, paramsObj).then(res => {
            if(res.code === 200){
                commit('updateTableData',res)
                if(isFilter) commit('updateSuccessMessage','Successfully get table data')
            }else {
                if(isFilter) commit('updateFailedMessage','Failed to get form data')
            }
        },() => {if(isFilter) commit('updateFailedMessage','Network exception, please try again')}
        )
    },
    deleteData({dispatch,commit},data){
        let url = '' 
        let body = null;
        if(state.currentTab === 'VIM ENV'){
            body = {cloudRegionId: data.cloudRegionId}
            url = '/deleteVIM'
        }else {
            body = {
                VNFMname: data.VNFMname,
                VNFMtype: data.VNFMtype
            }
            url =  '/deleteVNFM'
        }
        axiospost(url,body).then( res => {
            if(res.code === 200){
                commit('updateSuccessMessage','Deleted successfully')
                let paramsObj = {pageNumstate: state.pageNum, pageSize: state.pageSize}
                dispatch('getTableData',{paramsObj})
            }else  commit('updateFailedMessage','Failed to delete')
        }).catch(() => {
            commit('updateFailedMessage','Network exception, please try again')
        })
    },
    getOptionList({commit}){
        let CloudTypeList =  ['VNF', 'PNF', 'FNF']
        let regionIdList =  ['VNF', 'PNF', 'FNF']
        // Simulation request
        setTimeout(() => {
            commit('updateOptionList',{ CloudTypeList, regionIdList })
        },2000)
    },
    loginVIN({state,commit, dispatch},{isEdit, data}){
        let url = (isEdit ? '/update' : '/login') + (state.currentTab === 'VIM ENV'? 'VIM': 'VNFM');
        axiospost(url, data)
            .then((res) => {
                if(res.code === 200){
                    commit('updateSuccessMessage',this.isEdit ? 'Successfully updated' : 'Has been added successfully')
                    dispatch('getTableData', {})
                }else {
                    commit('updateFailedMessage',this.isEdit ? 'Update failed' : 'add failed')
                }
            },
            () => {
                commit('updateFailedMessage','Network exception, please try again')
            })
    }

}

const getters = {

}

export default { state, mutations, actions, getters, namespaced: true}
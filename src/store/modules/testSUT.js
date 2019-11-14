import {
	axiosget,
	axiospost,
    axiosput,
    axiosdelete
} from '../../utils/http';
import API from '../../const/apis';
import moment from 'moment';
import axios from 'axios'

const state = {
	tableData: [],
	VNFOptions: [],
	VNFTest: {},
	loadingMessage: {
		type: '',
		toast: ''
	},
	source: null,
	visible: false,
	pagination: {},
	createTime: '',
	keyword: '',
	pageNum: 1,
	pageSize: 10,
    currentTab: 101,
}
const mutations = {
	updateTableData(state, tableData) {
		state.pagination = {
			current: state.pageNum,
			total: tableData.total
		}
		state.tableData = tableData.body.map((item, index) => {
			item.createTime = moment(item.createTime).format('YYYY-MM-DD')
			item.index = tableData.body.length * (state.pagination.current - 1) + index + 1;
			item.action = ['Edit', 'Delete', 'Download']
			return item
		})
	},
	updateVisible(state, bool) {
		state.visible = bool
	},
    changeTab(state, tab){
        state.currentTab = tab
    },
	updateVNFTest(state, VNFTest) {
		state.VNFTest = VNFTest
	},
	updateVNFOptions(state, options) {
		state.VNFOptions = options;
	},
	updateFailedMessage(state, toast) {
		state.loadingMessage = {
			type: 'failed',
			toast
		}
	},
	updateSuccessMessage(state, toast) {
		state.loadingMessage = {
			type: 'success',
			toast
		}
	},
	updateToken(state, source) {
		state.source = source
	},
	setFilterItem(state, { time, key, pageObj, isSearch, message }) {
		if (isSearch) {
			if (key === '' && state.createTime === '' && state.keyword === '') {
				message.warning('Please enter valid search information')
				return
			}
		}
		if (time !== undefined) {
			state.createTime = time
			// Jump to the first page after adding search criteria
			if (state.pageNum !== 1) {
				state.pageNum = 1
			}
		} else if (key !== undefined) {
			state.keyword = key
			// Jump to the first page after adding search criteria
			if (state.pageNum !== 1) {
				state.pageNum = 1
			}
		} else if (pageObj !== undefined) {
			state.pageNum = pageObj.current
			state.pageSize = pageObj.pageSize
		}
	}
}
const actions = {
	setParams({ state, dispatch }, isFilter) {
		let paramsObj = {};
		if (state.createTime !== '') paramsObj.createTime = state.createTime;
		if (state.keyword !== '') paramsObj.name = state.keyword;
		if (state.pageNum !== '') {
			paramsObj.pageNum = state.pageNum
			paramsObj.pageSize = state.pageSize
		}
        paramsObj.flag = state.currentTab;
		dispatch('getTableData', {
			paramsObj,
			isFilter
		})
	},
	getTableData({ commit,state }, { paramsObj, isFilter }) {
        paramsObj.flag = state.currentTab;
        paramsObj.pageNum = state.pageNum;
        paramsObj.pageSize = state.pageSize;
		axiosget(API.sutMgt.sutMgtTable,paramsObj).then(res => {
				if (res.code === 200) {
					commit('updateTableData', res)
					if (isFilter) commit('updateSuccessMessage', 'Successfully get table data')
				} else {
					if (isFilter) commit('updateFailedMessage', 'Network exception, please try again')
				}
			}, () => {
				if (isFilter) commit('updateFailedMessage', 'Network exception, please try again')
			}

		)
	},
	getVNFOptions({ commit,state }) {
        let url = API.sutMgt.sutMgtType.replace(":flag",state.currentTab);
        axiosget(url).then(res => {
            if(res.code === 200){
                commit('updateVNFOptions',res.body)
            }else {
                this.$message.error('Network exception, please try again');
            }
        })
	},
	createOrEditVNFTest({ commit,state, dispatch }, { data, isEdit }) {
        if(isEdit) data.id = state.VNFTest.id;
		let url = isEdit ? API.sutMgt.sutMgtUpdate: API.sutMgt.sutMgtInsert;
		let apiType = isEdit ? axiosput:axiospost;
        apiType(url, data)
			.then((res) => {
					if (res.code === 200) {
						commit('updateSuccessMessage', isEdit ? 'Successfully updated' : 'Has been added successfully')
                        let paramsObj = {flag:state.currentTab};
						dispatch('getTableData', {paramsObj,isFilter:false})
					} else commit('updateFailedMessage', isEdit ? 'Update failed' : 'add failed')
				},
				() => {
					commit('updateFailedMessage', 'Network exception, please try again')
				})
	},
	deleteVNFTest({ commit, dispatch }, data) {
        axiosdelete(API.sutMgt.sutMgtDelete.replace("id",data.id)).then(res => {
			if (res.code === 200) {
				commit('updateSuccessMessage', 'Deleted successfully')
                let paramsObj = {flag:state.currentTab};
                dispatch('getTableData', {paramsObj,isFilter:false})
			} else commit('updateFailedMessage', 'Network exception, please try again')
		})
	},
	upload({ commit }, { data, message }) {
		let source = axios.CancelToken.source(
			commit('updateToken', source))
		let body = {
			...data
		};
		body.cancelToken = source.token;
        axiospost(API.sutMgt.uploadFile, {file:body}, true).then(res => {
			commit('updateToken', null)
			if (res.code === 200) message.success('Upload successfully')
			else message.error('Upload failed')
		}, () => {
			message.error('Network exception, please try again')
			commit('updateToken', null)
		})
	}

}
const getters = {

}
export default {
	state,
	mutations,
	actions,
	getters,
	namespaced: true,
}
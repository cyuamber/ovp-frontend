import moment from 'moment'
import {
	axiospost,
	axiosget
} from '../../utils/http'

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
	status: 'normal',
	isJobDetail: false,
	createTime: '',
	pageNum: 1,
	pageSize: 10
}

const mutations = {
	setIsShow(state, bool) {
		state.isShow = bool;
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
	updataSUTName(state, { get, spin, list }) {
		state.getSUTName = get
		state.nameSpin = spin
		if (list) {
			state.SUTNameList = list
		} else {
			state.getSpecification = false
			state.specificationSpin = false
			state.specificationList = []
			state.testCaseList = []
		}
	},
	updateSpecification(state, { get, spin, list }) {
		state.getSpecification = get
		state.specificationSpin = spin
		if (list) {
			state.specificationList = list
		} else {
			state.testCaseList = []
		}
	},
	updateTestCaseList(state, {
		spin,
		list
	}) {
		state.testCaseSpin = spin
		if (list) state.testCaseList = list
	},
	clean(state) {
		state.getSUTName = false
		state.SUTNameList = []
		state.specificationList = []
		state.getSpecification = false
		state.specificationSpin = false
		state.testCaseList = []
		state.testCaseSpin = false
	},
	updateTableData(state, tableData) {
		state.tableData = tableData
	},
	updateProgress(state, { percent, status }) {
		if (state.percent !== percent) state.percent = percent
		if (state.status !== status) state.status = status
	},
	changeComponent(state, bool) {
		state.isJobDetail = bool
	},
	setFilter(state, { time, pageObj }){
		if(time !== undefined)state.createTime = time
		if(pageObj !== undefined) {
			state.pageNum = pageObj.current;
			state.pageSize = pageObj.pageSize;
		}
	},
	updateTableItemData(state, data){
		let index = data.index-1
		state.tableData.splice( index, 1, data )
	}
}

const actions = {
	getTableData({ commit }, bool) {
		let obj = {pageNum: state.pageNum, pageSize: state.pageSize}
		if(state.createTime !== '') obj.createTime = state.createTime
		axiosget('/getTestJobMGT',obj).then((res) => {
			if (res.code === 200) {
				state.pagination = {
					current: state.pageNum,
					total: res.total
				}
				let tableData = res.body.map((item, index) => {
					item.createTime = moment(item.createTime).format('YYYY-MM-DD');
					item.index = res.body.length * (state.pagination.current - 1) + index + 1;
					item.actions = [item.status === 1 ? 'Stop' : 'Start', 'Delete', 'Download', 'More']
					return item
				})
				commit('updateTableData', tableData)
				if(bool) commit('updateSuccessMessage', 'Successfully get table data')
			}else if(bool) commit('updateFailedMessage', 'Network exception, please try again')
		}).catch(() => {
			if(bool) commit('updateFailedMessage', 'Network exception, please try again')
		})
	},
	createrTestJobMGT({ commit }, values) {
		let body = {
			jobName: values.JobName,
			jobDescription: values.JobDescription,
			SUTType: values.SUTType,
			SUTName: values.SUTName,
			jobSpecification: values.JobSpecification,
			createrTime: moment(new Date()).format('YYYY-MM-DD'),
			testCase: values.checkboxGroup
		}
		if (values.TestVIMENV) body.testVIMENV = values.TestVIMENV
		if (values.TestVNFMENV) body.testVNFMENV = values.TestVNFMENV
		axiospost('createTestJobMGT', body)
			.then((res) => {
				if (res.code === 200) {
					commit('updateSuccessMessage', 'Has been added successfully')
				} else commit('updateFailedMessage', 'add failed')
			})
			.catch(() => {
				commit('updateFailedMessage', 'Network exception, please try again')
			})
	},
	getSUTName({ commit }, { SUTType, message }) {
		commit('updataSUTName', {
			get: false,
			spin: true
		})
		axiosget('/getSUTName', {
			SUTType
		}).then(res => {
			if (res.code === 200) {
				// Simulation request
				setTimeout(() => {
					commit('updataSUTName', {
						get: true,
						spin: false,
						list: res.body.SUTName
					})
				}, 1000)
			} else {
				message.error('Failed to get SUT Name list')
				commit('updataSUTName', {
					get: false,
					spin: false
				})
			}
		}, () => {
			message.error('Network exception, please try again')
			commit('updataSUTName', {
				get: false,
				spin: false
			})
		})
	},
	getSpecification({
		commit
	}, {
		SUTName,
		message
	}) {
		commit('updateSpecification', {
			get: false,
			spin: true
		})
		axiosget('/getJobSpecification', {
			SUTName
		}).then(res => {
			if (res.code === 200) {
				// Simulation request
				setTimeout(() => {
					commit('updateSpecification', {
						get: true,
						spin: false,
						list: res.body.JobSpecification
					})
				}, 1000)
			} else {
				message.error('Failed to get Test Specification list')
				commit('updateSpecification', {
					get: false,
					spin: false
				})
			}
		}, () => {
			message.error('Network exception, please try again')
			commit('updateSpecification', {
				get: false,
				spin: false
			})
		})
	},
	getTestCase({
		commit
	}, {
        TestSpecification,
		message
	}) {
		commit('updateTestCaseList', {
			spin: true
		})
		axiosget('getTestCaseList', {
			TestSpecification
		}).then(res => {
			if (res.code === 200) {
				commit('updateTestCaseList', {
					spin: false,
					list: res.body.testCaseList
				})
			} else {
				message.error('Failed to get Test Case list')
				commit('updateTestCaseList', {
					spin: false
				})
			}
		}, () => {
			message.error('Network exception, please try again')
			commit('updateTestCaseList', {
				spin: false
			})
		})
	},
	delete({ dispatch, commit }, data) {
		let {
			jobId,
			VNFName,
			jobName,
			status
		} = data
		axiospost('deleteTestJobMGT', {
			jobId,
			VNFName,
			jobName,
			status
		}).then(res => {
			if (res.code === 200) {
				commit('updateSuccessMessage', 'Deleted successfully')
				dispatch('getTableData')
			}
		})
	},
    download({ commit }, data) {
        let {
            jobId,
            VNFName,
            jobName,
            status
        } = data
        axiospost('downloadTestJobMGT', {
            jobId,
            VNFName,
            jobName,
            status
        }).then(res => {
            if (res.code === 200) {
                commit('updateSuccessMessage', 'download successfully')
            }
        })
    },
	runTestJobMGT({commit,dispatch},data) {
		let {
			jobId,
			VNFName,
			jobName,
			status
		} = data;
		axiospost('runTestJobMGT', {
			jobId,
			VNFName,
			jobName,
			status
		})
		.then(res => {
			if (res.code === 200) {
                commit('updateSuccessMessage', 'download Successfully started testing');
                data.status = 1;
                data.actions[0] = 'Stop';
                commit('updateTableItemData',data);
                dispatch('getTableData',true)
			}
		})
	},
	getProgress({ commit, dispatch, state }) {
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
			if (!state.isJobDetail) return
			if (res.code === 200) {
				if (res.body.progress === 100) {
					commit('updateProgress', {
						percent: 100,
						status: 'success'
					})
				} else {
					commit('updateProgress', {
						percent: res.body.progress,
						status: 'active'
					})
					setTimeout(() => {
						dispatch('getProgress')
					}, 3000)
				}
			}
		})
	},
	stopJop({dispatch,commit},data){
		// Simulation request
		data.status = 0
		data.actions[0] = 'Start'
		commit('updateTableItemData',data);
        dispatch('getTableData',true)
	}

}

const getters = {

}

export default {
	state,
	mutations,
	actions,
	getters,
	namespaced: true
}
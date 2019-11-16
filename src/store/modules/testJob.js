import moment from 'moment'
import API from '../../const/apis';
import {
	axiospost,
	axiosget,
	axiosput,
    axiosdelete
} from '../../utils/http'
import {axiosgetType} from "../../const/constant";

const state = {
	isShow: false,
	loadingMessage: null,
    tableLoading: false,
    SUTTypeList: [],
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
	pageSize: 10,
    detailTestCase:[],
    VNFMOption: [],
    VIMOption: []
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
    updataSUTType(state, { list }) {
        if (list) {
            state.SUTTypeList = list
        } else {
            state.getSpecification = false
            state.specificationSpin = false
            state.SUTNameList = []
            state.specificationList = []
            state.testCaseList = []
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
	},
    updateTableLoading(state, tableLoading) {
        state.tableLoading = tableLoading
    },
    updateDetailTestCase(state, detailTestCase) {
        state.detailTestCase = detailTestCase
    },
    updateVNFMOption(state, options) {
        state.VNFMOption = options;
    },
    updateVIMOption(state, options) {
        state.VIMOption = options;
    },
}

const actions = {
	getTableData({ commit }, bool) {
		let obj = {pageNum: state.pageNum, pageSize: state.pageSize}
		if(state.createTime !== '') obj.createTime = state.createTime;
        let axiosrequest = axiosgetType?axiospost:axiosget;
        commit('updateTableLoading', true);
        axiosrequest(API.testJobMgt.testJobTable,obj).then((res) => {
			if (res.code === 200) {
				state.pagination = {
					current: state.pageNum,
					total: res.total
				};
				let tableData = res.body.map((item, index) => {
					item.createTime = moment(item.createTime).format('YYYY-MM-DD');
					item.index = res.body.length * (state.pagination.current - 1) + index + 1;
					item.actions = [item.status === "RUNNING" ? 'Stop' : 'Start', 'Delete', 'Download', 'More']
					return item
				})
                commit('updateTableLoading', false);
				commit('updateTableData', tableData)
				if(bool) commit('updateSuccessMessage', 'Successfully get table data')
			}else if(bool) commit('updateFailedMessage', 'Network exception, please try again')
		}).catch(() => {
			if(bool) commit('updateFailedMessage', 'Network exception, please try again')
		})
	},
	createrTestJobMGT({ commit }, values) {
		let body = {
            cronExpression:"",
            endpoint: "/portal/business/jobs/case/start",
            executionType: "ONCE",
            fixedExecutionInterval: "0",
            fixedExecutionUnit: "",
			jobName: values.JobName,
            remark: values.JobDescription,
			// SUTType: values.SUTType,
            sutId: values.SUTName.split("+")[1],
            specId: values.TestSpecification,
			createrTime: moment(new Date()).format('YYYY-MM-DD'),
            caseIds: values.checkboxGroup ? values.checkboxGroup:[]
		}
		if (values.TestVIMENV) body.testVIMENV = values.TestVIMENV
		if (values.TestVNFMENV) body.testVNFMENV = values.TestVNFMENV
		axiospost(API.testJobMgt.testJobInsert, body)
			.then((res) => {
				if (res.code === 200) {
					commit('updateSuccessMessage', 'Has been added successfully')
				} else commit('updateFailedMessage', 'add failed')
			})
			.catch(() => {
				commit('updateFailedMessage', 'Network exception, please try again')
			})
	},
    getSUTType({ commit }, { message }) {
        commit('updataSUTType', {
            get: false,
            spin: true
        })
        axiosget(API.testJobMgt.testJobSUTType).then(res => {
            if (res.code === 200) {
                // Simulation request
                setTimeout(() => {
                    commit('updataSUTType', {
                        list: res.body
                    })
                }, 1000)
            } else {
                message.error('Failed to get SUT Name list')
            }
        }, () => {
            message.error('Network exception, please try again')
        })
    },
	getSUTName({ commit }, { SUTType, message }) {
		commit('updataSUTName', {
			get: false,
			spin: true
		})
		axiosget(API.testJobMgt.testJobSUTName.replace(":code",SUTType)).then(res => {
			if (res.code === 200) {
				// Simulation request
				setTimeout(() => {
					commit('updataSUTName', {
						get: true,
						spin: false,
						list: res.body
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
		axiosget(API.testJobMgt.testJobSpec.replace(":type",SUTName)).then(res => {
			if (res.code === 200) {
				// Simulation request
				setTimeout(() => {
					commit('updateSpecification', {
						get: true,
						spin: false,
						list: res.body
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
		axiosget(API.testJobMgt.testJobTestCase.replace(":id",TestSpecification)).then(res => {
			if (res.code === 200) {
				commit('updateTestCaseList', {
					spin: false,
					list: res.body
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
		axiosdelete(API.testJobMgt.testJobDelete.replace(":jobId",data.jobId)).then(res => {
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
		axiosput(API.testJobMgt.testJobStart.replace(":jobId",data.jobId))
		.then(res => {
			if (res.code === 200) {
                commit('updateSuccessMessage', 'Successfully started testing');
                data.status = "RUNNING";
                data.actions[0] = 'Stop';
                commit('updateTableItemData',data);
                dispatch('getTableData',true)
			}
		})
	},
	getProgress({ commit, dispatch, state }) {
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
        axiosput(API.testJobMgt.testJobStop.replace(":jobId",data.jobId))
            .then(res => {
                if (res.code === 200) {
                    commit('updateSuccessMessage', 'Successfully stoped testing');
                    data.status = "STOPPED";
                    data.actions[0] = 'Start';
                    commit('updateTableItemData',data);
                    dispatch('getTableData',true)
                }
            });
        dispatch('getTableData',true)
	},
    detailTestCaseJop({commit},data){
        // Simulation request
        axiosget(API.testJobMgt.testJobDetail.replace(":jobId",data.jobId).replace(":ExecutionStartTime",data.executionStartTime))
            .then(res => {
                if (res.code === 200) {
                    commit('updateSuccessMessage', 'Successfully detail testing');
                    commit('updateDetailTestCase',res.body);
                }
            });
        axiosget(API.testJobMgt.testJobProgress.replace(":jobId",data.jobId))
            .then(res => {
                if (res.code === 200) {
                    commit('updateSuccessMessage', 'Successfully detail testing');
                    commit('updateProgress', {
                        percent: res.body.jobProgress,
                        status: res.body.jobStatus
                    })
                }
            });
    },
    getVNFMOption({ commit }, { message }) {
        axiosget(API.vimVnfmMgt.vnfmEnvMgtTable).then(res => {
            if (res.code === 200) {
                // Simulation request
                commit('updateVNFMOption',res.body)
            } else {
                message.error('Failed to get SUT Name list')
            }
        }, () => {
            message.error('Network exception, please try again')
        })
    },
    getVIMOption({ commit }, { message }) {
        axiosget(API.vimVnfmMgt.vimEnvMgtTable).then(res => {
            if (res.code === 200) {
                // Simulation request
                commit('updateVIMOption',res.body)
            } else {
                message.error('Failed to get SUT Name list')
            }
        }, () => {
            message.error('Network exception, please try again')
        })
    },

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
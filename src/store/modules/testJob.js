import moment from 'moment'
import API from '../../const/apis';
import router from "../../router/router"
import {
	axiospost,
	axiosget,
	axiosput,
	axiosdelete
} from '../../utils/http'
import { axiosgetType } from "../../const/constant";

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
	statusText: 'normal',
	isJobDetail: false,
    searchKeyword:'全部',
	createTime: '',
	pageNum: 1,
	pageSize: 10,
	detailTestCase: [],
	VNFMOption: [],
	VIMOption: [],
    executionStartTime:'',
    testCasePieData:[
        { name: "DONE", y: 0, color: "#cae76e" },
        { name: "FAILED", y: 0, color: "#e94e75" }
    ],
	testJobSingleData:{},
	dashboardJumpStatus:null,
    initcheckboxGroup:[]
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
        state.testJobSingleData = {}
        state.initcheckboxGroup = []
        state.VNFMOption = []
		state.VIMOption = []
	},
	updateTableData(state, tableData) {
		state.tableData = tableData
	},
	updateProgress(state, { percent, status }) {
		if (state.percent !== percent) state.percent = percent
		if (state.statusText !== status) state.statusText = status
	},
	changeComponent(state, bool) {
		state.isJobDetail = bool
	},
	setFilter(state,{time, key, pageObj}) {
		if (time !== undefined){
            state.createTime = time;
            if(state.pageNum !== 1){
                state.pageNum = 1
            }
        }
        if(key !== "全部") {
            state.searchKeyword = key;
            state.dashboardJumpStatus = "全部";
            if(state.pageNum !== 1){
                state.pageNum = 1
            }
        }
		if (pageObj !== undefined) {
			state.pageNum = pageObj.current;
			state.pageSize = pageObj.pageSize;
		}
	},
	updateTableItemData(state, data) {
		let index = data.index - 1
		state.tableData.splice(index, 1, data)
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
    updateExecutionStartTime(state, options) {
        state.executionStartTime = options;
    },
    updateTestCasePieData(state, {doneCaseNum,failedCaseNum}) {
        state.testCasePieData[0].y = doneCaseNum;
        state.testCasePieData[1].y = failedCaseNum;
    },
    updateTestJobSingleData(state, data) {
        state.testJobSingleData = data;
        if(Object.keys(data).length>0){
            state.initcheckboxGroup = data.cases.map((item) => {
                return item.id
            });
        }
    },
    updateDashboardJumpStatus(state, data) {
        state.dashboardJumpStatus = data;
    },
    clearSearchKeyword(state, data){
        state.searchKeyword = data
	},
	updateInitcheckboxGroup(state, data){
        state.initcheckboxGroup = data;
	}
}

const actions = {
	getTableData({ commit }, bool) {
		let obj = { pageNum: state.pageNum, pageSize: state.pageSize };
		if (state.createTime !== '') obj.createTime = state.createTime;
		if (state.searchKeyword !== '全部' && state.dashboardJumpStatus === "全部") obj.jobStatus= state.searchKeyword;
		if(state.searchKeyword === '全部' && state.dashboardJumpStatus!=="全部") obj.jobStatus = state.dashboardJumpStatus;
        let axiosrequest = axiosgetType ? axiospost : axiosget;
		// commit('updateTableLoading', true);
        console.log(obj,"getTableData => obj----");
		axiosrequest(API.testJobMgt.testJobTable, obj).then((res) => {
			if (res.code === 200) {
				state.pagination = {
					current: state.pageNum,
					total: res.total
				};
				let tableData = res.body.map((item, index) => {
					item.createTime = moment(item.createTime).format('YYYY-MM-DD');
					item.index = res.body.length * (state.pagination.current - 1) + index + 1;
					item.actions = [item.status === "RUNNING" ? 'Stop' : 'Start','Edit', 'Delete', 'Download', 'More']
					return item
				})
				// commit('updateTableLoading', false);
				commit('updateTableData', tableData)
				if (bool) commit('updateSuccessMessage', 'Successfully get table data')
			} else if (bool) commit('updateFailedMessage', 'Network exception, please try again')
		}).catch(() => {
			if (bool) commit('updateFailedMessage', 'Network exception, please try again')
		})
	},
	createrTestJobMGT({ dispatch, commit,state }, { isEdit, values }) {
		let body = {
			cronExpression: "",
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
			caseIds: values.checkboxGroup ? values.checkboxGroup : []
		};
		if (values.TestVIMENV) body.vimId = values.TestVIMENV;
		if (values.TestVNFMENV) body.vnfmId = values.TestVNFMENV;
		let jobId = isEdit ? state.testJobSingleData.jobId : "";
		if(isEdit)body.jobId =jobId;
        let url = isEdit ? API.testJobMgt.testJobUpdate.replace(":jobId",jobId) : API.testJobMgt.testJobInsert;
        let axiosType = isEdit ? axiosput : axiospost;
        axiosType(url, body)
			.then((res) => {
				if (res.code === 200) {
					commit('updateSuccessMessage', 'Has been added successfully')
				} else commit('updateFailedMessage', 'add failed');
                commit('setIsShow',false);
                dispatch('getTableData',false)
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
		axiosget(API.testJobMgt.testJobSUTName.replace(":code", SUTType)).then(res => {
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
		axiosget(API.testJobMgt.testJobSpec.replace(":type", SUTName)).then(res => {
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
		axiosget(API.testJobMgt.testJobTestCase.replace(":id", TestSpecification)).then(res => {
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
		axiosdelete(API.testJobMgt.testJobDelete.replace(":jobId", data.jobId)).then(res => {
			if (res.code === 200) {
				commit('updateSuccessMessage', 'Deleted successfully')
				dispatch('getTableData')
			}
		})
	},
	download({ commit }, data) {
        let url = API.testJobMgt.testJobDownLoad.replace(":jobId", data.jobId);
        console.log(window.location.protocol+"//"+window.location.host+url,"window.location.protocol--testJobDownLoad");
        window.open(window.location.protocol+"//"+window.location.host+url);
        commit('updateSuccessMessage', 'DownLoad File successfully');
	},
	runTestJobMGT({ commit }, data) {
		axiosput(API.testJobMgt.testJobStart.replace(":jobId", data.jobId))
			.then(res => {
				if (res.code === 200) {
					commit('updateSuccessMessage', 'Successfully started testing');
					data.status = "RUNNING";
					data.jobStatus = "STARTED";
					data.actions[0] = 'Stop';
					data.jobId = res.body.jobId;
					data.executionStartTime = res.body.executionStartTime;
					commit('updateTableItemData', data);
					setTimeout(() => {
						router.push({ name: "JobDetail", params: data })
					}, 5000)
				}
			})
	},
    getProgress({ commit },data) {
        axiosget(API.testJobMgt.testJobProgress.replace(":jobId", data.jobId))
            .then(res => {
                if (res.code === 200) {
                    commit('updateSuccessMessage', 'Successfully detail testing');
                    commit('updateProgress', {
                        percent: res.body.jobProgress,
                        status: res.body.jobStatus
                    });
                    commit('updateExecutionStartTime', res.body.executionStartTime)
                }
            });
    },
	detailTestCaseJop({ commit, state }, data) {
        if(state.executionStartTime ==="")return false
        else {
            // Simulation request
            axiosget(API.testJobMgt.testJobDetail.replace(":jobId", data.jobId).replace(":ExecutionStartTime", state.executionStartTime))
                .then(res => {
                    if (res.code === 200) {
                        commit('updateSuccessMessage', 'Successfully detail testing');
                        commit('updateDetailTestCase', res.body);
                        let doneCaseNum=0,failedCaseNum=0;
                        res.body.forEach((item)=>{
                            if(item.caseStatus === 'DONE'){
                                doneCaseNum++
                            }else if(item.caseStatus === 'FAILED'){
                                failedCaseNum++
                            }
                        });
                        commit('updateTestCasePieData', {doneCaseNum,failedCaseNum});
                    }
                });
        }

	},
	stopJop({ dispatch, commit }, data) {
		// Simulation request
		axiosput(API.testJobMgt.testJobStop.replace(":jobId", data.jobId))
			.then(res => {
				if (res.code === 200) {
					commit('updateSuccessMessage', 'Successfully stoped testing');
					data.status = "STOPPED";
					data.actions[0] = 'Start';
					commit('updateTableItemData', data);
					dispatch('getTableData', true)
				}
			});
		dispatch('getTableData', true)
	},
	getVNFMOption({ commit }, { message }) {
		axiosget(API.vimVnfmMgt.vnfmEnvMgtTable).then(res => {
			if (res.code === 200) {
				// Simulation request
				commit('updateVNFMOption', res.body)
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
				commit('updateVIMOption', res.body)
			} else {
				message.error('Failed to get SUT Name list')
			}
		}, () => {
			message.error('Network exception, please try again')
		})
	},
	getEditTestJob({ dispatch, commit }, data){
        axiosget(API.testJobMgt.testJobProgress.replace(":jobId", data.jobId))
            .then(res => {
                if (res.code === 200) {
                    console.log(res.body,"res.body")
                    commit('updateTestJobSingleData', res.body);
                    dispatch("getTestCase",{TestSpecification: res.body.spec.id, message: this.$message})
                }
            }, () => {
                commit('updateFailedMessage', 'Network exception, please try again')
            });
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
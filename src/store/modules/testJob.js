import moment from 'moment'
import API from '../../const/apis';
import util from '../../utils/utils';
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
	tableLoading: false,
	detailLoading: true,
	SUTTypeList: [],
	SUTNameList: [],
	getSUTName: false,
	nameSpin: false,
	getSpecification: false,
	specificationSpin: false,
	specificationList: [],
    testCaseCheckAll: false,
	testCaseList: [],
	testFailDetail: "",
	failLoading: false,
	testCaseSpin: false,
	tableData: [],
	pagination: {},
	percent: 0,
	statusText: 'normal',
	isJobDetail: false,
	searchKeyword: 'All',
	createTime: '',
	pageNum: 1,
	pageSize: 10,
	detailTestCase: [],
	VNFMOption: [],
	VIMOption: [],
	MANOOption: [],
	TestInstrumentOption: [],
	executionStartTime: '',
	testCasePieData: [
		{ name: "DONE", y: 0, color: "#cae76e" },
		{ name: "FAILED", y: 0, color: "#e94e75" }
	],
	testJobSingleData: {},
	dashboardJumpStatus: 'All',
	initcheckboxGroup: [],
	caseParamsIsShow: false,
	caseParamsData: [],
	testCaseChildtableLoading: false,
	expandedRowKeys: []
}

const mutations = {
	setIsShow(state, bool) {
		state.isShow = bool;
	},
	setCaseParamsIsShow(state, bool) {
		state.caseParamsIsShow = bool;
	},
	setTestCaseChildtableLoading(state, bool) {
		state.testCaseChildtableLoading = bool;
	},
	updateExpandedRowKeys(state, { key, expanded }) {
		if (expanded) {
			if (state.expandedRowKeys.indexOf(key) > -1) {
				let index = state.expandedRowKeys.indexOf(key)
				state.expandedRowKeys.splice(index, 1)
			}
			state.expandedRowKeys.push(key)
		} else {
			state.expandedRowKeys.splice(key, 1)
		}
	},
	updateDetailLoading(state, detailLoading) {
		state.detailLoading = detailLoading;
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
	updateFailDetail(state, detail) {
		state.testFailDetail = detail;
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
		if (list){state.testCaseList = list}
        state.testCaseCheckAll = state.initcheckboxGroup.length === state.testCaseList.length
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
		state.MANOOption = []
		state.TestInstrumentOption = []
	},
	clearexpandedRowKeys(state) {
		state.expandedRowKeys = []
	},
	updateTableData(state, tableData) {
		state.tableData = tableData
	},
	updateProgress(state, { percent, status }) {
		state.percent = percent;
		state.statusText = status
	},
	changeComponent(state, bool) {
		state.isJobDetail = bool
	},
    changeCaseCheckAll(state, bool) {
        state.testCaseCheckAll = bool
    },
	setFilter(state, { time, key, pageObj }) {
		if (time !== undefined) {
			state.createTime = time;
			if (state.pageNum !== 1) {
				state.pageNum = 1
			}
		}
		if (key !== "All") {
			state.searchKeyword = key;
			state.dashboardJumpStatus = "All";
			if (state.pageNum !== 1) {
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
		state.detailTestCase = detailTestCase.map((item, index) => {
			item.index = index;
			return item
		})
	},
	updateVNFMOption(state, options) {
		state.VNFMOption = options;
	},
	updateVIMOption(state, options) {
		state.VIMOption = options;
	},
	updateMANOOption(state, options) {
		state.MANOOption = options;
	},
	updateTestInstrumentOption(state, options) {
		state.TestInstrumentOption = options;
	},
	updateExecutionStartTime(state, options) {
		state.executionStartTime = options;
	},
	updateTestCasePieData(state, { doneCaseNum, failedCaseNum }) {
		state.testCasePieData[0].y = doneCaseNum;
		state.testCasePieData[1].y = failedCaseNum;
	},
	updateTestJobSingleData(state, data) {
		state.testJobSingleData = data;
	},
	updateDashboardJumpStatus(state, data) {
		state.dashboardJumpStatus = data;
	},
	clearSearchKeyword(state, data) {
		state.searchKeyword = data
	},
	updateInitcheckboxGroup(state, data) {
		state.initcheckboxGroup = data;
	},
	updateCaseParamsData(state, data) {
		state.caseParamsData = data;
	},
	updatecaseChildTableData(state, { testCaseChildData, record }) {
		let index = record.index;
		state.detailTestCase[index].caseMgt = testCaseChildData
	}
}

const actions = {
	getTableData({ dispatch, commit }, { bool, loading = true }) {
		let obj = { pageNum: state.pageNum, pageSize: state.pageSize };
		if (state.createTime !== '') obj.createTime = state.createTime;
		if (state.searchKeyword !== 'All' && state.dashboardJumpStatus === "All") obj.jobStatus = state.searchKeyword;
		if (state.searchKeyword === 'All' && state.dashboardJumpStatus !== "All") obj.jobStatus = state.dashboardJumpStatus;
		let axiosrequest = axiosgetType ? axiospost : axiosget;
		if (loading) commit('updateTableLoading', true);
		axiosrequest(API.testJobMgt.testJobTable, obj).then((res) => {
			if (loading) commit('updateTableLoading', false);
			if (res.code === 200) {
				state.pagination = {
					current: state.pageNum,
					total: res.total
				};
				let tableData = res.body.map((item, index) => {
					item.createTime = moment(item.createTime).format('YYYY-MM-DD');
					item.index = res.body.length * (state.pagination.current - 1) + index + 1;
					item.actions = [item.status === "RUNNING" ? 'Stop' : 'Start', 'Edit', 'Delete', 'Download', 'More']
					return item
				})
				commit('updateTableData', tableData);
			} else if (bool) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
		}).catch(() => {
			if (bool) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
		})
	},
	createrTestJobMGT({ dispatch, commit, state }, { isEdit, values, caseReqs, message }) {
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
			// createrTime: moment(new Date()).format('YYYY-MM-DD'),
			caseReqs: caseReqs
		};
		if (values.TestVIMENV) body.vimId = values.TestVIMENV;
		if (values.TestVNFMENV) body.vnfmId = values.TestVNFMENV;
		if (values.TestMANOENV) body.manoId = values.TestMANOENV;
		if (values.TestInstrument) body.suiteId = values.TestInstrument;
		let jobId = isEdit ? state.testJobSingleData.jobId : "";
		// if (isEdit) body.jobId = jobId;
		let url = isEdit ? API.testJobMgt.testJobUpdate.replace(":jobId", jobId) : API.testJobMgt.testJobInsert;
		let axiosType = isEdit ? axiosput : axiospost;
		axiosType(url, body)
			.then((res) => {
				if (res.code === 200) {
                    dispatch('loading/showLoading', { type: 'success', toast: 'Has been added successfully' }, { root: true })
				} else dispatch('loading/showLoading', { type: 'failed', toast: "add failed" }, { root: true });
				commit('setIsShow', false);
				dispatch('getTableData', false)
			}, () => {
				message.error('Network exception, please try again')
			})
			.catch(() => {
                dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
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
	getTestCase({ commit }, { obj, message }) {
		console.log(obj, "======getTestCase")
		commit('updateTestCaseList', { spin: true });
		commit('updateFailDetail', "");
		axiosget(API.testJobMgt.testJobTestCase, obj).then(res => {
			if (res.code === 200) {
				commit('updateTestCaseList', { spin: false, list: res.body })
			} else {
				message.error('Failed to get Test Case list')
				commit('updateTestCaseList', { spin: false })
			}
		}, () => {
			message.error('Network exception, please try again')
			commit('updateTestCaseList', {
				spin: false
			})
		})
	},
	getTestFail({ dispatch }, data) {
		axiosget(API.testJobMgt.testFailedDetail.replace(":requestId", data.requestId)).then(res => {
			if (+res.code === 200) {
				let reason = JSON.stringify(res.body)
				util.pasteContent(reason);
				// commit('updateFailDetail', reason);
			} else {
				util.pasteContent("");
                dispatch('loading/showLoading', { type: 'failed', toast: "Get detail reason failed" }, { root: true })
			}
		}).catch((err) => {
			console.warn(err)
		})

	},
	delete({ dispatch }, { data }) {
		axiosdelete(API.testJobMgt.testJobDelete.replace(":jobId", data.jobId)).then(res => {
			if (res.code === 200) {
                dispatch('loading/showLoading', { type: 'success', toast: 'Deleted successfully' }, { root: true });
				dispatch('getTableData', false)
			}
		}, () => {
            dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
		})
	},
	download({ dispatch }, data) {
		let url = API.testJobMgt.testJobDownLoad.replace(":jobId", data.jobId) + "?lang=" + data.lang;
		window.open(window.location.protocol + "//" + window.location.host + url);
        dispatch('loading/showLoading', { type: 'success', toast: 'DownLoad File successfully' }, { root: true });
	},
	runTestJobMGT({ dispatch, commit }, { data }) {
		axiosput(API.testJobMgt.testJobStart.replace(":jobId", data.jobId))
			.then(res => {
				if (res.code === 200) {
                    dispatch('loading/showLoading', { type: 'success', toast: 'Successfully started testing' }, { root: true });
					data.status = "RUNNING";
					data.jobStatus = "STARTED";
					data.actions[0] = 'Stop';
					data.jobId = res.body.jobId;
					data.executionStartTime = res.body.executionStartTime;
					commit('updateTableItemData', data);
					router.push({
						name: "JobDetail", query: {
							detail: JSON.stringify(data)
						}
					})
				}
			}, () => {
                dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
			})
	},
	getProgress({ commit }, { jobId, message }) {
		axiosget(API.testJobMgt.testJobProgress.replace(":jobId", jobId))
			.then(res => {
				if (res.code === 200) {
					commit('updateProgress', {
						percent: res.body.jobProgress,
						status: res.body.jobStatus
					});
					// res.body.cases.map(item => {
                     //    res.body.scheduleCases.map(items=>{
                     //    	if(item.id === items.caseId){
                     //            items.name = item.name
					// 		}
					// 	})
					// });
					commit('updateDetailTestCase', res.body.scheduleCases);
					let doneCaseNum = 0, failedCaseNum = 0;
					if (res.body.scheduleCases && res.body.scheduleCases.length !== 0) {
						res.body.scheduleCases.forEach((item) => {
							if (item.caseStatus === 'DONE') {
								doneCaseNum++
							} else if (item.caseStatus === 'FAILED') {
								failedCaseNum++
							}
						});
					}
					commit('updateTestCasePieData', { doneCaseNum, failedCaseNum });
					if (res.body.jobProgress !== null && res.body.jobProgress !== undefined) {
						commit('updateDetailLoading', false);
						commit('updateExecutionStartTime', res.body.executionStartTime);
					}
				}
			}, () => {
				message.error('Network exception, please try again')
			});
	},

	getTestJobCaseExecutions({ dispatch, commit }, { record, expanded, message }) {
		commit('setTestCaseChildtableLoading', true);
		axiosget(API.testJobMgt.testJobCaseExecutions.replace(":requestId", record.requestId)).then(res => {
			commit('setTestCaseChildtableLoading', false);
			if (Number(res.code) === 200) {
				if (res.body.length !== 0) {
					commit('updateExpandedRowKeys', { key: record.index, expanded });
					commit('updatecaseChildTableData', { testCaseChildData: res.body, record });
				} else {
					message.info('No child data under this test case.')
				}
			}
		},
			() => {
				commit('setTestCaseChildtableLoading', false);
                dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
			})
	},

	stopJop({ dispatch, commit }, { data }) {
		// Simulation request
		axiosput(API.testJobMgt.testJobStop.replace(":jobId", data.jobId))
			.then(res => {
				if (res.code === 200) {
                    dispatch('loading/showLoading', { type: 'success', toast: 'Successfully stoped testing' }, { root: true });
					data.status = "STOPPED";
					data.actions[0] = 'Start';
					commit('updateTableItemData', data);
					dispatch('getTableData', true)
				}
			}, () => {
                dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
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
	getMANOOption({ commit }, { message, pageSize }) {
		let obj = { pageSize: pageSize }
		axiosget(API.vimVnfmMgt.manoEnvMgtTable, obj).then(res => {
			if (res.code === 200) {
				// Simulation request
				commit('updateMANOOption', res.body)
			} else {
				message.error('Failed to get SUT Name list')
			}
		}, () => {
			message.error('Network exception, please try again')
		})
	},
	getTestInstrumentOption({ commit }, { message, pageSize }) {
		let obj = {
			pageSize: pageSize,
			flag: 101
		}
		axiosget(API.suiteMgt.suiteMgtTable, obj).then(res => {
			if (res.code === 200) {
				// Simulation request
				commit('updateTestInstrumentOption', res.body)
			} else {
				message.error('Failed to get SUT Name list')
			}
		}, () => {
			message.error('Network exception, please try again')
		})
	},
	getEditTestJob({ dispatch, commit }, { data }) {
		axiosget(API.testJobMgt.testJobProgress.replace(":jobId", data.jobId))
			.then(res => {
				if (res.code === 200) {
					commit('updateTestJobSingleData', res.body);
                    if (Object.keys(res.body).length > 0) {
                        let checkedboxGroup = res.body.cases.map((item) => {
                            return item.id
                        });
                        commit('updateInitcheckboxGroup',checkedboxGroup)
                    }
					let obj = {
						specId: res.body.spec.id,
						sutId: res.body.sut.id,
					};
					dispatch("getTestCase", { obj, message: this.$message });
				}
			}, () => {
                dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
			});
	},
	jobVNFCsarsUplaod({ dispatch }, { jobId, sutvalidLind, confirm }) {
        dispatch('loading/showLoading', { type: 'success', toast: '', toastOpen: false }, { root: true });
		let updata = () => {
			confirm({
				title: "Do you need to upload this file again?",
				content: "jobId: " + jobId,
				okText: "Yes",
				cancelText: "No",
				onOk: () => {
					dispatch("jobCaseVNFReupload", { jobId, sutvalidLind })
				}
			});
		};
		axiospost(API.testJobMgt.testJobCaseVNFUplaod.replace(":jobId", jobId), null, null, updata)
			.then(res => {
				if (res.code === 200) {
                    dispatch('loading/showLoading', { type: 'success', toast: '', toastOpen: false }, { root: true });
					window.open(sutvalidLind, "_blank");
				}
			}, () => {
                dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
			});
	},
	jobCaseVNFReupload({ dispatch }, { jobId, sutvalidLind }) {
        dispatch('loading/showLoading', { type: 'success', toast: '', toastOpen: false }, { root: true });
		axiospost(API.testJobMgt.testJobCaseVNFReupload.replace(":jobId", jobId))
			.then(res => {
				if (res.code === 200) {
					window.open(sutvalidLind, "_blank");
				}
			}, () => {
                dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
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
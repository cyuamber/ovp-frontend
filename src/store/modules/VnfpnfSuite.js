import { axiosget, axiospost, axiosput, axiosdelete } from '../../utils/http';
import moment from 'moment';
import API from '../../const/apis';
import { axiosgetType } from "../../const/constant";

const state = {
    tableData: [],
    VNFOptions: [],
    SystemOptions: [],
    SuiteSingleData: {},
    source: null,
    visible: false,
    currentTab: 101,
    pagination: { current: 1, total: 0, pageSize: 10 }
};
const mutations = {
    updateTableData(state, tableData) {
        state.pagination.total = tableData.total;
        state.tableData = tableData.body.map((item, index) => {
            item.createTime = item.createTime !== null ? moment(item.createTime).format('YYYY-MM-DD') : item.createTime;
            item.index = tableData.body.length * (state.pagination.current - 1) + index + 1;
            item.action = ['Edit', 'Delete', 'Download'];
            return item
        })
    },
    updateVNFTest(state, SuiteSingleData) {
        state.SuiteSingleData = SuiteSingleData
    },
    updateVNFOptions(state, Options) {
        state.VNFOptions = Options;
    },
    updateSystemOptions(state, Options) {
        state.SystemOptions = Options;
    },
    updatePagination(state, Options) {
        state.pagination = Options;
    },
    changeTab(state, tab) {
        state.currentTab = tab
    },
    updateToken(state, source) {
        state.source = source
    },
    updateVisible(state, bool) {
        state.visible = bool
    },
};
const actions = {
    getTableData({ dispatch, commit, state }, obj) {
        let req = { pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
        Object.keys(obj).forEach(item => {
            if (obj[item] !== '' && obj[item] !== undefined) {
                req[item] = obj[item];
            }
        });
        dispatch('loading/tableLoading', true, { root: true });
        req.flag = state.currentTab;
        console.log(req, "req");
        let axiosrequest = axiosgetType ? axiospost : axiosget;
        axiosrequest(API.suiteMgt.suiteMgtTable, req).then(res => {
            if (res.code === 200) {
                commit('updateTableData', res);
                dispatch('loading/tableLoading', false, { root: true });
                if (req.createTime || req.name) dispatch('loading/showLoading', { type: 'success', toast: 'Successfully get table data' }, { root: true })
            } else {
                if (req.createTime || req.name) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
            }
        }, () => {
            if (req.createTime || req.name) dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
        }
        )
    },
    getVNFOptions({ commit }) {
        let url = API.suiteMgt.suiteType.replace(":flag", state.currentTab);
        axiosget(url).then(res => {
            if (res.code === 200) {
                commit('updateVNFOptions', res.body)
            } else {
                this.$message.error('Network exception, please try again');
            }
        })
    },
    getSystemOptions({ commit }) {
        let url = API.instrumentMgs.instrumentMgsTable;
        axiosget(url).then(res => {
            if (res.code === 200) {
                commit('updateSystemOptions', res.body)
            } else {
                this.$message.error('Network exception, please try again');
            }
        })
    },
    clearOptions({ commit }) {
        commit('updateVNFOptions', [])
    },
    getPagination({ commit }, { pagination }) {
        commit('updatePagination', pagination)
    },
    clearPagination({ commit }) {
        commit('updatePagination', { current: 1, total: 0 })
    },
    uploadVNFFile({ commit }, { formData, message }) {
        axiospost(API.uploadFile, { file: formData }, true).then(res => {
            commit('updateToken', null);
            if (res.code === 200) message.success('Upload successfully');
            else message.error('Upload failed')
        }, () => {
            message.error('Network exception, please try again');
            commit('updateToken', null)
        })
    },
    createOrEditTestMeter({ dispatch, state }, { data, isEdit, message }) {
        let url = isEdit ? API.suiteMgt.suiteMgtUpdate : API.suiteMgt.suiteMgtInsert;
        let axiosType = isEdit ? axiosput : axiospost;
        axiosType(url, data)
            .then((res) => {
                if (res.code === 200) {
                    dispatch('loading/showLoading', { type: 'success', toast: isEdit ? 'Successfully updated' : 'Has been added successfully' }, { root: true });
                    let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
                    dispatch('getTableData', obj)
                }else if(res.code === 417){
                    message.error(res.body)
                }  else dispatch('loading/showLoading', { type: 'failed', toast: isEdit ? 'Update failed' : 'add failed' }, { root: true })
            },
                () => {
                    dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
                })
    },
    deleteTestMeter({ dispatch, state }, {id, message}) {
        let url = API.suiteMgt.suiteMgtDelete.replace(":id", id);
        axiosdelete(url).then(res => {
            if (res.code === 200) {
                dispatch('loading/showLoading', { type: 'success', toast: "Deleted successfully" }, { root: true });
                let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
                dispatch('getTableData', obj)
            }else if(res.code === 417){
                message.error(res.body)
            }  else dispatch('loading/showLoading', { type: 'failed', toast: "Network exception, please try again" }, { root: true })
        })
    },
    downloadFile({ dispatch }, {fileName,fileAliasName}) {
        let url = API.downloadFile.replace(":filealias",fileAliasName).replace(":filename", fileName);
        window.open(window.location.protocol + "//" + window.location.host + url);
        dispatch('loading/showLoading', { type: 'success', toast: "DownLoad File successfully" }, { root: true });
    }

};
const getters = {

};
export default {
    state, mutations, actions, getters, namespaced: true,
}
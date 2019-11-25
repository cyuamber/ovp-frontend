import { axiosget, axiospost, axiosput, axiosdelete } from '../../utils/http';
import moment from 'moment';
import API from '../../const/apis';
import { axiosgetType } from "../../const/constant";

const state = {
    tableData: [],
    VNFOptions: [],
    SuiteSingleData: {},
    tableLoading: false,
    source: null,
    visible: false,
    currentTab: 101,
    pagination: { current: 1, total: 0, pageSize: 10 },
    loadingMessage: { type: '', toast: '' }
};
const mutations = {
    updateTableData(state, tableData) {
        state.pagination.total = tableData.total;
        state.tableData = tableData.body.map((item, index) => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD');
            item.index = tableData.body.length * (state.pagination.current - 1) + index + 1;
            item.action = ['Edit', 'Delete','Download'];
            return item
        })
    },
    updateVNFTest(state, SuiteSingleData) {
        state.SuiteSingleData = SuiteSingleData
    },
    updateVNFOptions(state, Options) {
        state.VNFOptions = Options;
    },
    updatePagination(state, Options) {
        state.pagination = Options;
    },
    changeTab(state, tab) {
        state.currentTab = tab
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
    updateTableLoading(state, tableLoading) {
        state.tableLoading = tableLoading
    },
    updateVisible(state, bool) {
        state.visible = bool
    },
};
const actions = {
    getTableData({ commit, state }, obj) {
        console.log(obj, "obj")
        let req = { pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
        Object.keys(obj).forEach(item => {
            if (obj[item] !== '' && obj[item] !== undefined) {
                req[item] = obj[item];
            }
        });
        commit('updateTableLoading', true);
        req.flag = state.currentTab;
        console.log(req, "req");
        let axiosrequest = axiosgetType ? axiospost : axiosget;
        axiosrequest(API.suiteMgt.suiteMgtTable, req).then(res => {
            if (res.code === 200) {
                commit('updateTableData', res);
                commit('updateTableLoading', false);
                if (req.createTime || req.name) commit('updateSuccessMessage', 'Successfully get table data')
            } else {
                if (req.createTime || req.name) commit('updateFailedMessage', 'Network exception, please try again')
            }
        }, () => {
            if (req.createTime || req.name) commit('updateFailedMessage', 'Network exception, please try again')
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
        console.log(formData.get("file"), "uploadVNFFile------");
        axiospost(API.uploadFile, { file: formData }, true).then(res => {
            commit('updateToken', null);
            if (res.code === 200) message.success('Upload successfully');
            else message.error('Upload failed')
        }, () => {
            message.error('Network exception, please try again');
            commit('updateToken', null)
        })
    },
    createOrEditTestMeter({ commit, dispatch, state }, { data, isEdit }) {
        let url = isEdit ? API.suiteMgt.suiteMgtUpdate : API.suiteMgt.suiteMgtInsert;
        let axiosType = isEdit ? axiosput : axiospost;
        axiosType(url, data)
            .then((res) => {
                if (res.code === 200) {
                    commit('updateSuccessMessage', isEdit ? 'Successfully updated' : 'Has been added successfully');
                    let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
                    dispatch('getTableData', obj)
                } else commit('updateFailedMessage', isEdit ? 'Update failed' : 'add failed')
            },
                () => {
                    commit('updateFailedMessage', 'Network exception, please try again')
                })
    },
    deleteTestMeter({ commit, dispatch, state }, data) {
        let url = API.suiteMgt.suiteMgtDelete.replace(":id", data.id);
        axiosdelete(url).then(res => {
            if (res.code === 200) {
                commit('updateSuccessMessage', 'Deleted successfully');
                let obj = { flag: state.currentTab, pageNum: state.pagination.current, pageSize: state.pagination.pageSize };
                dispatch('getTableData', obj)
            } else commit('updateFailedMessage', 'Network exception, please try again')
        })
    },
    downloadFile({ commit }, data){
        let url = API.downloadFile.replace(":filename", data.fileName);
        axiosget(url).then(() => {
                commit('updateSuccessMessage', 'DownLoad File successfully');
            },
            () => {
                commit('updateFailedMessage', 'Network exception, please try again')
            })
    }

};
const getters = {

};
export default {
    state, mutations, actions, getters, namespaced: true,
}
import { axiosget } from "../../utils/http";
import moment from "moment";

const state = {
    tableData: [],
    pagination: { current: 1, total: 0 },
    loadingMessage: { type: "", toast: "" },
    searchLoading: false,
    tableLoading: false,
    clearFilter: false,
};
const mutations = {
    updateTableData(state, tableData) {
        state.pagination.total = tableData.total;
        state.tableData = tableData.body.map((item, index) => {
            item.publishTime = moment(item.publishTime).format("YYYY-MM-DD");
            item.index =
                tableData.body.length * (state.pagination.current - 1) +
                index +
                1;
            return item;
        });
    },
    updatePagination(state, Options) {
        state.pagination = Options;
    },
    updateFailedMessage(state, toast) {
        state.loadingMessage = {
            type: "failed",
            toast,
        };
    },
    updateSuccessMessage(state, toast) {
        state.loadingMessage = {
            type: "success",
            toast,
        };
    },
    updateSearchLoading(state, searchLoading) {
        state.searchLoading = searchLoading;
    },
    updateTableLoading(state, tableLoading) {
        state.tableLoading = tableLoading;
    },
    updateclearFilter(state, clearFilter) {
        state.clearFilter = clearFilter;
    },
};
const actions = {
    getTableData({ commit }, obj) {
        let req = {};
        if (obj) {
            Object.keys(obj).forEach((item) => {
                if (obj[item] !== "" && obj[item] !== undefined) {
                    req[item] = obj[item];
                }
            });
        }
        commit("updateTableLoading", true);
        axiosget("/getTestCaseMGTs", req).then(
            (res) => {
                if (res.code === 200) {
                    commit("updateTableData", res);
                    if (
                        req.publishTime ||
                        req.testCaseName ||
                        req.testCaseVersion ||
                        state.clearFilter
                    ) {
                        commit(
                            "updateSuccessMessage",
                            "Successfully get table data"
                        );
                    }
                    commit("updateTableLoading", false);
                } else {
                    if (
                        req.publishTime ||
                        req.testCaseName ||
                        req.testCaseVersion ||
                        state.clearFilter
                    )
                        commit(
                            "updateFailedMessage",
                            "Network exception, please try again"
                        );
                }
                commit("updateSearchLoading", false);
            },
            () => {
                if (
                    req.publishTime ||
                    req.testCaseName ||
                    req.testCaseVersion ||
                    state.clearFilter
                )
                    commit(
                        "updateFailedMessage",
                        "Network exception, please try again"
                    );
            }
        );
    },
    getPagination({ commit }, { pagination }) {
        commit("updatePagination", pagination);
    },
    clearPagination({ commit }) {
        commit("updatePagination", { current: 1, total: 0 });
    },
};
const getters = {};
export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true,
};

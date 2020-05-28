import { axiosdelete, axiospost, axiosput } from "../../utils/http";
import API from "../../const/apis";
import moment from "moment";

const state = {
    tableData: [],
    singleData: {},
    pagination: { current: 1, total: 0 },
};
const mutations = {
    updateTableData(state, tableData) {
        state.pagination.total = tableData.total;
        state.tableData = tableData.body.map((item, index) => {
            item.createTime =
                item.createTime !== null
                    ? moment(item.createTime).format("YYYY-MM-DD")
                    : item.createTime;
            item.index =
                tableData.body.length * (state.pagination.current - 1) +
                index +
                1;
            item.action = ["Edit", "Delete"];
            return item;
        });
    },
    updateMeterSys(state, singleData) {
        state.singleData = singleData;
    },
    updatePagination(state, Options) {
        state.pagination = Options;
    },
};
const actions = {
    getTableData({ dispatch, commit }, obj) {
        let req = {};
        Object.keys(obj).forEach((item) => {
            if (obj[item] !== "" && obj[item] !== undefined) {
                req[item] = obj[item];
            }
        });
        dispatch("loading/tableLoading", true, { root: true });
        axiospost(API.instrumentMgs.instrumentMgsTable, req).then(
            (res) => {
                if (res.code === 200) {
                    commit("updateTableData", res);
                    dispatch("loading/tableLoading", false, { root: true });
                    if (req.createTime || req.name) {
                        dispatch(
                            "loading/showLoading",
                            {
                                type: "success",
                                toast: "Successfully get table data",
                            },
                            { root: true }
                        );
                    }
                } else {
                    if (req.createTime || req.name)
                        dispatch(
                            "loading/showLoading",
                            {
                                type: "failed",
                                toast: "Network exception, please try again",
                            },
                            { root: true }
                        );
                }
            },
            () => {
                if (req.createTime || req.name)
                    dispatch(
                        "loading/showLoading",
                        {
                            type: "failed",
                            toast: "Network exception, please try again",
                        },
                        { root: true }
                    );
            }
        );
    },
    getMeterSys({ commit }, data) {
        commit("updateMeterSys", data);
    },
    getPagination({ commit }, { pagination }) {
        commit("updatePagination", pagination);
    },
    clearPagination({ commit }) {
        commit("updatePagination", { current: 1, total: 0 });
    },
    createOrEditTestIns({ dispatch }, { isEdit, data }) {
        let url = isEdit
            ? API.instrumentMgs.instrumentMgsUpdate
            : API.instrumentMgs.instrumentMgsInsert;
        let axiosType = isEdit ? axiosput : axiospost;
        axiosType(url, data).then(
            (res) => {
                if (res.code === 200) {
                    dispatch(
                        "loading/showLoading",
                        {
                            type: "success",
                            toast: isEdit
                                ? "Successfully updated"
                                : "Has been added successfully",
                        },
                        { root: true }
                    );
                    dispatch("getTableData", {});
                }
            },
            () => {
                dispatch(
                    "loading/showLoading",
                    {
                        type: "failed",
                        toast: "Network exception, please try again",
                    },
                    { root: true }
                );
            }
        );
    },
    deleteMeterSys({ dispatch }, { id }) {
        axiosdelete(
            API.instrumentMgs.instrumentMgsDelete.replace(":id", id)
        ).then(
            (res) => {
                if (res.code === 200) {
                    dispatch(
                        "loading/showLoading",
                        { type: "success", toast: "Deleted successfully" },
                        { root: true }
                    );
                    dispatch("getTableData", {});
                }
            },
            () => {
                dispatch(
                    "loading/showLoading",
                    {
                        type: "failed",
                        toast: "Network exception, please try again",
                    },
                    { root: true }
                );
            }
        );
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

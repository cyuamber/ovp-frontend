import { axiospost, axiosput, axiosdelete } from '../../../utils/http';
import API from '../../../const/apis';
import * as types from './mutations_types';

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
                    commit(types.UPDATE_TABLE_DATA, res);
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
        commit(types.UPDATE_METER_SYS, data);
    },
    getPagination({ commit }, { pagination }) {
        commit(types.UPDATE_PAGINATION, pagination);
    },
    clearPagination({ commit }) {
        commit(types.UPDATE_PAGINATION, { current: 1, total: 0 });
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
export default actions;
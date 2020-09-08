import {
    axiosget,
    axiospost,
    axiosput,
    axiosdelete,
} from "../../../utils/http";
import API from "../../../const/apis";
import reqwest from "reqwest";
import * as types from "./mutations_types";
import state from "./state";

const actions = {
    setParams({ state, dispatch }, isFilter) {
        let paramsObj = {};
        if (state.createTime !== "") paramsObj.createTime = state.createTime;
        if (state.keyword !== "") paramsObj.name = state.keyword;
        if (state.pageNum !== "") {
            paramsObj.pageNum = state.pageNum;
            paramsObj.pageSize = state.pageSize;
        }
        paramsObj.flag = state.currentTab;
        dispatch("getTableData", {
            paramsObj,
            isFilter,
        });
    },
    getTableData({ dispatch, commit, state }, { paramsObj, isFilter }) {
        dispatch("loading/tableLoading", true, { root: true });
        paramsObj.flag = state.currentTab;
        paramsObj.pageNum = state.pageNum;
        paramsObj.pageSize = state.pageSize;
        axiosget(API.sutMgt.sutMgtTable, paramsObj).then(
            (res) => {
                commit(types.UPDATE_TABLE_DATA, res);
                dispatch("loading/tableLoading", false, { root: true });
                if (isFilter) {
                    dispatch(
                        "loading/showLoading",
                        {
                            type: "success",
                            toast: "Successfully get table data",
                        },
                        { root: true }
                    );
                }
            },
            () => {
                if (isFilter) {
                    dispatch(
                        "loading/showLoading",
                        {
                            type: "failed",
                            toast: "Network exception, please try again",
                        },
                        { root: true }
                    );
                }
            }
        );
    },
    getVNFOptions({ commit, state }) {
        let url = API.sutMgt.sutMgtType.replace(":flag", state.currentTab);
        axiosget(url).then((res) => {
            commit(types.UPDATE_VNF_OPTIONS, res.body);
        });
    },
    createOrEditVNFTest({ state, dispatch }, { data, isEdit }) {
        if (isEdit) data.id = state.VNFTest.id;
        let url = isEdit ? API.sutMgt.sutMgtUpdate : API.sutMgt.sutMgtInsert;
        let apiType = isEdit ? axiosput : axiospost;
        apiType(url, data).then(
            () => {
                dispatch(
                    "loading/showLoading",
                    {
                        type: "success",
                        toast: isEdit
                            ? "Successfully updated"
                            : "Successfully added",
                        toastOpen: true,
                    },
                    { root: true }
                );
                let paramsObj = { flag: state.currentTab };
                dispatch("getTableData", { paramsObj, isFilter: false });
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
    deleteVNFTest({ dispatch }, { id }) {
        axiosdelete(API.sutMgt.sutMgtDelete.replace(":id", id)).then(
            () => {
                dispatch(
                    "loading/showLoading",
                    { type: "success", toast: "Deleted successfully" },
                    { root: true }
                );
                let paramsObj = { flag: state.currentTab };
                dispatch("getTableData", { paramsObj, isFilter: false });
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
    upload({ commit }, { formData, message }) {
        reqwest({
            url: API.uploadFile,
            method: "post",
            processData: false,
            data: formData,
            success: () => {
                message.success("Upload successfully");
                commit(types.UPDATE_TOKEN, null);
            },
            error: () => {
                message.error("Upload failed");
                commit(types.UPDATE_TOKEN, null);
            },
        });
    },
    downloadFile({ dispatch }, { fileName, fileAliasName }) {
        let url = API.downloadFile
            .replace(":filealias", fileAliasName)
            .replace(":filename", fileName);
        window.open(
            window.location.protocol + "//" + window.location.host + url
        );
        dispatch(
            "loading/showLoading",
            { type: "success", toast: "DownLoad File successfully" },
            { root: true }
        );
    },
};

export default actions;

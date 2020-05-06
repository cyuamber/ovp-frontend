import { axiosget, axiospost, axiosput, axiosdelete } from "../../utils/http";
import { axiosgetType } from "../../const/constant";
import API from "../../const/apis";
import moment from "moment";

const state = {
    VIMTableData: [],
    VNFMTableData: [],
    MANOTableData: [],
    pagination: { current: 1, total: 0 },
    searchKeyword: "",
    createTime: "",
    pageNum: 1,
    pageSize: 10,
    currentTab: "VIM ENV",
    visible: false,
    cloudTypeOptions: [],
    regionIdOptions: [],
    initValues: {},
};

const mutations = {
    updateTableData(state, res) {
        state.pagination = {
            current: state.pageNum,
            total: res.total,
        };
        let data = res.body.map((item, index) => {
            item.action = ["Edit", "Delete"];
            item.index =
                res.body.length * (state.pagination.current - 1) + index + 1;
            item.createTime =
                item.createTime !== null
                    ? moment(item.createTime).format("YYYY-MM-DD")
                    : item.createTime;
            return item;
        });
        if (state.currentTab === "VIM ENV") {
            state.VIMTableData = data;
        } else if (state.currentTab === "VNFM ENV") {
            state.VNFMTableData = data;
        } else if (state.currentTab === "MANO ENV") {
            state.MANOTableData = data;
        }
    },
    changeTab(state, tab) {
        state.currentTab = tab;
    },
    setFilterItem(state, { time, key, pageObj, isSearch, message }) {
        if (isSearch) {
            if (
                key === "" &&
                state.createTime === "" &&
                state.searchKeyword === ""
            ) {
                message.warning("Please enter valid search information");
                return;
            }
        }
        if (time !== undefined) {
            state.createTime = time;
            // Jump to the first page after adding search criteria
            if (state.pageNum !== 1) {
                state.pageNum = 1;
            }
        } else if (key !== undefined) {
            state.searchKeyword = key;
            // Jump to the first page after adding search criteria
            if (state.pageNum !== 1) {
                state.pageNum = 1;
            }
        } else if (pageObj !== undefined) {
            state.pageNum = pageObj.current;
            state.pageSize = pageObj.pageSize;
        }
    },
    updateVisible(state, bool) {
        state.visible = bool;
    },
    updateRegionIdOptions(state, { regionIdList }) {
        state.regionIdOptions = regionIdList;
    },
    updateCloudTypeOptions(state, { CloudTypeList }) {
        state.cloudTypeOptions = CloudTypeList;
    },
    setInitValues(state, values) {
        if (values.item !== "Edit") {
            state.initValues = values;
        } else {
            state.initValues = values.record;
        }
    },
    updateMANOTypeOptions(state, { CloudTypeList }) {
        state.MANOTypeOptions = CloudTypeList;
    },
};

const actions = {
    setParams({ state, dispatch }) {
        let paramsObj = {};
        if (state.createTime !== "") paramsObj.createTime = state.createTime;
        if (state.searchKeyword !== "") {
            if (state.currentTab === "VIM ENV") {
                paramsObj.dictLabel = state.searchKeyword;
            } else paramsObj.name = state.searchKeyword;
        }
        if (state.pageNum !== "") {
            paramsObj.pageNum = state.pageNum;
            paramsObj.pageSize = state.pageSize;
        }
        dispatch("getTableData", { paramsObj, isFilter: true });
    },
    getTableData({ dispatch, commit, state }, { paramsObj, isFilter }) {
        let url = "";
        switch (state.currentTab) {
            case "VIM ENV":
                url = API.vimVnfmMgt.vimEnvMgtTable;
                break;
            case "VNFM ENV":
                url = API.vimVnfmMgt.vnfmEnvMgtTable;
                break;
            case "MANO ENV":
                url = API.vimVnfmMgt.manoEnvMgtTable;
                break;
            default:
                break;
        }

        paramsObj.pageNum = state.pageNum;
        paramsObj.pageSize = state.pageSize;
        let axiosrequest = axiosgetType ? axiospost : axiosget;
        dispatch("loading/tableLoading", true, { root: true });
        let failedCallback = () => {
            if (isFilter) {
                dispatch(
                    "loading/showLoading",
                    { type: "failed", toast: "Failed to get form data" },
                    { root: true }
                );
            }
        };
        axiosrequest(url, paramsObj, failedCallback).then(
            (res) => {
                if (res.code === 200) {
                    commit("updateTableData", res);
                    dispatch("loading/tableLoading", false, { root: true });
                    if (isFilter)
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
                if (isFilter)
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
    deleteData({ dispatch, state }, { data }) {
        let url = "";
        switch (state.currentTab) {
            case "VIM ENV":
                url = API.vimVnfmMgt.vimEnvMgtDelete;
                break;
            case "VNFM ENV":
                url = API.vimVnfmMgt.vnfmEnvMgtDelete;
                break;
            case "MANO ENV":
                url = API.vimVnfmMgt.manoMgtDelete;
                break;
            default:
                break;
        }
        axiosdelete(url.replace(":id", data.id))
            .then((res) => {
                if (res.code === 200) {
                    dispatch(
                        "loading/showLoading",
                        { type: "success", toast: "Deleted successfully" },
                        { root: true }
                    );
                    let paramsObj = {
                        pageNumstate: state.pageNum,
                        pageSize: state.pageSize,
                    };
                    dispatch("getTableData", { paramsObj });
                }
            })
            .catch(() => {
                dispatch(
                    "loading/showLoading",
                    {
                        type: "failed",
                        toast: "Network exception, please try again",
                    },
                    { root: true }
                );
            });
    },
    getRegionIdOptions({ commit, dispatch }) {
        axiosget(API.vimVnfmMgt.cloudRegionID).then((res) => {
            if (res.code === 200) {
                let idList = [];
                res.body.map((item) => {
                    idList.push(item.dictValue);
                });
                commit("updateRegionIdOptions", { regionIdList: idList });
                dispatch("getCloudTypeOptions", { selectRegionId: idList[0] });
            } else {
                this.$message.error("Network exception, please try again");
            }
        });
        // Simulation request
    },
    getCloudTypeOptions({ commit }) {
        let url = API.vimVnfmMgt.cloudType;
        axiosget(url).then((res) => {
            if (res.code === 200) {
                commit("updateCloudTypeOptions", { CloudTypeList: res.body });
            } else {
                this.$message.error("Network exception, please try again");
            }
        });
        // Simulation request
    },
    loginVIN({ state, dispatch }, { isEdit, data }) {
        if (isEdit) data.id = state.initValues.id;
        let url = isEdit
            ? state.currentTab === "VIM ENV"
                ? API.vimVnfmMgt.vimEnvMgtUpdate
                : state.currentTab === "VNFM ENV"
                ? API.vimVnfmMgt.vnfmEnvMgtUpdate
                : API.vimVnfmMgt.manoMgtUpdate.replace(":manoId", data.id)
            : state.currentTab === "VIM ENV"
            ? API.vimVnfmMgt.vimEnvMgtInsert
            : state.currentTab === "VNFM ENV"
            ? API.vimVnfmMgt.vnfmEnvMgtInsert
            : API.vimVnfmMgt.manoMgtInsert;
        let axiosType = isEdit ? axiosput : axiospost;
        axiosType(url, data).then(
            (res) => {
                if (res.code === 200) {
                    dispatch(
                        "loading/showLoading",
                        {
                            type: "success",
                            toast: this.isEdit
                                ? "Successfully updated"
                                : "Has been added successfully",
                        },
                        { root: true }
                    );
                    let paramsObj = {
                        pageNum: state.pageNum,
                        pageSize: state.pageSize,
                    };
                    dispatch("getTableData", { paramsObj });
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
    getMANOTypeOptions({ commit }) {
        let url = API.vimVnfmMgt.MANOType;
        axiosget(url).then((res) => {
            if (res.code === 200) {
                commit("updateCloudTypeOptions", { CloudTypeList: res.body });
            } else {
                this.$message.error("Network exception, please try again");
            }
        });
    },
};

const getters = {};

export default { state, mutations, actions, getters, namespaced: true };

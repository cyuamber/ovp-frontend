import moment from "moment";
import * as types from "./mutations_types";

const mutations = {
    [types.UPDATE_TABLE_DATA](state, tableData) {
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
            item.action = ["Edit", "Delete", "Download"];
            return item;
        });
    },
    [types.UPDATE_VNF_TEST](state, SuiteSingleData) {
        state.SuiteSingleData = SuiteSingleData;
    },
    [types.UPDATE_VNF_OPTIONS](state, Options) {
        state.VNFOptions = Options;
    },
    [types.UPDATE_SYSTEM_OPTIONS](state, Options) {
        state.SystemOptions = Options;
    },
    [types.UPDATE_PAGINATION](state, Options) {
        state.pagination = Options;
    },
    [types.CHANGE_TAB](state, tab) {
        state.currentTab = tab;
    },
    [types.UPDATE_TOKEN](state, source) {
        state.source = source;
    },
    [types.UPDATE_VISIBLE](state, bool) {
        state.visible = bool;
    },
};

export default mutations;

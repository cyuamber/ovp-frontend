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
            item.action = ["Edit", "Delete"];
            return item;
        });
    },
    [types.UPDATE_METER_SYS](state, singleData) {
        state.singleData = singleData;
    },
    [types.UPDATE_PAGINATION](state, Options) {
        state.pagination = Options;
    },
    [types.UPDATE_VISIBLE](state, bool) {
        state.visible = bool;
    },
    [types.EDIT_STATUS](state, bool) {
        state.editStatus = bool;
    },
};

export default mutations;

import moment from 'moment';
import * as types from './mutations_types';
const mutations = {
	[types.UPDATE_TABLE_DATA](state, tableData) {
		state.pagination = {
			current: state.pageNum,
			total: tableData.total
		};
		state.tableData = tableData.body.map((item, index) => {
			item.createTime = item.createTime !== null ? moment(item.createTime).format('YYYY-MM-DD') : item.createTime;
			item.index = tableData.body.length * (state.pagination.current - 1) + index + 1;
			item.action = ['Edit', 'Delete', 'Download'];
			return item;
		});
	},
	[types.UPDATE_VISIBLE](state, bool) {
		state.visible = bool;
	},
	[types.CHANGE_TAB](state, tab) {
		state.currentTab = tab;
	},
	[types.UPDATE_VNF_TEST](state, VNFTest) {
		state.VNFTest = VNFTest;
	},
	[types.UPDATE_VNF_OPTIONS](state, options) {
		if (options) state.VNFOptions = options;
	},
	[types.UPDATE_TOKEN](state, source) {
		state.source = source;
	},
	[types.SET_FILTER_ITEM](state, { time, key, pageObj, isSearch, message }) {
		if (isSearch) {
			if (key === '' && state.createTime === '' && state.keyword === '') {
				message.warning('Please enter valid search information');
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
			state.keyword = key;
			// Jump to the first page after adding search criteria
			if (state.pageNum !== 1) {
				state.pageNum = 1;
			}
		} else if (pageObj !== undefined) {
			state.pageNum = pageObj.current;
			state.pageSize = pageObj.pageSize;
		}
	}
};

export default mutations;
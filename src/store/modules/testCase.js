import {axiosget} from '../../utils/http';
import moment from 'moment';

const state = {
    tableData: [],
    pagination: {current: 1 , total: 0}
};
const mutations = {
    updateTableData (state,tableData) {
        state.pagination.total = tableData.total;
        state.tableData = tableData.body.map( (item, index) => {
            item.publishTime = moment(item.publishTime).format('YYYY-MM-DD');
            item.index = tableData.body.length * (state.pagination.current -1) + index+1;
            return item
        })
    },
    updatePagination(state, Options){
        state.pagination = Options;
    }
};
const actions = {
    getTableData ({commit}, obj){
        let req = {};
        Object.keys(obj).forEach(item =>{
            if(obj[item] !== '' &&obj[item] !== undefined ){
                req[item]=obj[item];
            }
        });
        axiosget('/getTestCaseMGTs', req).then(res => {
            if(res.code === 200){
                commit('updateTableData',res)
            }else {
                this.$message.error('Network exception, please try again');
            }
        })
    },
    getPagination({commit},{pagination}){
        commit('updatePagination',pagination)
    },
    clearPagination({commit}){
        commit('updatePagination', {current: 1 , total: 0})
    },
};
const getters = {

};
export default {
    state, mutations, actions, getters, namespaced: true,
}
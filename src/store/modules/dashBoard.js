import { axiosget } from '../../utils/http';
import API from '../../const/apis';
// import moment from 'moment';

const state = {
    linesData:{
        xAxis:[],
        legend:[],
        series:[]
    }
};
const mutations = {
    updateLinesData(state, data) {
        data.forEach((item)=>{
            Object.keys(data[0]).forEach((items)=>{
                if(items === 'range')state.linesData.xAxis.push(item[items])
                else if(state.linesData.legend.includes(items) ===false){
                    state.linesData.legend.push(items);
                    let singleData = [];
                    singleData.push(item[items])
                    state.linesData.series.push({
                        name:items,
                        type: "column",
                        data:singleData
                    })
                }else {
                    state.linesData.series.map((seriesItem)=>{
                        if(seriesItem.name === items)seriesItem.data.push(item[items])
                    })
                }
            })
        });
        console.log(state.linesData,"----> state.linesData")
    },

};
const actions = {
    getLinesData({ commit },{ message }) {
        axiosget(API.dashboard.PassCaseAmount7Days).then(res => {
            if (res.code === 200) {
                commit('updateLinesData', res.body);
            } else message.error('Network exception, please try again')
        },
            () => {
                message.error('Network exception, please try again')
            }
        )
    },

};
const getters = {

};
export default {
    state, mutations, actions, getters, namespaced: true,
}
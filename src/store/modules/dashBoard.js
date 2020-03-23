import { axiosget } from '../../utils/http';
import API from '../../const/apis';
// import moment from 'moment';

const state = {
    liveData: {
        x: null,
        y: null
    },
    linesData: {
        xAxis: [],
        legend: [],
        series: []
    },
    linesxAxisLength: 0,
    testJobCirclesData: [],
    SUTAmountData: [],
    SUTAmountColors: ["#46b8e0", "#ffca52", "#34314b"],
    jobAmountData: [],
    jobAmountColors: ["#cae76e", "#e94e75"],
    jobAmountClickText: ["DONE", "FAILED"],
    testEnvAmountData: [],
    testEnvAmountColors: ["#ea9e9f", "#f9ebc9", "#a89c8e"],
};
const mutations = {
    updateLiveData(state, data) {
        state.liveData.x = data.x
        state.liveData.y = data.y
        // console.log(state.liveData,"state.liveData")
    },
    updateLinesData(state, data) {
        if (data.length > 0) {
            data.forEach((item) => {
                Object.keys(data[0]).forEach((items) => {
                    if (items === 'range') state.linesData.xAxis.push(item[items])
                    else if (state.linesData.legend.includes(items) === false) {
                        state.linesData.legend.push(items);
                        let singleData = [];
                        singleData.push(item[items])
                        state.linesData.series.push({
                            name: items,
                            type: "column",
                            data: singleData
                        })
                    } else {
                        state.linesData.series.map((seriesItem) => {
                            if (seriesItem.name === items) seriesItem.data.push(item[items])
                        })
                    }
                })
            });
        } else {
            state.linesData = {
                xAxis: [],
                legend: [],
                series: []
            };
        }
        // console.log(state.linesData, "----> state.linesData")
    },
    updateLinesxAxisLength(state, data) {
        state.linesxAxisLength = data;
    },
    updateTestJobCirclesData(state, data) {
        if (Object.keys(data).length > 0) {
            Object.keys(data).forEach((item) => {
                let singleData = [];
                singleData.push(item, data[item]);
                state.testJobCirclesData.push(singleData)
            });
        } else state.testJobCirclesData = [];
        // console.log(state.testJobCirclesData, "----> state.testJobCirclesData")
    },
    updateSUTAmountData(state, data) {
        if (Object.keys(data).length > 0) {
            Object.keys(data).forEach((item, index) => {
                state.SUTAmountData.push({
                    name: item === 'pnfcount' ? 'PNF Count' : (item === 'nfvicount' ? 'NFVI Count' : 'VNF Count'),
                    y: data[item],
                    color: state.SUTAmountColors[index]
                });
            });
        } else state.SUTAmountData = [];
        // console.log(state.SUTAmountData, "----> state.SUTAmountData")
    },
    updateJobAmountData(state, data) {
        if (Object.keys(data).length > 0) {
            Object.keys(data).forEach((item, index) => {
                state.jobAmountData.push({
                    name: item === 'successcount' ? 'DONE' : 'FAILED',
                    y: data[item],
                    color: state.jobAmountColors[index],
                    events: {
                        click: () => {
                            // console.log("click:", state.jobAmountClickText[index]);
                            window.location.href =
                                window.location.origin + window.location.pathname + "/#/testjobmgt?status=" + state.jobAmountClickText[index];
                        }
                    }
                });
            });
        } else state.jobAmountData = [];
        // console.log(state.jobAmountData, "----> state.jobAmountData")
    },
    updateTestEnvAmountData(state, data) {
        if (Object.keys(data).length > 0) {
            Object.keys(data).forEach((item, index) => {
                state.testEnvAmountData.push({
                    name: item === 'manocount' ? 'Mano Count' : (item === 'vimcount' ? 'VIM Count' : 'VNFM Count'),
                    y: data[item],
                    color: state.testEnvAmountColors[index]
                });
            });
        } else state.testEnvAmountData = [];
        // console.log(state.testEnvAmountData, "----> state.testEnvAmountData")
    },

};
const actions = {
    getLiveData({ commit }, { message }) {
        axiosget(API.dashboard.liveCaseAmount).then(res => {
            if (res.code === 200) {
                let x = (new Date()).getTime();
                commit('updateLiveData', { x, y: res.body.livecount });
            } else message.error('Network exception, please try again')
        },
            () => {
                message.error('Network exception, please try again')
            }
        )
    },
    getLinesData({ commit }, { message }) {
        axiosget(API.dashboard.PassCaseAmount7Days).then(res => {
            if (res.code === 200) {
                commit('updateLinesData', res.body);
                commit('updateLinesxAxisLength', res.body.length);
            } else message.error('Network exception, please try again')
        },
            () => {
                message.error('Network exception, please try again')
            }
        )
    },
    getTestJobCirclesData({ commit }, { message }) {
        axiosget(API.dashboard.jobsFlowAmount).then(res => {
            if (res.code === 200) {
                commit('updateTestJobCirclesData', res.body);
            } else message.error('Network exception, please try again')
        },
            () => {
                message.error('Network exception, please try again')
            }
        )
    },
    getSUTAmountData({ commit }, { message }) {
        axiosget(API.dashboard.sutAmount).then(res => {
            if (res.code === 200) {
                commit('updateSUTAmountData', res.body);
            } else message.error('Network exception, please try again')
        },
            () => {
                message.error('Network exception, please try again')
            }
        )
    },
    getJobAmountData({ commit }, { message }) {
        axiosget(API.dashboard.jobsAmount).then(res => {
            if (res.code === 200) {
                commit('updateJobAmountData', res.body);
            } else message.error('Network exception, please try again')
        },
            () => {
                message.error('Network exception, please try again')
            }
        )
    },
    getTestEnvAmountData({ commit }, { message }) {
        axiosget(API.dashboard.testEnvAmount).then(res => {
            if (res.code === 200) {
                commit('updateTestEnvAmountData', res.body);
            } else message.error('Network exception, please try again')
        },
            () => {
                message.error('Network exception, please try again')
            }
        )
    },
    clearData({ commit }) {
        commit('updateLiveData', { x: null, y: null });
        commit('updateLinesData', []);
        commit('updateTestJobCirclesData', []);
        commit('updateSUTAmountData', []);
        commit('updateJobAmountData', []);
        commit('updateTestEnvAmountData', []);
    }
};
const getters = {

};
export default {
    state, mutations, actions, getters, namespaced: true,
}
import * as types from './mutations_types';
const mutations = {
  [types.UPDATE_LIVE_DATA](state, data) {
      state.liveData.x = data.x;
      state.liveData.y = data.y;
      // console.log(state.liveData,"state.liveData")
  },
  [types.UPDATE_LINES_DATA](state, data) {
      if (data.length > 0) {
          data.forEach((item) => {
              Object.keys(data[0]).forEach((items) => {
                  if (items === 'range') state.linesData.xAxis.push(item[items]);
                  else if (state.linesData.legend.includes(items) === false) {
                      state.linesData.legend.push(items);
                      let singleData = [];
                      singleData.push(item[items]);
                      state.linesData.series.push({
                          name: items,
                          type: "column",
                          data: singleData
                      });
                  } else {
                      state.linesData.series.map((seriesItem) => {
                          if (seriesItem.name === items) seriesItem.data.push(item[items]);
                      });
                  }
              });
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
  [types.UPDATE_LINES_XAXIS_LENGTH](state, data) {
      state.linesxAxisLength = data;
  },
  [types.UPDATE_TESTJOB_CIRCLES_DATA](state, data) {
      if (Object.keys(data).length > 0) {
          Object.keys(data).forEach((item) => {
              let singleData = [];
              singleData.push(item, data[item]);
              state.testJobCirclesData.push(singleData);
          });
      } else state.testJobCirclesData = [];
      // console.log(state.testJobCirclesData, "----> state.testJobCirclesData")
  },
  [types.UPDATE_SUT_AMOUNT_DATA](state, data) {
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
  [types.UPDATE_JOB_AMOUNT_DATA](state, data) {
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
  [types.UPDATE_TESTENV_AMOUNT_DATA](state, data) {
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

export default mutations;
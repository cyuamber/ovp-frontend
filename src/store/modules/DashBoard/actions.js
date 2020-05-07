import { axiosget } from '../../../utils/http';
import API from '../../../const/apis';
import * as types from './mutations_types';

const actions = {
  getLiveData({ commit }, { message }) {
      axiosget(API.dashboard.liveCaseAmount).then(res => {
          if (res.code === 200) {
              let x = (new Date()).getTime();
              commit(types.updateLiveData, { x, y: res.body.livecount });
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
              commit(types.updateLinesData, res.body);
              commit(types.updateLinesxAxisLength, res.body.length);
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
              commit(types.updateTestJobCirclesData, res.body);
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
              commit(types.updateSUTAmountData, res.body);
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
              commit(types.updateJobAmountData, res.body);
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
              commit(types.updateTestEnvAmountData, res.body);
          } else message.error('Network exception, please try again')
      },
          () => {
              message.error('Network exception, please try again')
          }
      )
  },
  clearData({ commit }) {
      commit(types.updateLiveData, { x: null, y: null });
      commit(types.updateLinesData, []);
      commit(types.updateTestJobCirclesData, []);
      commit(types.updateSUTAmountData, []);
      commit(types.updateJobAmountData, []);
      commit(types.updateTestEnvAmountData, []);
  }
};

export default actions
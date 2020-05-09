import { axiosget } from '../../../utils/http';
import API from '../../../const/apis';
import * as types from './mutations_types';

const actions = {
  getLiveData({ commit }, { message }) {
      axiosget(API.dashboard.liveCaseAmount).then(res => {
          if (res.code === 200) {
              let x = (new Date()).getTime();
              commit(types.UPDATE_LIVE_DATA, { x, y: res.body.livecount });
          } else message.error('Network exception, please try again');
      },
          () => {
              message.error('Network exception, please try again');
          }
      );
  },
  getLinesData({ commit }, { message }) {
      axiosget(API.dashboard.PassCaseAmount7Days).then(res => {
          if (res.code === 200) {
              commit(types.UPDATE_LINES_DATA, res.body);
              commit(types.UPDATE_LINES_XAXIS_LENGTH, res.body.length);
          } else message.error('Network exception, please try again');
      },
          () => {
              message.error('Network exception, please try again');
          }
      );
  },
  getTestJobCirclesData({ commit }, { message }) {
      axiosget(API.dashboard.jobsFlowAmount).then(res => {
          if (res.code === 200) {
              commit(types.UPDATE_TESTJOB_CIRCLES_DATA, res.body);
          } else message.error('Network exception, please try again');
      },
          () => {
              message.error('Network exception, please try again');
          }
      );
  },
  getSUTAmountData({ commit }, { message }) {
      axiosget(API.dashboard.sutAmount).then(res => {
          if (res.code === 200) {
              commit(types.UPDATE_SUT_AMOUNT_DATA, res.body);
          } else message.error('Network exception, please try again');
      },
          () => {
              message.error('Network exception, please try again');
          }
      );
  },
  getJobAmountData({ commit }, { message }) {
      axiosget(API.dashboard.jobsAmount).then(res => {
          if (res.code === 200) {
              commit(types.UPDATE_JOB_AMOUNT_DATA, res.body);
          } else message.error('Network exception, please try again');
      },
          () => {
              message.error('Network exception, please try again');
          }
      );
  },
  getTestEnvAmountData({ commit }, { message }) {
      axiosget(API.dashboard.testEnvAmount).then(res => {
          if (res.code === 200) {
              commit(types.UPDATE_TESTENV_AMOUNT_DATA, res.body);
          } else message.error('Network exception, please try again');
      },
          () => {
              message.error('Network exception, please try again');
          }
      );
  },
  clearData({ commit }) {
      commit(types.UPDATE_LIVE_DATA, { x: null, y: null });
      commit(types.UPDATE_LINES_DATA, []);
      commit(types.UPDATE_TESTJOB_CIRCLES_DATA, []);
      commit(types.UPDATE_SUT_AMOUNT_DATA, []);
      commit(types.UPDATE_JOB_AMOUNT_DATA, []);
      commit(types.UPDATE_TESTENV_AMOUNT_DATA, []);
  }
};

export default actions;
import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login';
import router from './modules/router';
import testInstrument from './modules/testInstrument';
import testSpecMGT from './modules/testSpecMGT';
import VnfpnfSuite from './modules/VnfpnfSuite';
import testSUT from './modules/testSUT'
import testJob from './modules/testJob'
import testENV from './modules/testENV'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    login,
    router,
    testInstrument,
    testSpecMGT,
    VnfpnfSuite,
    testSUT,
    testJob,
    testENV
  },

})

export default store;

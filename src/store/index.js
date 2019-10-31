import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login';
import router from './modules/router';
import testInstrument from './modules/testInstrument';
import testSpecMGT from './modules/testSpecMGT';
import VnfpnfSuite from './modules/VnfpnfSuite';
import testSUT from './modules/testSUT'
import testCase from './modules/testCase'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    login,
    router,
    testInstrument,
    testSpecMGT,
    VnfpnfSuite,
    testSUT,
    testCase
  },

})

export default store;

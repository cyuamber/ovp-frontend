import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login';
import router from './modules/router';
import testInstrument from './modules/testInstrument';
import testSpecMGT from './modules/testSpecMGT';
import VnfpnfSuite from './modules/VnfpnfSuite';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    login,
    router,
    testInstrument,
    testSpecMGT,
    VnfpnfSuite
  },

})

export default store;

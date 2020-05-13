import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/components/login";
import router from "./modules/components/router";
import loading from "./modules/components/loading";
import searching from "./modules/components/searching";
import testInstrument from "./modules/testInstrument";
import testSpecMGT from "./modules/TestSpecMGT";
import VnfpnfSuite from "./modules/VnfpnfSuite";
import testSUT from "./modules/TestSUT";
import testCase from "./modules/testCase";
import testJob from "./modules/TestJob";
import testENV from "./modules/TestENV";
import dashBoard from "./modules/DashBoard";
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const store = new Vuex.Store({
    // plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
    modules: {
        login,
        router,
        loading,
        searching,
        testInstrument,
        testSpecMGT,
        VnfpnfSuite,
        testSUT,
        testCase,
        testJob,
        testENV,
        dashBoard,
    },
});

export default store;

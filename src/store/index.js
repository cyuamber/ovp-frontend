import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/components/login'
import router from './modules/components/router'
import loading from './modules/components/loading'
import searching from './modules/components/searching'
import datePicker from './modules/components/datePicker'
import TestInstrument from './modules/TestInstrument'
import testSpecMGT from './modules/TestSpecMGT'
import VnfpnfSuite from './modules/VnfpnfSuite'
import testSUT from './modules/TestSUT'
import testJob from './modules/TestJob'
import testENV from './modules/TestENV'
import dashBoard from './modules/DashBoard'
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const store = new Vuex.Store({
  // plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
  modules: {
    login,
    router,
    loading,
    searching,
    TestInstrument,
    testSpecMGT,
    VnfpnfSuite,
    testSUT,
    testJob,
    testENV,
    dashBoard,
    datePicker
  }
})

export default store

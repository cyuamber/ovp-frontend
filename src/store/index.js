import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/login';
import router from './modules/router';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    login,
    router
  },

})

export default store;

import Vue from 'vue';
import antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import router from './router/router';
import store from './store/index';
import Axios from 'axios';
import VueI18n from 'vue-i18n'

Vue.prototype.$axios = Axios;
Axios.defaults.baseURL = '/api';
Axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.use(VueI18n);
Vue.use(antd);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

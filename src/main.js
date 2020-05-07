import Vue from "vue";
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./libs/theme.less";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/index";
import Axios from "axios";
import VueI18n from "vue-i18n";

Vue.prototype.$axios = Axios;

let proEnv = require("../config/pro.env");

if (process.env.NODE_ENV === "development") {
    Axios.defaults.baseURL = "/api";
}

if (process.env.NODE_ENV === "production") {
    Axios.defaults.baseURL = `http://${window.location.hostname}:${proEnv.port}/`;
}

Axios.defaults.headers.post["Content-Type"] = "application/json";

Vue.use(VueI18n);
Vue.use(antd);
Vue.config.productionTip = false;

const i18n = new VueI18n({
    locale: "en_US",
    messages: {
        zh_CN: require("./assets/i18n/zh"),
        en_US: require("./assets/i18n/en"),
    },
});

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
}).$mount("#app");

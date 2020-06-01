import Vue from "vue";
import Router from "vue-router";

//layout
import Layout from "../components/layout/layout.vue";
//login
// import Login from '../pages/Login/Login.vue';
//home
// import Home from '../pages/Home.vue';
//Dashboard
import Dashboard from "../pages/Dashboard/Dashboard.vue";
//Test Objects MGT
import TestSUT from "../pages/TestObject/TestSUT/TestSUT.vue";
//Test ENV MGT
import VimEnv from "../pages/TestEnv/VIMEnv/VimEnv.vue";
//Test MGT
import TestInstrument from "../pages/TestEnv/TestInstrument/TestInstrument.vue";
import VnfpnfSuite from "../pages/TestEnv/VnfpnfSuite/VnfpnfSuite.vue";
//TestJob
import TestJob from "../pages/TestJob/TestJob.vue";
import JobDetail from "../pages/TestJob/JobDetail.vue";
//TestSpecMGT
import TestSpecMGT from "../pages/TestStandard/TestSpecMGT.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            redirect: "/dashboard",
        },
        {
            path: "/home",
            redirect: "/dashboard",
        },
        {
            path: "/login",
            redirect: "/dashboard",
        },
        // {
        //   path: '/home',
        //   name: 'Home',
        //   component: Home
        // },
        // {
        //   path: '/login',
        //   name: 'Login',
        //   component: Login
        // },
        {
            path: "/dashboard",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "Dashboard",
                    component: Dashboard,
                },
            ],
        },
        {
            path: "/testsutmgt",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "testsut",
                    component: TestSUT,
                },
            ],
        },
        {
            path: "/vimvnfmmanoenvmgt",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "VimEnv",
                    component: VimEnv,
                },
            ],
        },
        {
            path: "/instrumentmgsmgt",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "TestInstrument",
                    component: TestInstrument,
                },
            ],
        },
        {
            path: "/instrumentpackagemgt",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "VnfpnfSuite",
                    component: VnfpnfSuite,
                },
            ],
        },
        {
            path: "/testjobmgt",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "TestJob",
                    component: TestJob,
                },
                {
                    path: "/jobDetail",
                    name: "JobDetail",
                    component: JobDetail,
                },
            ],
        },
        {
            path: "/testspecmgt",
            component: Layout,
            children: [
                {
                    path: "",
                    name: "TestSpecMGT",
                    component: TestSpecMGT,
                },
            ],
        }
    ],
});

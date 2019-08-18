import Vue from 'vue';
import Router from 'vue-router';
// import TestPage from '../pages/TestPage.vue';

//layout
import Layout from '../components/layout/layout.vue';
//login
import Login from '../pages/Login/Login.vue';
//home
import Home from '../pages/Home.vue';
//Dashboard
import Dashboard from '../pages/Dashboard/Dashboard.vue';
//Test Objects MGT
import VnfType from '../pages/TestObject/VnfType.vue';
import VnfTypeobject from '../pages/TestObject/VnfTypeobject.vue';
//Test ENV MGT
import VimEnv from '../pages/TestEnv/VimEnv.vue';
//Test MGT
import TestInstrument from '../pages/TestMgt/TestInstrument.vue';
import VnfpnfSuite from '../pages/TestMgt/VnfpnfSuite.vue';
//TestJob
import TestJob from '../pages/TestJob/TestJob.vue';
//TestCase
import TestCase from '../pages/TestCase/TestCase.vue';
//TestStandard
import TestStandard from '../pages/TestStandard/TestStandard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard
        },
      ]
    },
    {
      path: '/vnftypemgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'VnfType',
          component: VnfType
        },
      ]
    },
    {
      path: '/vnftypeobjectsmgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'VnfTypeobject',
          component: VnfTypeobject
        },
      ]
    }, {
      path: '/vimvnfmenvmgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'VimEnv',
          component: VimEnv
        },
      ]
    }, {
      path: '/testinstrumentmgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'TestInstrument',
          component: TestInstrument
        },
      ]
    },
    {
      path: '/vnfpnfsuitemgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'VnfpnfSuite',
          component: VnfpnfSuite
        },
      ]
    }, {
      path: '/testjobmgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'TestJob',
          component: TestJob
        },
      ]
    }, {
      path: '/testcasemgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'TestCase',
          component: TestCase
        },
      ]
    }, {
      path: '/teststandardmgt',
      component: Layout,
      children: [
        {
          path: '',
          name: 'TestStandard',
          component: TestStandard
        },
      ]
    },
    // {
    //   path: '/testresultsmgt',
    //   name: 'TestResult',
    //   component: () => import('../pages/TestResult/TestResult.vue')
    // }

  ]
})
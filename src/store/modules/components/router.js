import { axiosget } from '../../../utils/http'
import API from '../../../const/apis'
const router = {
  state: {
    breadcrumbArr: [],
    currentMenu: [],
    langList: [],
    lang: 'en_US'
  },
  mutations: {
    setBreadcrumb(state, data) {
      state.breadcrumbArr = data
    },
    setCurrentMenu(state, data) {
      state.currentMenu = data
    },
    updateLanguage(state, data) {
      state.lang = data
    }
  },
  getters: {
    // updateBread: state => {
    //   return state.breadcrumbArr
    // }
  },
  actions: {
    getCurrentMenu({ commit }, data) {
      commit('setCurrentMenu', data)
    },
    getCurrentLanguage({ commit }, obj) {
      axiosget(API.getCurrentLanguage, obj).then(
        res => {
          if (res.code === 200) {
            if (Object.keys(obj).length === 0)
              commit('updateLanguage', res.body)
            else commit('updateLanguage', obj.lang)
          }
        },
        () => {
          console.error('Network exception, please try again')
        }
      )
    }
  }
}

export default router

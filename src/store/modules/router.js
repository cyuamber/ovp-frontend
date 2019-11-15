import { axiosget } from '../../utils/http';
import API from '../../const/apis';
const router = {
    state: {
        breadcrumbArr: [],
        currentMenu: [],
        langList: [],
        language: 'en_US'
    },
    mutations: {
        setBreadcrumb(state, data) {
            state.breadcrumbArr = data;
        },
        setCurrentMenu(state, data) {
            state.currentMenu = data
        },
        updateLanguage(state, data) {
            state.language = data;
        },
    },
    getters: {
        updateBread: state => {
            return state.breadcrumbArr;
        }
    },
    actions: {
        getCurrentLanguage({ commit }, obj) {
            axiosget(API.getCurrentLanguage, obj).then(res => {
                if (res.statusCode === "100") {
                    if (Object.keys(obj).length === 0) commit('updateLanguage', res.body);
                    else commit('updateLanguage', obj.language)
                }
            },
                () => {
                    console.error('Network exception, please try again');
                }
            )
        }
    }
};

export default router;
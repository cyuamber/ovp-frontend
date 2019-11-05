import {axiosget} from '../../utils/http';
const router = {
    state: {
        breadcrumbArr: [],
        currentMenu: [],
        langList: [],
        language:'EN'
    },
    mutations: {
        setBreadcrumb(state, data) {
            state.breadcrumbArr = data;
        },
        setCurrentMenu(state,data){
            state.currentMenu = data
        },
        updateLanguage (state,data) {
            state.language = data;
        },
    },
    getters: {
        updateBread: state => {
            return state.breadcrumbArr;
        }
    },
    actions: {
        getCurrentLanguage({commit},obj){
            axiosget('/getCurrentLanguage',obj).then(res => {
                    if(res.code === 200){
                        if(Object.keys(obj).length === 0)commit('updateLanguage',res.body.language);
                       else commit('updateLanguage',obj.language)
                    }else this.$message.error('Network exception, please try again');
                },
                () => {
                    this.$message.error('Network exception, please try again');
                }
            )
        }
    }
};

export default router;
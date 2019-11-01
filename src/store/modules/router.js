const router = {
    state: {
        breadcrumbArr: [],
        currentMenu: []
    },
    mutations: {
        setBreadcrumb(state, data) {
            state.breadcrumbArr = data;
        },
        setCurrentMenu(state,data){
            state.currentMenu = data
        }

    },
    getters: {
        updateBread: state => {
            return state.breadcrumbArr;
        }
    },
    actions: {

    }
};

export default router;
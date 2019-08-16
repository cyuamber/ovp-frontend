const router = {
    state: {
        breadcrumbArr: [],

    },
    mutations: {
        setBreadcrumb(state, data) {
            state.breadcrumbArr = data;
        },

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
const state = {
    keyword: "",
};
const mutations = {
    setKeyword(state, keyword) {
        state.keyword = keyword;
    },
};
const actions = {};

export default {
    state,
    mutations,
    actions,
    namespaced: true,
};

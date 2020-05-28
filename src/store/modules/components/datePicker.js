const state = {
    selectDateTime: "",
};
const mutations = {
    setDateTime(state, selectDateTime) {
        state.selectDateTime = selectDateTime;
    },
};
const actions = {};

export default {
    state,
    mutations,
    actions,
    namespaced: true,
};

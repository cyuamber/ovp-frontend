const state = {
    loadingMessage: { type: '', toast: '', showAll: false, toastOpen: false },
    tableLoading: false,
    searchLoading: false
}
const mutations = {
    uploadingMessage(state, loadingMsg) {
        state.loadingMessage = {
            showAll: loadingMsg.showAll,
            toastOpen: loadingMsg.toastOpen,
            type: loadingMsg.type,
            toast: loadingMsg.toast
        }
    },
    updateTableLoading(state, tableLoading) {
        state.tableLoading = tableLoading
    },
    updateSearchLoading(state, searchLoading) {
        state.searchLoading = searchLoading
    }
}

const actions = {
    showLoading({ commit }, msg) {
        commit('uploadingMessage', msg);
    },
    tableLoading({ commit }, loading) {
        commit('updateTableLoading', loading);
    },
    searchLoading({ commit }, loading) {
        commit('updateSearchLoading', loading);
    }
}

const getters = {
}

export default {
    state, mutations, actions, getters, namespaced: true,
}
import ApiService from "../../services/api.service";

const state = {
    exisitingSessions: [],
    newSessionId: '',
};

const getters = {
    exisitingSessions: (state) => state.exisitingSessions,
    newSessionId: (state) => state.newSessionId,
};

const actions = {
    async createSession({ commit }, payload) {        
        const sessionId = await ApiService.post('sessions', payload)
        commit('sessionAdded', sessionId)
    }
};

const mutations = {
    sessionAdded: (state, sessionId) => {
        state.newSessionId = sessionId
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
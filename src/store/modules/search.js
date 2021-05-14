import ApiService from "../../services/api.service";

const state = {
    searchResults: [],
    latestHistory: []
};

const getters = {
    search: (state) => state.searchResults;
    latest: (state) => state.latestHistory;
};

const actions = {};

const mutations = {};

export default {
    state,
    getters,
    actions,
    mutations
}
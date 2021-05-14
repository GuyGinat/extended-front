import api from "../../services/api.service";
import { parseYoutubeTitle } from "../../utils/parsers";

const state = {
    searchResults: [],
    videoSearchResults: [],
    latestHistory: [],
    noSearchReasults: false
};

const getters = {
    search: (state) => state.searchResults,
    videos: (state) => state.videoSearchResults,
    noResults: (state) => state.noSearchReasults,
    latest: (state) => state.latestHistory,
};

const actions = {
    
    async getLatest({ commit }) {
        const results = await api.get("history", "latest")
        let data = (results).data.map(r => {
            return {
                ...r._source,
                rawText: r._source.rawText.slice(0, 160) + "...",
                _id: r._id,
            };
        })
        commit('setLatest', data)
    },

    async searchYT({ commit }, query) {
        let results = await api.get("yt", `captions?q=${query}`)
        let data = results.data;
        let videos = data.map(v => {
            return {
                id: v._source.id,
                title: parseYoutubeTitle(v._source.title),
                markersLength:
                    v.inner_hits.timedText.hits.hits.length,
                currentMarker: 0,
                markers: v.inner_hits.timedText.hits.hits
                    .map(m => {
                        return parseInt(m._source.start);
                    })
                    .sort(function(a, b) {
                        return a - b;
                    })
            };
        });
        commit('setVideos', videos)
    },

    async searchAll({ commit }, query) {
        let { data } = await api.get(`historyOld?q=${query}&u=${this.$store.getters.userId}`)
        commit('setSearchResults', data)
    } 
};

const mutations = {
    setLatest: (state, latestHistory) => (state.latestHistory = latestHistory),
    setVideos: (state, videos) => {
        state.videoSearchResults = videos;
        state.noSearchReasults = videos.length === 0;
    },
    setSearchResults: (state, searchResults) => {
        state.searchResults = searchResults;
        state.noSearchReasults = searchResults.length === 0;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
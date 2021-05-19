import api from "../../services/api.service";
import { parseYoutubeTitle } from "../../utils/parsers";

const state = {
    searchResults: [],
    videoSearchResults: [],
    latestHistory: [],
    noSearchReasults: false,
    sortedByTime: false,
    itemsDates: [],
};

const getters = {
    searchResults: (state) => state.searchResults,
    videoSearchResults: (state) => state.videoSearchResults,
    noSearchReasults: (state) => state.noSearchReasults,
    latestHistory: (state) => state.latestHistory,
    sortedByTime: (state) => state.sortedByTime,
    itemsDates: (state) => state.itemsDates,
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
        commit('clearSearch')
        let { data } = await api.get(`search`, `all?q=${query}`)
        commit('setSearchResults', data)
    },
    
    sortResults({ commit }) {
        let results
        if (state.sortedByTime) {
            results = state.searchResults.sort((a, b) => {
                return b["_score"] - a["_score"];
            });
            commit('sort', {sortedByTime: false, results: results})
        } else {
            results = state.searchResults.sort((a, b) => {
                // TODO: fix this to the commented section when deploying
                let aDate = Array.isArray(a["_source"]["users"]) ? a["_source"]["users"][0]["date"] : a["_source"]["users"]["date"]
                let bDate = Array.isArray(b["_source"]["users"]) ? b["_source"]["users"][0]["date"] : b["_source"]["users"]["date"]
                // let aDate = a["_source"]["users"][0]["date"];
                // let bDate = b["_source"]["users"][0]["date"];
                return aDate - bDate;
            });
            commit('sort', {sortedByTime: true, results: results})
        }
    }
};

const mutations = {
    setLatest: (state, latestHistory) => (state.latestHistory = latestHistory),
    setVideos: (state, videos) => {
        state.videoSearchResults = videos;
        state.noSearchReasults = videos.length === 0;
    },
    clearSearch: (state) => {
        state.sortedByTime = false
        state.searchResults = []
        state.itemsDates = []
    },
    setSearchResults: (state, searchResults) => {
        state.searchResults = searchResults;
        state.itemsDates = searchResults.map(d => {
            console.log(d["_source"]["users"])
            if (Array.isArray(d["_source"]["users"])){
                return new Date(d["_source"]["users"][0]["date"]);
            } else {
                console.log(d["_source"]["users"]["date"])
                return new Date(d["_source"]["users"]["date"]);
            }
        });
        state.noSearchReasults = searchResults.length === 0;
    },
    sort: (state, payload) => {
        state.sortedByTime = payload.sortedByTime;
        state.searchResults = payload.results;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
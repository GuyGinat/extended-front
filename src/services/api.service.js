import Vue from "vue";
import store from "../store";

import JwtService from "./jwt.service";
console.log("Process enviorement (development/production) = " + process.env.NODE_ENV);
// const API_URL = (process.env.NODE_ENV === 'development' ? "http://localhost:8081" : "https://api.novos.gg");
const API_URL = "http://localhost:3001";
console.log(`connecting to api at ${API_URL}`);

const ApiService = {
    init() {
        Vue.axios.defaults.baseURL = API_URL;
        if (JwtService.getToken()) {
            this.setHeader();
            this.get('/users')
            .then(resp => {
                const user = resp.data.user
                store.commit("auth_token_verified", user)
            })
            .catch(err => {
                console.log(err)
            })
        }
    },

    setHeader() {
        Vue.axios.defaults.headers.common[
            "x-access-token"
        ] = `${JwtService.getToken()}`;
    },

    query(resource, params) {
        return Vue.axios.get(resource, params).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    get(resource, slug = "") {
        return Vue.axios.get(`${resource}/${slug}`);
    },

    post(resource, params) {
        return Vue.axios.post(`${resource}`, params);
    },

    update(resource, slug, params) {
        return Vue.axios.put(`${resource}/${slug}`, params);
    },

    put(resource, params) {
        return Vue.axios.put(`${resource}`, params);
    },

    delete(resource) {
        return Vue.axios.delete(resource).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    validateUser(userId) {
        store.commit('auth_request')
        this.get(`users/user?userId=${userId}`)
        .then(user => {
            console.log(user)
            return true
        })
        .catch(err => {
            return false
            console.log(err)
        })
    },    
};

export default ApiService;
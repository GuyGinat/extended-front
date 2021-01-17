import Vue from "vue";
import axios from 'axios'

import JwtService from "./jwt.service";
console.log("Process enviorement (development/production) = " + process.env.NODE_ENV);
const API_URL = (process.env.NODE_ENV === 'development' ? "http://localhost:3001" : "https://extended-mind-api.herokuapp.com");
const ApiService = {
    init() {
        Vue.axios.defaults.baseURL = API_URL;
        if (JwtService.getToken()) {
            this.setHeader();
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
    }
};

export default ApiService;
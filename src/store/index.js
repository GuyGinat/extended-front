import Vue from "vue";
import Vuex from "vuex";
import apiService from "../services/api.service.js";
import jwtService from "../services/jwt.service.js";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        status: "",
        userStatus: "",
        token: jwtService.getToken() || "",
        user: {},
        debug: {},
        error: {}
    },
    mutations: {

        // Login
        login_request(state) {
            state.userStatus = "loading";
        },
        login_error(state) {
            state.userStatus = "error";
        },
        login_success(state, token) {
            state.userStatus = "success";
            state.token = token;
            jwtService.saveToken(token);
        },
        login_denied(state, error) {
            state.userStatus = "error";
            state.error = error;
        },

        
        // Logout
        logout_request(state) {
            state.userStatus = "error";
        },
        logout_success(state) {
            state.userStatus = "success";
        },
        logout(state) {
            state.status = "";
            state.token = "";
        },


        // Error
        set_error(state, error) {
            state.error = error;
            state.status = "error";
        },
        error(state) {
            state.status = "error";
        },


        // Auth
        auth_request(state) {
            state.status = "loading";
        },
        auth_success(state, token) {
            state.status = "success";
            state.token = token;
        },
        auth_error(state) {
            state.status = "error";
        },                
        auth_token_verified(state, user) {
            state.status = "success";
            state.user = user;
        },


        // Update User
        update_user_request(state, user) {
            state.status = "loading";
        },
        update_user_success(state, user) {
            state.status = "success";
            state.user = user;
        },
        update_user_error(state, user) {
            state.status = "success";
            state.user = {};
        },



        debug(state, data) {
            state.debug = data;
        }
    },
    actions: {
        register({ commit, dispatch }, user) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                apiService
                    .post("/users/register", { ...user })
                    .then(resp => {
                        console.log(resp);
                        const token = resp.data.accessToken;
                        const user = resp.data.user;
                        jwtService.saveToken(token);
                        apiService.setHeader();
                        commit("auth_success", token);
                        commit("update_user_success", user);
                        resolve(resp);
                    })
                    .catch(({ err }) => {
                        console.log(err);
                        commit("auth_error");
                        commit("set_error", err.data.messageCode);
                        return dispatch("logout").then(() => {
                            commit("error");
                            reject(err);
                        });
                    });
            });
        },

        postLogin({ commit, dispatch }, token) {
            return new Promise((resolve, reject) => {
                jwtService.saveToken(token);
                apiService.setHeader();
                // commit('login_success')
                commit("auth_success", token);
                dispatch("verifyToken")
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            });
        },

        verifyToken({ commit, dispatch }) {
            return new Promise((resolve, reject) => {
                if (jwtService.getToken()) {
                    commit("auth_request");
                    apiService
                        // .get("/users/verifyToken")
                        .get("/users/")
                        .then(resp => {
                            const user = resp.data.user;
                            commit("update_user_success", user);
                            resolve(resp);
                        })
                        .catch(({ response }) => {
                            commit("auth_error");
                            commit("set_error", response.data.messageCode);
                            return dispatch("logout").then(() => {
                                commit("error");
                                reject(response);
                            });
                        });
                } else {
                    return dispatch("logout").then(() => {
                        commit("error");
                        reject();
                    });
                }
            });
        },

        logout({ commit }) {
            return new Promise((resolve, reject) => {
                commit("logout");
                jwtService.destroyToken();
                apiService.setHeader();
                const user = {};
                commit("update_user_success", user);
                resolve();
            });
        },

        updateUser({ commit }, body) {
            console.log(body)
            let endpoint = body.endpoint
            let doc = body.doc
            return new Promise((resolve, reject) => {
                commit("update_user_request");
                apiService
                    .post(`users/${endpoint}`, doc)
                    .then(result => {
                        console.log(result)
                        commit("update_user_success", result.data.user)
                    })
                    .catch(err => {
                        // commit("update_user_error")
                    });
            });
        },
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        user: state => state.user,
        userId: state => state.user.id,
        error: state => state.error
    },
    modules: {}
});

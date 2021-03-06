import Vue from "vue";
import Vuex from "vuex";
import apiService from '../services/api.service.js'
import jwtService from '../services/jwt.service.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: jwtService.getToken() || '',
    user: {},
    debug: {},
    error: {},
  },
  mutations: {
    error(state) {
      state.status = 'error'
    },
    set_error(state, error) {
      state.error = error
    },
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token) {
      state.status = 'success'
      state.token = token
    },
    auth_token_verified(state, user) {
      state.status = 'success'
      state.user = user
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
    riot_request(state) {
      state.status = 'loading'
    },
    update_user(state, user) {
      state.status = 'success'
      state.user = user
    },
    debug(state, data) {
      state.debug = data;
    }
  },
  actions: {
    login({ commit, dispatch }, user) {
        return new Promise((resolve, reject) => {
            commit('auth_request')
            apiService.post('/auth/signin', {...user })
                .then(resp => {
                    const token = resp.data.accessToken
                    const user = resp.data.user
                    jwtService.saveToken(token)
                    apiService.setHeader()
                    commit('auth_success', token)
                    commit('update_user', user)
                    resolve(resp)
                })
                .catch(({ response }) => {
                    commit('auth_error')
                    commit('set_error', response.data.messageCode)
                    return dispatch('logout').then(() => {

                        commit('error')
                        reject(response)
                    })

                })
        })
    },

    verifyToken({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            if (jwtService.getToken()) {
                commit('auth_request')
                apiService.get('/auth/verifyToken')
                    .then(resp => {
                        const user = resp.data.user
                        commit('update_user', user)
                        resolve(resp)
                    })
                    .catch(({ response }) => {
                        commit('auth_error')
                        commit('set_error', response.data.messageCode)
                        return dispatch('logout').then(() => {
                            commit('error')
                            reject(response)
                        })

                    })
            } else {
                return dispatch('logout').then(() => {
                    commit('error')
                    reject()
                })
            }
        })
    },

    register({ commit, dispatch }, user) {
        return new Promise((resolve, reject) => {
            commit('auth_request')
            apiService.post('/auth/signup', {...user })
                .then(resp => {
                    const token = resp.data.accessToken
                    const user = resp.data.user
                    jwtService.saveToken(token)
                    apiService.setHeader();
                    commit('auth_success', token)
                    commit('update_user', user)
                    resolve(resp)
                })
                .catch(({ response }) => {
                    commit('auth_error')
                    commit('set_error', response.data.messageCode)
                    return dispatch('logout').then(() => {

                        commit('error')
                        reject(response)
                    })

                })
        })
    },

    logout({ commit }) {
        return new Promise((resolve, reject) => {
            commit('logout')
            jwtService.destroyToken()
            apiService.setHeader()
            const user = {};
            commit('update_user', user)
            resolve()
        })
    },
},
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        user: state => state.user,
        error: state => state.error,
    },
    modules: {}
});

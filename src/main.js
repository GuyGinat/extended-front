import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAxios from "vue-axios";
import axios from "axios";
import ApiService from './services/api.service'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import VueYoutube from "vue-youtube";
import GAuth from 'vue-google-oauth2'
import vueDebounce from 'vue-debounce'

// TODO: Chnage to env variables
const gauthOption = {
  clientId: '337409544743-rsfnra4qscr374r6j41c6vrflu0hgp2e.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}

// axios.defaults.baseURL = process.env.API_ENDPOINT

Vue.use(GAuth, gauthOption)

Vue.use(vueDebounce)

Vue.config.productionTip = false;

Vue.use(VueYoutube);
Vue.use(VueAxios, axios);
Vue.use(require("vue-moment"));

ApiService.init();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import ApiService from "./services/api.service";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import VueYoutube from "vue-youtube";
import vueDebounce from 'vue-debounce'



Vue.use(vueDebounce)

Vue.config.productionTip = false;

Vue.use(VueYoutube);
Vue.use(VueAxios, axios);

ApiService.init();

Vue.use(require("vue-moment"));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

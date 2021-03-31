import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Main from "../views/Main.vue";
import ExtensionRedirect from "../views/ExtensionRedirect.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/profile",
        name: "profile",
        component: Profile,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/main",
        name: "main",
        component: Main,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
        path: "/extension/:id",
        name: "extension-sign-in",
        component: ExtensionRedirect
    }
];

const router = new VueRouter({
    mode: "history",
    linkActiveClass: null,
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
  let queries = {};
  if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters.isLoggedIn) {
          next({ query: queries });
          return;
      }
      queries.from = to.path;
      next({ path: "/", query: queries });
      return
  } else {
      next({ path: to.params, query: queries });
      return;
  }
});

export default router;

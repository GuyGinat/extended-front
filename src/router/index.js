import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Main from "../views/Main.vue";
import ExtensionRedirect from "../views/ExtensionRedirect.vue";

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
  },
  {
    path: "/main",
    name: "main",
    component: Main,
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
  base: process.env.BASE_URL,
  routes
});

export default router;

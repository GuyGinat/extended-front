<template>
  <div id="app" class="container">
    <div id="nav" class="nav">
      <router-link class="link" to="/">Home </router-link> |
      <router-link class="link" to="/profile">Profile</router-link> |
      <router-link class="link" to="/main"> &nbsp;Search</router-link>
      <!-- <span class="btns" v-if="$gAuth.isInit">
        <a
          v-if="!this.isSignedIn"
          @click="login"
          class="btn btn-sm btn-outline-info ml-3"
          >Log in</a
        >
        <a 
          v-if="this.isSignedIn"
          @click="logout"
          class="btn btn-sm btn-outline-info ml-3"
          >Log out</a
        >
      </span> -->
      <!-- <button @click="changeTest">{{test}}</button> -->
    </div>
    <router-view />
  </div>
</template>

<style>
.nav {
  margin-top: 1rem;
}
.link {
  padding: 5px;
}
.btns a {
  display: inline;
  cursor: pointer !important;
  color: #0056b3 !important;
}
.btns a:hover {
  color: #1667bd !important;
}
</style>

<script>
import ApiService from "./services/api.service.js";
import { mapState } from 'vuex'

export default {
  name: "app",
  data() {
    return {
      isSignedIn: false,
    }
  },
  methods: {
    async login() {
      const googleUser = await this.$gAuth.signIn()
      this.isSignedIn = true

    },
    // Log the user out
    async logout() {
      const response = await this.$gAuth.signOut()
      this.isSignedIn = false
    },    
    changeTest() {
      this.$store.dispatch('test')
    },
  },
  computed: {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    ...mapState([
      'test', 'status'
    ])
  },
  created: function() {
    ApiService.init();
  }  
};
</script>
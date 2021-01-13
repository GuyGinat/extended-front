<template>
  <div id="app" class="container">
    <div id="nav" class="nav">
      <router-link to="/">Home | </router-link> 
      <router-link v-if="this.isSignedIn" to="/profile">&nbsp;Profile |</router-link>
      <router-link v-if="this.isSignedIn" to="/main"> &nbsp;Search</router-link>
      <span class="btns" v-if="$gAuth.isInit">
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
      </span>
    </div>
    <router-view />
  </div>
</template>

<style>
.nav {
  margin-top: 1rem;
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
export default {
  name: "app",
  data() {
    return {
      isSignedIn: false
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
  },  
};
</script>
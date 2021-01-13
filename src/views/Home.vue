<template>
  <div class="home mt-5">
    <div>
       <!-- show login when not authenticated -->
      <div v-if="!$gAuth.GoogleAuth.isSignedIn.we" @click="login">
        <div class="jumbotron jumbotron-fluid text-center">
          <div class="container">
            <h1 class="display-4">Find everything you've ever browsed</h1>
            <p class="lead">
              All your browsing history, full text search for all pages and
              youtube videos you have browsed. Try it now.
            </p>
            <p class="lead">
              <a class="btn btn-primary btn-lg" @click="login" role="button"
                >Start Searching Now</a
              >
            </p>
            <button
              type="button"
              class="btn btn-outline-dark expand-btn"
              @click="checkUser"
            >
              Test User
            </button>
          </div>
        </div>
      </div>
      <!-- show logout when authenticated -->
      <div v-if="$gAuth.GoogleAuth.isSignedIn.we" @click="logout()">
      <div>
        <div class="jumbotron jumbotron-fluid text-center">
          <div class="container">
            <h1 class="display-3">Find everything you've ever browsed</h1>
            <p class="lead">
              All your browsing history, full text search for all pages and
              youtube videos you have browsed. Try it now.
            </p>
            <p class="lead">
              <a class="btn btn-primary btn-lg" href="/main" role="button"
                >Start Searching Now</a
              >
            </p>           
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      currentUser: null,
    };
  },
  methods: {
    // login() {
    //   const googleUser = await this.$gAuth.signIn();
    // },
    async checkUser() {
      // const googleUser = await this.$gAuth.signIn()
      // this.currentUser = googleUser;
      console.log(this.$gAuth);
      // console.log(googleUser);
    },
  },
};
</script>

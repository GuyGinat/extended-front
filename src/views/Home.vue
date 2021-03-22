<template>
    <div class="container home mt-5">
        <div>
            <!-- show login when not authenticated -->
            <div v-if="!this.isSignedIn">
                <div class="jumbotron jumbotron-fluid text-center">
                    <div class="container">
                        <h1 class="display-4">
                            Find everything you've ever browsed
                        </h1>
                        <p class="lead">
                            All your browsing history, full text search for all
                            pages and youtube videos you have browsed. Try it
                            now.
                        </p>
                        <p class="lead">
                            <a class="btn btn-primary btn-lg" role="button"
                                >Start Searching Now</a
                            >
                        </p>
                    </div>
                </div>
            </div>
            <!-- show logout when authenticated -->
            <div v-if="this.isSignedIn"><home-signed-in /></div>
        </div>
    </div>
</template>

<script>
import HomeSignedIn from "./HomeSignedIn";

export default {
    name: "Home",
    data() {
        return {
            currentUser: null,
            isSignedIn: this.$store.getters.isLoggedIn
        };
    },
    components: {
        HomeSignedIn
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
        logout: function() {
            console.log("logout");
        }
    }
};
</script>

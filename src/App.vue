<template>
    <div id="app">
        <div id="nav" class="nav px-3">
            <div class="links">
                <router-link
                    v-if="this.isSignedIn"
                    class="mr-1 py-1 nav-btn"
                    to="/"
                >
                    Home</router-link
                >
                <router-link
                    v-if="this.isSignedIn"
                    class="mr-1 py-1 nav-btn"
                    to="/profile"
                    >Profile</router-link
                >
                <!-- <router-link v-if="this.isSignedIn" to="/profile">&nbsp;Profile |</router-link> -->
                <router-link to="/main" class="mr-1 py-1 nav-btn">
                    &nbsp;Search</router-link
                >
            </div>
            <!-- <router-link v-if="this.isSignedIn" to="/main"> &nbsp;Search</router-link> -->
            <span class="btns" v-if="$gAuth.isInit">
                <button
                    v-if="!this.isSignedIn"
                    @click="login"
                    class="nav-btn py-1 right"
                >
                    Log in
                </button>
                <button
                    v-if="this.isSignedIn"
                    @click="logout"
                    class="nav-btn py-1 right"
                >
                    Log out
                </button>
            </span>
        </div>
        <router-view />
    </div>
</template>

<style>
.nav {
    padding: 1rem;
    display: flex;
    border-color: black;
    border-width: 1px;
    justify-content: flex-start;
    align-items: center;
    background-color: rgb(255, 255, 255);
    width: 100%;
    position: fixed;
    text-decoration: none;
    top: 0;
}
/* .btns a {
  display: inline-block;
  cursor: pointer !important;
  background-color: #383a3b !important;
}
.btns a:hover {
  background-color: #111213 !important;
} */
.a:hover {
    text-decoration: none;
}
.btn {
    border-width: 1px;
    border-color: black;
    border-style: solid;
    background-color: #413d41; /* Green */
    border: none;
    color: white;
    padding: 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}
.btns {
    float: right;
}
.links {
    float: left;
}
.right {
    position: relative;
}
.nav-btn {
    border-width: 1px;
    border-color: black;
    border-style: solid;
    background-color: #413d41; /* Green */
    border: none;
    color: white;
    padding: 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}
</style>

<script>
import ApiService from "./services/api.service";
export default {
    name: "app",
    data() {
        return {
            isSignedIn: this.$store.getters.isLoggedIn
        };
    },
    mounted() {
        this.isSignedIn = this.$store.getters.isLoggedIn;
    },
    methods: {
        async login() {
            const googleUser = await this.$gAuth.signIn();

            if (googleUser.getId() !== this.$store.getters.user.id) {
                this.$store.dispatch("logout");
                this.isSignedIn = false;
                return;
            } else {
                this.isSignedIn = true;
            }
            // this.$store.commit('check_auth', googleUser)
        },
        // Log the user out
        async logout() {
            this.$store.dispatch("logout");
            const response = await this.$gAuth.signOut();
            this.isSignedIn = false;
        }
    }
};
</script>

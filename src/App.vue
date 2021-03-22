<template>
    <div id="app">
        <div id="nav" class="nav px-3 mb-16 shadow-sm flex justify-between">
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
                <router-link to="/main" class="mr-1 py-1 nav-btn">
                    Search</router-link
                >
            </div>
            <div class="text-2xl pr-40">
                Extended Mind
            </div>
            <span class="btns">
                <button
                    v-if="!this.isSignedIn"
                    @click="backedndLogin"
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

<script>
const handleMessage = (e, callback) => {
    if (typeof callback === "function" && e.data.auth === "passport") {
        callback(e.data);
    }
};

export default {
    name: "app",
    data() {
        return {};
    },
    created() {
        window.addEventListener("message", this.handleOAuthMessageCb);
    },
    destroyed: function() {
        window.removeEventListener("message", this.handleOAuthMessageCb);
    },

    computed: {
        isSignedIn: function() {
            return this.$store.getters.isLoggedIn;
        }
    },
    methods: {
        async backedndLogin() {
            this.$store.commit("login_request");
            window.open("http://localhost:3001/users/google-auth");
        },

        // Log the user out
        async logout() {
            this.$store.dispatch("logout").then(() => {
                this.$router.push("/");
            });
            this.isSignedIn = false;
        },
        handleOAuthMessageCb: function(e) {
            return handleMessage(e, data => {
                if (data.success) {
                    this.$store.dispatch("postLogin", data.token).then(() => {
                        this.$router.push("/main");
                    });
                } else {
                    this.$store.commit("login_denied", data.reason);
                }
            });
        }
    }
};
</script>


<style>
.nav {
    padding: 1rem;
    display: flex;
    /* border-color: black; */
    /* border-width: 1px; */
    justify-content: flex-start;
    align-items: center;
    background-color: rgba(255, 255, 255);
    width: 100%;
    z-index: 1;
    position: fixed;
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


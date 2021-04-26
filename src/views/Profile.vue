<template>
    <div class="container center-all emp-profile">
        <div class="row">
            <div class="col-md-12 mt-6">
                <div class="profile-img">
                    <img :src="user && user.picture" alt="" />
                </div>
            </div>
        </div>
        <div class="profile-options ">
            <div class="profile-options-box profile-tab p-4 border-t-2 border-solid border-gray-100">
                <h3 class="text-3xl mb-3">Info</h3>
                <div class="row py-2">
                    <div class="col-md-3">
                        <label>Name</label>
                    </div>
                    <div class="col-md-9">
                        <p>{{ userName }}</p>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-md-3">
                        <label>Email</label>
                    </div>
                    <div class="col-md-9">
                        <p>{{ user.email }}</p>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-md-3">
                        <label>Extended User Since</label>
                    </div>
                    <!-- <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"> -->
                    <div class="col-md-9">
                        <p>{{ user.date_joined | moment }}</p>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-md-3">
                        <label>Whitelist / Blacklist</label>
                    </div>
                    <!-- <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"> -->
                    <div
                        class="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ml-3"
                        :class="{ 'bg-gray-600': blacklistToggle }"
                        @click="toggleBlacklist"
                    >
                        <div
                            class="bg-gray-50 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
                            :class="{
                                'translate-x-6 bg-gray-900': blacklistToggle
                            }"
                        ></div>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-md-3">
                        <label>Work On Trigger</label>
                    </div>
                    <!-- <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"> -->
                    <div
                        class="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ml-3"
                        :class="{ 'bg-pink-300': triggerToggle }"
                        @click="toggleTrigger"
                    >
                        <div
                            class="bg-gray-50 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
                            :class="{
                                'translate-x-6 bg-pink-700': triggerToggle
                            }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="profile-options-box p-4 border-t-2 border-solid border-gray-100">
            <h3 class="text-3xl mb-3">Blacklist</h3>
            <div class="flex justify-center" v-if="this.blacklist.length === 0">
                <div class="text-center text-2xl w-2/3">
                    There are no sites currently in your blacklist, add here or
                    through the extension in order to block being saved to your
                    user.
                </div>
            </div>
            <div v-else class="w-full">
                <div class="flex ml-auto pb-8 justify-between items-baseline">
                    <input
                        type="text"
                        v-model="blacklistUrl"
                        class="m-4 border-b-2 outline-none min-w-min text-xl"
                        placeholder="Enter url of site"
                    />
                    <button @click="addToBlacklist" class="main-button">
                        Add
                    </button>
                </div>
                <div
                    class="flex flex-row flex-1"
                    v-for="b in blacklist"
                    :key="b"
                >
                    <p
                        class="text-gray-700 text-xl m-4 hover:text-gray-400 border-gray-200 border-b-2"
                    >
                        {{ b }}
                    </p>
                    <div class="flex ml-auto items-center">
                        <!-- <button class="main-button">Link</button> -->
                        <button
                            @click="removeFromBlacklist(b)"
                            class="main-button"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="profile-options-box p-4 border-t-2 border-solid border-gray-100">
            <h3 class="text-3xl mb-3">Whitelist</h3>
            <div
                class="flex justify-center"
                v-if="!this.whitelist || this.whitelist.length === 0"
            >
                <div class="text-center text-2xl w-2/3">
                    There are no sites currently in your whitelist, add here or
                    through the extension in order to allow only certain sites
                    to be saved to your user.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { isEqual } from "lodash/_equalObjects";
import { deepDiffMapper } from "../utils/object.utils";

export default {
    name: "Profile",
    data() {
        return {
            blacklistToggle: false,
            blacklist: [],
            whitelist: [],
            blacklistUrl: null,
            whitelistUrl: null,
            triggerToggle: false,
            lastSavedUser: {},
        };
    },
    // mounted() {
	// 	// Deep diff utility tester

    //     let result = deepDiffMapper.map(
    //         {
    //             a: "i am unchanged",
    //             b: "i am deleted",
    //             e: {
    //                 a: 1,
    //                 b: false,
    //                 c: null
    //             },
    //             f: [
    //                 1,
    //                 {
    //                     a: "same",
    //                     b: [
    //                         {
    //                             a: "same"
    //                         },
    //                         {
    //                             d: "delete"
    //                         }
    //                     ]
    //                 }
    //             ],
    //             g: new Date("2017.11.25")
    //         },
    //         {
    //             a: "i am unchanged",
    //             c: "i am created",
    //             e: {
    //                 a: "1",
    //                 b: "",
    //                 d: "created"
    //             },
    //             f: [
    //                 {
    //                     a: "same",
    //                     b: [
    //                         {
    //                             a: "same"
    //                         },
    //                         {
    //                             c: "create"
    //                         }
    //                     ]
    //                 },
    //                 1
    //             ],
    //             g: new Date("2017.11.25")
    //         }
    //     );
    //     console.log(result);
    // },
    created() {
        let instance = this;
        let blacklist = this.$store.getters.user.blacklist || [];
        this.blacklist = blacklist;
        let whitelist = this.$store.getters.user.whitelist || [];
        this.whitelist = whitelist;
        let blacklistToggle = this.$store.getters.users.is_blacklist_user || false;
        this.blacklistToggle = blacklistToggle;
        this.$set(this.lastSavedUser, 'lastSavedUser', {
            blacklist,
            whitelist,
            blacklistToggle
        })
    },
    computed: {
        user: function() {
            return this.$store.getters.user;
        },
        userName: function() {
            return (
                this.user && this.user.first_name + " " + this.user.last_name
            );
        },
        userInfo: function() {
            return {
                blacklist: this.user.blacklist,
                whitelist: this.user.whitelist,
                is_blacklist_user: this.user.is_blacklist_user
            };
        },
        changes: function() {
            let u = {
                blacklist: this.user.blacklist,
                whitelist: this.user.whitelist,
                blacklistToggle: this.blacklistToggle
            };
            return deepDiffMapper.map(u, this.lastSavedUser);
        }
    },
    watch: {
        userInfo: function() {
            JSON.stringify(u) === JSON.stringify(this.userInfo);
        }
    },
    methods: {
        toggleBlacklist() {
            this.blacklistToggle = !this.blacklistToggle;
        },
        toggleTrigger() {
            this.triggerToggle = !this.triggerToggle;
        },
        addToBlacklist() {
            console.log(this.blacklistUrl);
            this.$store.dispatch("updateUser", {
                endpoint: "add-to-blacklist",
                doc: { blacklistWebsite: this.blacklistUrl }
            });
            this.blacklist = [...this.blacklist, this.blacklistUrl];
            this.blacklistUrl = null;
        },
        removeFromBlacklist(website) {
            console.log(website);
            website += "";
            this.$store.dispatch("updateUser", {
                endpoint: "remove-from-blacklist",
                doc: { blacklistWebsite: website }
            });
        }
    },
    filters: {
        moment: function(date) {
            return moment(date).format("MM/DD/YY, h:mm");
        }
    }
};
</script>

<style>
.center-all {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.main-button {
    margin: 0.3rem;
    background: conic-gradient(
        from -3.29deg at 100% -13%,
        #ff6348 -8.32deg,
        #ff02e6 11.63deg,
        #ff6348 351.68deg,
        #ff02e6 371.63deg
    );
    border-color: transparent;
    color: white;
    width: 6rem;
    height: 2rem;
    box-shadow: 0px 0px 5px rgba(255, 127, 80, 0.5);
    border-radius: 5px;
}
.main-button:hover {
    background: conic-gradient(
        from -3.29deg at 100% -13%,
        #fd9380 -8.32deg,
        #fd37e9 11.63deg,
        #fa846f 351.68deg,
        #f830e4 371.63deg
    );
}
.main-button:disabled {
    opacity: 50%;
}
.emp-profile {
    padding: 3%;
    margin-top: 3%;
    margin-bottom: 3%;
    border-radius: 0.5rem;
    background: #fff;
}
.profile-img {
    text-align: center;
}
.profile-img img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.profile-head .nav-tabs .nav-link.active {
    border: none;
    border-bottom: 2px solid #0062cc;
}
.profile-work {
    padding: 14%;
    margin-top: -15%;
}
.profile-work p {
    font-size: 12px;
    color: #818182;
    font-weight: 600;
    margin-top: 10%;
}
.profile-work a {
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    font-size: 14px;
}
.profile-work ul {
    list-style: none;
}
.profile-tab label {
    font-weight: 600;
}
.profile-tab p {
    font-weight: 600;
    color: #0062cc;
}

.profile-options {
    display: flex;
    width: 100%;
    flex-direction: column;
}
.profile-options-box {
    margin-top: 3rem;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    transition: 0.25s ease-in-out all;
}
</style>

<template>
    <div>
        <div class="text-4xl mt-20 p-8">
            Sessions
        </div>
        <div class="m-8 text-lg">
            Blacklist / Whitelist
        </div>
        <div
            class="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ml-3"
            :class="{ 'bg-gray-600': isBlacklist }"
            @click="isBlacklist = !isBlacklist"
        >
            <div
                class="bg-gray-50 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ring-2 ring-gray-200"
                :class="{
                    'translate-x-6 bg-gray-900': isBlacklist
                }"
            ></div>
        </div>
        <div
            class="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ml-3 mt-4"
            :class="{ 'bg-red-600': includeYouTube }"
            @click="includeYouTube = !includeYouTube"
        >
            <div
                class="bg-gray-50 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ring-2 ring-black"
                :class="{
                    'translate-x-6 bg-gray-100': includeYouTube
                }"
            ></div>
        </div>
        <sites-list :list="[';aodmad','akdn', 'ldihiaheea']" :listName="'adknda'" :message="'kndaknda'" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SitesList from "../components/SitesList.vue";

export default {
    components: { SitesList },
    name: "Sessions",
    data() {
        return {
            isBlacklist: true,
            includeYouTube: true,
            list: []
        };
    },
    computed: {
        ...mapGetters(["existingSessions"]),
        payload: function() {
            return {
                is_blacklist: this.isBlacklist,
                list: this.list,
                include_youtube: this.includeYouTube
            };
        }
    },
    methods: {
        ...mapActions(["createSession"])

        // const payload = {
        //     is_blacklist: state.isBlacklist,
        //     start_date: new Date(),
        //     end_date: new Date(),
        //     list: state.list,
        //     items: null,
        // }
    }
};
</script>

<template>
    <div class="container py-4">
        <div id="search" class="mb-12">
            <div class="searchbar center">
                <div class="search-box flex flex-row justify-center">
                    <input
                        type="text"
                        ref="search"
                        class=" rounded-r-none rounded-l-md w-1/3 text-base p-3 h-10 text-gray-900 border-gray-300 border-2 justify-items-center focus:border-gray-900 rounded-none"
                        placeholder="Search your history"
                        v-debounce:500ms="searchAll"
                        v-model="query"
                    />
                    <div
                        class="select py-3 px-2 text-xs w-1/12 flex items-center text-gray-400 border-gray-300 border-solid border-l-0 border-2 h-10 cursor-pointer hover:bg-gray-300 shadow-inner rounded-r-md"
                        :class="{
                            'bg-gray-800 hover:bg-gray-700 text-white': showAdvancedOptions
                        }"
                        @click="showAdvancedOptions = !showAdvancedOptions"
                    >
                        Advanced
                    </div>
                </div>
                <transition
                    enter-active-class="transition ease-out duration-500 transform"
                    enter-class="opacity-0 scale-100 -translate-y-6"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition ease-out duration-1500 transform"
                    leave-class="opacity-0 scale-100"
                    leave-to-class="opacity-0 scale-100 -translate-y-3"
                    move="transform ease-in-out duration-500"
                >
                    <div
                        v-if="showAdvancedOptions"
                        class="advanced-options transition-all ease-in"
                    >
                        <div
                            class="w-2/3 h-10 rounded-t-md flex-row flex justify-center items-center mx-auto"
                        >
                            <div
                                class="select py-3 px-4 text-sm flex items-center w-1/8 "
                            >
                                <label class="text-md font-normal my-auto">
                                    History
                                </label>
                                <div
                                    class="w-5 h-5 flex items-center bg-gray-300 rounded-full p-1 ml-2"
                                    :class="{ 'bg-pink-300': searchHistory }"
                                    @click="searchHistory = !searchHistory"
                                >
                                    <div
                                        class="bg-gray-50 w-3 h-3 rounded-full shadow-md "
                                        :class="{
                                            'bg-pink-200': searchHistory
                                        }"
                                    ></div>
                                </div>
                            </div>
                            <div
                                class="select py-3 px-4 text-sm flex items-center w-1/8 "
                            >
                                <label class="text-md font-normal my-auto">
                                    YouTube
                                </label>
                                <div
                                    class="w-5 h-5 flex items-center bg-gray-300 rounded-full p-1 ml-2"
                                    :class="{ 'bg-pink-300': searchYoutube }"
                                    @click="searchYoutube = !searchYoutube"
                                >
                                    <div
                                        class="bg-gray-50 w-3 h-3 rounded-full shadow-md "
                                        :class="{
                                            'bg-pink-200': searchYoutube
                                        }"
                                    ></div>
                                </div>
                            </div>
                            <div
                                class="select py-1 my-2  mx-2 text-sm flex items-center w-1/8 border-solid border-2 rounded-md main-button w-32 justify-center"
                                @click="sortByTime"
                            >
                                <label class="text-md font-normal my-auto">
                                    {{
                                        sortedByTime
                                            ? "Sort By Relevence"
                                            : "Sort By Time"
                                    }}
                                </label>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- serach result list -->
        <div class="card-container py-12 w-10/12 mx-auto">
            <div v-if="noResults">No results found</div>
            <transition-group
                enter-active-class="transition ease-out duration-500 transform"
                enter-class="opacity-0 scale-100 -translate-y-6"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-out duration-1500 transform"
                leave-class="opacity-0 scale-100"
                leave-to-class="opacity-0 scale-100 -translate-y-3"
                move="transform duration-3000"
            >
                <div v-for="(card, index) in data" :key="card._id">
                    <div
                        v-if="sortedByTime && data.length && index === 0"
                        class="h-6 my-2"
                    >
                        <p class="text-xl">
                            {{ getUserDate(itemsDates[index]) }}
                        </p>
                    </div>
                    <div
                        v-if="
                            card._index == 'youtube-captions' && searchYoutube
                        "
                    >
                        <video-card :data="card" />
                    </div>
                    <div v-if="card._index == 'history' && searchHistory">
                        <history-card :data="card" />
                    </div>
                    <div
                        v-if="
                            sortedByTime &&
                                index + 1 < data.length &&
                                areDatesinDifferentDays(
                                    itemsDates[index],
                                    itemsDates[index + 1]
                                )
                        "
                        class="h-6 my-6"
                    >
                        <p class="text-xl">
                            {{ getUserDate(itemsDates[index + 1]) }}
                        </p>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import api from "../services/api.service";
import youtubeThumbnail from "youtube-thumbnail";
import VideoCard from "@/components/VideoCard";
import HistoryCard from "@/components/HistoryCard";

export default {
    name: "Search",
    data() {
        return {
            videoId: null,
            query: "",
            data: [],
            videos: [],
            currentVideo: null,
            searchHistory: true,
            searchYoutube: true,
            showAdvancedOptions: false,
            sortedByTime: false
            // focusQuery: false
        };
    },
    components: {
        VideoCard,
        HistoryCard
    },
    methods: {
        search() {
            axios
                .get("http://localhost:3001/yt/captions?q=" + this.query)
                .then(response => {
                    this.data = response.data;
                    if (response.data.length === 0) {
                        this.noResults = true;
                    } else {
                        this.noResults = false;
                    }
                    this.videos = response.data.map(v => {
                        this.parseYoutubeTitle(v._source.title);
                        return {
                            id: v._source.id,
                            title: this.parseYoutubeTitle(v._source.title),
                            markersLength:
                                v.inner_hits.timedText.hits.hits.length,
                            currentMarker: 0,
                            markers: v.inner_hits.timedText.hits.hits
                                .map(m => {
                                    return parseInt(m._source.start);
                                })
                                .sort(function(a, b) {
                                    //TODO: sort in elastic not in client (? maybe its better)
                                    return a - b;
                                })
                        };
                    });
                });
        },
        async searchAll() {
            const { data } = await api.get(
                `historyOld?q=${this.query}&u=${this.$store.getters.userId}`
            );
            this.data = data;
        },
        changeVideo(video) {
            this.videoId = video.id;
            this.currentVideo = video;
        },
        playVideo() {
            this.seekVideo(0);
            this.player.playVideo();
        },
        seekVideo(sec) {
            this.player.seekTo(sec);
        },
        moveToNextMarker() {
            let v = this.currentVideo;
            this.seekVideo(v.markers[v.currentMarker]);
            v.currentMarker = (v.currentMarker + 1) % v.markersLength;
        },
        moveToPrevoiusMarker() {
            let v = this.currentVideo;
            this.seekVideo(v.markers[v.currentMarker]);
            v.currentMarker =
                v.currentMarker == 0
                    ? v.markersLength - 1
                    : v.currentMarker - 1;
        },
        getThumbanil(videoId) {
            let thumbnail = youtubeThumbnail(
                "https://www.youtube.com/watch?v=" + videoId
            );
            console.log(thumbnail);
            return thumbnail;
        },
        parseYoutubeTitle(title) {
            let regex = /^(\(\d+\)\s)?([a-zA-Z\s\d\-\'\(\)\!\?\:\.\,\/\\\[\]\&\*\$\#\@\^\~\|]*)(\-\sYouTube)$/;
            let res = title.match(regex);
            if (res && res[2]) {
                return res[2];
            } else {
                return title;
            }
        },
        sortByTime() {
            if (this.sortedByTime) {
                this.data = this.data.sort((a, b) => {
                    return b["_score"] - a["_score"];
                });
                this.sortedByTime = false;
            } else {
                this.data = this.data.sort((a, b) => {
                    let aDate = a["_source"]["users"][0]["date"];
                    let bDate = b["_source"]["users"][0]["date"];
                    return bDate - aDate;
                });
                this.sortedByTime = true;
            }
        },
        areDatesinDifferentDays(a, b) {
            let dayA = new Date(a);
            let dayB = new Date(b);
            return dayA.getDate() > dayB.getDate();
        },
        getUserDate(d) {
            let day = new Date(d);
            return day.toDateString();
        },
        focusSearch() {
          this.$refs.search.focus()
        }
    },
    computed: {
        player() {
            return this.$refs.youtube.player;
        },
        noResults() {
            return this.data.length === 0 && this.query;
        },
        filteredData() {
            if (this.searchHistory && !this.searchYoutube) {
                // let historyData = data.filter(d => d._index === "history");
                return this.data.filter(d => {
                    return d._index === "history";
                });
            } else if (!this.searchHistory && this.searchYoutube) {
                return this.data.filter(d => {
                    return d._index === "youtube-captions";
                });
            } else {
                return this.data;
            }
        },
        itemsDates() {
            return this.data.map(d => {
                return new Date(d["_source"]["users"][0]["date"]);
            });
        }
    },    
    mounted() {
        this.focusSearch()
        // When the user scrolls the page, execute myFunction
        window.onscroll = function() {
            makeSticky();
            console.log("1");
        };
        if (this.$route.query.q) {
            setTimeout(() => {
                this.query = this.$route.query.q;
                this.searchAll();
            }, 500);
        }
        // Get the navbar
        var navbar = document.getElementById("search");

        // Get the offset position of the navbar
        var sticky = navbar.offsetTop;

        // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
        function makeSticky() {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky");
            } else {
                navbar.classList.remove("sticky");
            }
        }
    }
};
</script>

<style>
/* .search-box {
    width: 400px !important;
    height: 60px;
    margin-left: auto;
    margin-right: auto;
    font-size: 1.2rem !important;
    font-weight: 500 !important;
} */
#search {
    position: absolute;
    width: 100vw;
    left: 0;
    top: 80px;
    background-color: white;
    padding: 10px;
    transition: box-shadow ease 0.15s;
    margin: 0;
}
/* The sticky class is added to the navbar with JS when it reaches its scroll position */
.sticky {
    position: fixed !important;
    top: 0px !important;
    z-index: 1;
    background-color: white;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}
body {
    background-color: #212020;
    overflow-x: hidden;
}
.card-container {
    margin-top: 100px;
}
.main-button {
    /* margin: 0.3rem; */
    background: conic-gradient(
        from -3.29deg at 100% -13%,
        #ff6348 -8.32deg,
        #ff02e6 11.63deg,
        #ff6348 351.68deg,
        #ff02e6 371.63deg
    );
    border-color: transparent;
    color: white;
    /* width: 6rem; */
    /* height: 2rem; */
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
.list-enter-active-class {
    transition: ease-out;
    transition-duration: 500ms;
}
.list-enter-class,
.leave-to-class {
    opacity: 0;
    scale: 95;
}
.list-enter-to-class,
.leave-class {
    opacity: 100;
    scale: 100;
}
.list-leave-active-class {
    transition: ease-in;
    transition-duration: 150ms;
}
.list-move {
    transition: transform 1s;
}
</style>

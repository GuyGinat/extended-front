<template>
  <div class="container my-12">
    <div id="search">
      <div class="searchbar center">
        <input
          type="text"
          class="form-control search-box"
          placeholder="Search your history"
          v-debounce:350ms="searchAll"
          v-model="query"
        />
      </div>
    </div>

    <!-- serach result list -->
    <div class="card-container py-3">
      <div v-if="noResults"> No results found </div>
      <div v-for="card in data" :key="card._id">
        <div v-if="card._index == 'youtube-captions'">
          <video-card :data="card" />
        </div>
        <div v-if="card._index == 'history'">
          <history-card :data="card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../services/api.service"
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
      // noResults: false,  
    };
  },
  components: {
    VideoCard,
    HistoryCard,
  },
  methods: {    
    search() {
      axios
        .get("http://localhost:3001/yt/captions?q=" + this.query)
        .then((response) => {
          this.data = response.data;
          if (response.data.length === 0) {
            this.noResults = true;
          } else {
            this.noResults = false;
          }
          this.videos = response.data.map((v) => {
            this.parseYoutubeTitle(v._source.title);
            return {
              id: v._source.id,
              title: this.parseYoutubeTitle(v._source.title),
              markersLength: v.inner_hits.timedText.hits.hits.length,
              currentMarker: 0,
              markers: v.inner_hits.timedText.hits.hits
                .map((m) => {
                  return parseInt(m._source.start);
                })
                .sort(function (a, b) {
                  //TODO: sort in elastic not in client (? maybe its better)
                  return a - b;
                }),
            };
          });
        });
    },
    async searchAll() {
      const { data } = await api.get(`historyOld?q=${this.query}&u=${this.$store.getters.userId}`)
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
        v.currentMarker == 0 ? v.markersLength - 1 : v.currentMarker - 1;
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
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    noResults() {
      return (this.data.length === 0) && this.query
    }
  },
  mounted() {
    // When the user scrolls the page, execute myFunction
    window.onscroll = function() {
      makeSticky();
      console.log("1");
    };

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
  },
};
</script>

<style>
.search-box {
  width: 400px !important;
  height: 60px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.2rem !important;
  font-weight: 500 !important;
}
#search {
  position: absolute;
  width: 100vw;
  left: 0;  
  top: 60px;
  align-content: center;
  align-items: center;
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
  overflow-x:hidden;
}
.card-container {
margin-top: 100px;
}
</style>

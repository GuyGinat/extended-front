<template>
    <div
        class="video-card row border-t-2 border-solid border-gray-100 w-full mx-auto"
    >
        <div class="col col-md-4">
            <img v-bind:src="youtubeThumbnail" />
        </div>
        <div class="col col-md-8">
            <div class="title">{{ parseYoutubeTitle(data._source.title) }}</div>
            <div class="subtitle">
                <a
                    :href="'https://youtube.com/watch?v=' + data._source.id"
                    target="_blank"
                    >youtube.com/watch?v={{ data._source.id }}</a
                >
            </div>
            <div class="findings mb-5">
                <div
                    class="highlight"
                    v-for="finding in data.highlight.rawText.slice(0, 3)"
                    v-html="finding"
                    :key="finding"
                ></div>
            </div>
            <div class="video-expand">
                <button
                    type="button"
                    class="btn btn-outline-dark expand-btn"
                    @click="toggleExpand"
                >
                    Show Video Highlights
                </button>
                <button
                    type="button"
                    class="btn btn-outline-dark expand-btn"
                    @click="toggleExpandCaptions"
                >
                    Full Captions
                </button>
            </div>
        </div>
        <transition
                    enter-active-class="transition ease-out duration-500 transform"
                    enter-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-150 transform"
                    leave-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95"
                >
            <div
                class="expand-container row"
                v-if="expanded || expandedCaptions"
            >
                <div class="col col-md-7">
                    <youtube
                        width="600"
                        :video-id="data._source.id"
                        ref="youtube"
                    />
                    <!-- <youtube
                        resize="true"
                        width="600"
                        :video-id="data._source.id"
                        ref="youtube"
                    /> -->
                </div>

                <div v-if="expanded" class="col col-md-5 pl-4">
                    <strong>Search Query Appearances</strong>
                    <div class="findings-conatiner">
                        <div
                            class="finding-row row"
                            v-for="finding in sortedHits"
                            :key="finding._source.start"
                        >
                            <div class="col col-md-9">
                                {{ finding._source.text }}
                            </div>
                            <div class="col col-md-1">
                                <small>{{
                                    secondsToHms(finding._source.start)
                                }}</small>
                            </div>
                            <div class="col col-md-2">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-primary"
                                    @click="seekVideo(finding._source.start)"
                                >
                                    <!-- <font-awesome-icon icon="user-secret" /> -->
                                    Play
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="expandedCaptions" class="col col-md-5 pl-3">
                    <strong>Video Captions</strong>
                    <div class="findings-conatiner col col-12">
                        <div
                            class="finding-row row caption-text"
                            v-for="finding in captions"
                            :key="finding.start"
                            @click="seekVideo(finding.start)"
                        >
                            {{ finding.text }}
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "VideoCard",
    props: { data: Object },
    data() {
        return {
            currentVideo: null,
            expanded: false,
            expandedCaptions: false
        };
    },
    methods: {
        toggleExpand() {
            this.expanded = !this.expanded;
            this.expandedCaptions = false;
        },
        toggleExpandCaptions() {
            this.expandedCaptions = !this.expandedCaptions;
            this.expanded = false;
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
        parseYoutubeTitle(title) {
            let regex = /^(\(\d+\)\s)?([a-zA-Z\s\d\-\'\(\)\!\?\:\.\,\/\\\[\]\&\*\$\#\@\^\~\|]*)(\-\sYouTube)$/;
            let res = title.match(regex);
            if (res && res[2]) {
                return res[2];
            } else {
                return title;
            }
        },
        secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor((d % 3600) / 60);
            var s = Math.floor((d % 3600) % 60);

            return (
                (h < 1 ? "" : h) +
                (m < 10 ? "0" + m : m) +
                ":" +
                (s < 10 ? "0" + s : s)
            );
        }
    },
    computed: {
        player() {
            return this.$refs.youtube.player;
        },
        youtubeThumbnail() {
            return `https://img.youtube.com/vi/${this.data._source.id}/hqdefault.jpg`;
        },
        sortedHits() {
            return [...this.data.inner_hits.timedText.hits.hits].sort(function(
                a,
                b
            ) {
                return (
                    parseFloat(a._source.start) - parseFloat(b._source.start)
                );
            });
        },
        captions() {
            return [...this.data._source.timedText].sort(function(a, b) {
                return parseFloat(a.start) - parseFloat(b.start);
            });
        }
    }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
.video-card {
    background-color: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    transition: 0.25s ease-in-out all;
}
.title {
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
}
img {
    width: 100%;
    height: 169px;
    border-radius: 5px;
    object-fit: cover;
}
.findings-conatiner {
    max-height: 330px;
    overflow: auto;
    overflow-x: hidden;
}
.video-expand {
    position: absolute;
    right: 0.2rem;
    bottom: 0.2rem;
}
.expand-btn {
    /* position: relative; */
    /* bottom: 0.2em; */
    float: right;
    /* right: 10px; */
    margin: 0.2rem;
}

.expand-container {
    width: 100%;
    margin-top: 15px;
    padding: 10px;
}
.finding-row {
    margin-bottom: 10px;
}
.caption-text:hover {
    color: rgb(122, 122, 145);
    cursor: pointer;
}
.expand-enter-active,
.expand-leave-active {
    transition: opacity 1 ease-in-out;
}
.expand-enter,
.expand-leave-to {
    transition: opacity 0;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>

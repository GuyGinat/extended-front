<template>
  <div class="history-card row border-t-2 border-solid border-gray-100">
    <div class="col col-md-4">
      <div class="screenshot">
        <img
          class="flex items-center justify-center"
          v-if="
            data._source.metadata &&
              data._source.metadata.ogImage &&
              data._source.metadata.ogImage.url
          "
          :src="data._source.metadata.ogImage.url"
        />
        <div
          class=""
          style="text-align: center; font-size: 18pt"
          v-if="
            !data._source.metadata ||
              !data._source.metadata.ogImage ||
              !data._source.metadata.ogImage.url
          "
        >
          No Image
        </div>
      </div>
    </div>
    <div class="col col-md-8">
      <div class="title">{{ data._source.title }}</div>
      <div class="subtitle">
        <a :href="data._source.link" target="_blank"
          >{{ data._source.link.slice(0, 60)
          }}<span v-if="data._source.link.length > 60">...</span></a
        >
      </div>
      <div class="findings">
        <div
          class="highlight"
          v-for="finding in data.highlight.rawText.slice(0, 3)"
          v-html="finding"
          :key="finding"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { metascraper } from "metascraper-image";
export default {
  name: "HistoryCard",
  props: { data: Object },
  data() {
    return {
      currentVideo: null
    };
  },
  methods: {},
  computed: {}
};
</script>

<style>
.history-card {
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
}
.screenshot {
  width: 360px;
  height: 202px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(243, 243, 243);
  border: rgb(148, 148, 148) 1px solid;
  width: 100%;
  height: 169px;
  border-radius: 5px;
  object-fit: cover;
}
.highlight em {
  background-color: rgba(217, 255, 47, 0.671);
}
</style>

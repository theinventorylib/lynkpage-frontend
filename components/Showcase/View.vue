<script setup lang="ts">
import type { DisplayItem } from "../../types";

// api
const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

// props : a list of projects grouped by category
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  projects: {
    type: Array as PropType<DisplayItem[]>,
    required: true,
  },
});

// a watch that takes the image url as an argument and returns the image
const getImage = (url: string) => {
  if (url) {
    // check image url if it is a local image or a image
    if (homeUrl.includes("http://localhost:3000")) {
      // url = url.replace("django:8000", "localhost:8000");
    } else {
      const domainMatch = homeUrl.match(/https?:\/\/([^/]+)\//);
      const domain = domainMatch ? domainMatch[1] : "";
      const newImage = url.match(/(\/media\/.*)/);
      url = `https://app.${domain}${newImage?.[1]}`;
      //user.value.image  = homeUrl + user.value.image.replace("/media/", "media/");
    }
    return url;
  }
  return "";
};

// update the props and remove empty categories
const projects = computed(() => {
  return props.projects
    .map((item) => {
      return {
        ...item,
        data: item.data.filter((data) => data.id !== null),
      };
    })
    .filter((item) => item.data.length > 0);
});
</script>
<template>
  <div>
    <div v-for="(cat, index) in projects" :key="index">
      <!-- cards -->
      <h2 class="font-bold text-2xl text-center mx-4 my-5">
        {{ cat.name }}
      </h2>
      <div
        class="grid flex-row flex-wrap gap-4 md:grid-flow-row-dense md:grid-cols-3 md:auto-rows-min"
      >
        <a
          v-for="(item, index) in cat.data"
          :key="index"
          :name="item.title"
          :class="[
            item.image
              ? 'card card-compact bg-primary shadow-xl justify-center content-center items-center'
              : item.embeded_item
                ? 'card card-compact bg-primary shadow-xl h-min justify-center content-center items-center'
                : 'card card-compact card-side bg-primary shadow-xl h-min justify-center content-center items-center',
          ]"
          :href="item.link"
        >
          <!-- should only render when there is a image -->
          <figure v-if="item.embeded_item" class="w-full h-content">
            <iframe
              :src="embededLink(item.link)"
              frameborder="0"
              class="w-full z-0"
              style="object-fit: cover"
            ></iframe>
          </figure>

          <!-- should only render when there is a image -->
          <figure v-else :class="[item.image ? 'h-40 ' : 'hidden']">
            <img
              :src="getImage(item.image)"
              alt="item image"
              :class="[item.image ? ' h-content' : 'hidden']"
            />
          </figure>
          <!-- should only render when there is a title -->
          <div
            :class="[
              item.image && item.title
                ? 'card-body items-start text-start text-ellipsis overflow-hidden'
                : item.title
                  ? 'card-body justify-center items-center text-center content-center overflow-hidden'
                  : 'hidden',
            ]"
          >
            <h2 class="card-title">
              {{ item.title }}
            </h2>
          </div>
        </a>
      </div>
      <!-- card end -->
    </div>
  </div>
</template>

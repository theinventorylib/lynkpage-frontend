<script setup lang="ts">
import type { UserDisplayInterface } from "../../types";

// api
const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

// props : a list of projects grouped by category
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  user: {
    type: Object as PropType<UserDisplayInterface>,
    required: true,
  },
});

// a watch that takes the image url as an argument and returns the image
const getImage = (url: string) => {
  if (url) {
    // check image url if it is a local image or a image
    if (homeUrl.includes("http://localhost:3000")) {
      url = url.replace("django:8000", "localhost:8000");
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
</script>
<template>
  <div>
    <div
      class="transition card bg-base-100 mx-3 md:w-96 lg:w-96 sm:w-screen md:h-min md:shadow-sm no-scrollbar mt-16"
    >
      <figure class="align-top flex justify-center mb-4">
        <img
          :src="
            getImage(
              user.image
                ? user.image
                : 'http://localhost:8000/static/images/user/user_default.png',
            )
          "
          alt="user-image"
          class="rounded-full mx-auto absolute w-32 h-32 border-8 border-base-100 z-[11]"
        />
      </figure>
      <div class="card items-center text-center bg-primary pt-14 p-5">
        <h2 class="card-title text-2xl">
          {{ user.full_name }}
        </h2>
        <!-- list of occupations -->
        <h3
          class="card-subtitle text-base-content text-opacity-90 font-semibold"
        >
          {{ user.occupation }}
        </h3>
        <!-- list of occupations end -->
        <p>{{ user.about }}</p>
        <!-- social media links icons -->
        <LazyLinkIcons :links="user.social_links" />
        <!-- skills buttons -->
        <LazySkillList :skills="user.skills" />
        <!-- skills button end -->
      </div>
    </div>
  </div>
</template>

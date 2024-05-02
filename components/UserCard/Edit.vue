<script setup lang="ts">
import type { UserInterface } from "../../types";

// api
const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

// props : a list of projects grouped by category
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  user: {
    type: Object as PropType<UserInterface>,
    required: true,
  },
  // editmode function for emitting to parent
  editMode: {
    type: Function,
    required: false,
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
      <!-- edit button -->
      <div class="card-actions mx-auto absolute -bottom-5 right-3">
        <button class="btn btn-circle btn-accent" @click="editMode!()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="icon"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-.71-.29a1 1 0 0 0-.71.29l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8a1.19 1.19 0 0 0 .22-.33a1 1 0 0 0 0-.24a.7.7 0 0 0 0-.14ZM6.83 20H4v-2.83l9.93-9.93l2.83 2.83ZM18.17 8.66l-2.83-2.83l1.42-1.41l2.82 2.82Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

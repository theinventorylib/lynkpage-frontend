<script setup lang="ts">
// import { storeToRefs } from "pinia"; // import storeToRefs helper hook from pinia
// import { useAuthStore } from "../stores/auth";
const { getUserData } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

// set the color mode
useColorMode().preference = "dark";

const yourLink = ref("");
const loadingVar = ref(true);
onMounted(() => {
  const domainMatch = homeUrl.match(/https?:\/\/([^/]+)/);
  const domain = domainMatch ? domainMatch[1] : "";
  if (homeUrl.includes("localhost:3000")) {
    yourLink.value = `${domain}/${getUserData.value.username}`;
  } else {
    yourLink.value = `${domain}/${getUserData.value.username}`;
  }
  loadingVar.value = false;
});

// to anticipate the change in the username
onUpdated(async () => {
  const domainMatch = homeUrl.match(/https?:\/\/([^/]+)/);
  const domain = domainMatch ? domainMatch[1] : "";
  if (homeUrl.includes("localhost:3000")) {
    yourLink.value = `${domain}/${getUserData.value.username}`;
  } else {
    yourLink.value = `${domain}/${getUserData.value.username}`;
  }
  loadingVar.value = false;
});
</script>
<template>
  <div id="wrapper">
    <Header show-menu />
    <div v-if="loadingVar">
      <div class="hero h-screen">
        <div class="hero-content flex-col">
          <span class="loading loading-infinity loading-lg"></span>
        </div>
      </div>
    </div>
    <!-- <ClientOnly> -->
    <div v-if="!loadingVar" class="card mx-auto">
      <!-- greetings card -->
      <div class="card-body overflow-x-clip">
        <h2
          class="flex flex-col md:flex-row text-5xl font-semibold text-wrap break-words"
        >
          Welcome,
          <span class="sm:text-6xl md:text-5xl font-bold text-wrap break-words">
            {{ getUserData.username }}
          </span>
        </h2>
      </div>

      <div class="card-body">
        <p class="my-2 text-lg overflow-x-clip">
          Your page:
          <a :href="yourLink" class="link link-info text-wrap break-words">{{
            yourLink
          }}</a>
        </p>
        <h2 class="card-title text-xl">What would you like to do?</h2>

        <!-- cards -->
        <div
          class="flex-row flex-wrap gap-2 grid grid-flow-row-dense md:grid-cols-3 auto-rows-min mt-3"
        >
          <!-- edit page -->
          <NuxtLink
            to="/edit"
            class="card card-compact card-side bg-slate-800 shadow-xl h-min justify-center content-center py-4"
          >
            <figure class="px-6 rounded-xl h-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon"
                width="60px"
                height="60px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-.71-.29a1 1 0 0 0-.71.29l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8a1.19 1.19 0 0 0 .22-.33a1 1 0 0 0 0-.24a.7.7 0 0 0 0-.14ZM6.83 20H4v-2.83l9.93-9.93l2.83 2.83ZM18.17 8.66l-2.83-2.83l1.42-1.41l2.82 2.82Z"
                ></path>
              </svg>
            </figure>
            <div class="card-body justify-center content-center py-4">
              <h2 class="card-title justify-between">Edit Page</h2>
            </div>
          </NuxtLink>

          <!-- analytics -->
          <a
            href="#"
            class="card card-compact card-side bg-slate-800 shadow-xl h-min justify-center content-center py-4"
          >
            <figure class="px-6 rounded-xl h-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon"
                width="60px"
                height="60px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5 12a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0v-8a1 1 0 0 0-1-1m5-10a1 1 0 0 0-1 1v18a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1m10 14a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1m-5-8a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1"
                ></path>
              </svg>
            </figure>
            <div class="card-body justify-center content-center py-4">
              <h2 class="card-title justify-between">
                Analytics
                <div class="badge badge-outline">N/A</div>
              </h2>
            </div>
          </a>

          <!-- themes Store -->
          <NuxtLink
            to="/themes"
            class="card card-compact card-side bg-slate-800 shadow-xl h-min justify-center content-center py-4"
          >
            <figure class="px-6 rounded-xl h-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon"
                width="60px"
                height="60px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M22 7.82a1.25 1.25 0 0 0 0-.19l-2-5A1 1 0 0 0 19 2H5a1 1 0 0 0-.93.63l-2 5a1.25 1.25 0 0 0 0 .19A.58.58 0 0 0 2 8a4 4 0 0 0 2 3.4V21a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9.56A4 4 0 0 0 22 8a.58.58 0 0 0 0-.18M13 20h-2v-4h2Zm5 0h-3v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5H6v-8a4 4 0 0 0 3-1.38a4 4 0 0 0 6 0A4 4 0 0 0 18 12Zm0-10a2 2 0 0 1-2-2a1 1 0 0 0-2 0a2 2 0 0 1-4 0a1 1 0 0 0-2 0a2 2 0 0 1-4 .15L5.68 4h12.64L20 8.15A2 2 0 0 1 18 10"
                ></path>
              </svg>
            </figure>
            <div class="card-body justify-center content-center py-4">
              <h2 class="card-title justify-between overflow-x-clip">
                Themes Store
              </h2>
            </div>
          </NuxtLink>

          <!-- account settings -->
          <NuxtLink
            to="/edit/account"
            class="card card-compact card-side bg-slate-800 shadow-xl h-min justify-center content-center py-4"
          >
            <figure class="px-6 rounded-xl h-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon"
                width="60px"
                height="60px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19M12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4"
                ></path>
              </svg>
            </figure>
            <div class="card-body justify-center content-center py-4">
              <h2 class="card-title justify-between">Account</h2>
            </div>
          </NuxtLink>

          <!-- settings -->
          <!-- <a
            href="#"
            class="card card-compact card-side bg-slate-800 shadow-xl h-min justify-center content-center py-4"
          >
            <figure class="px-6 rounded-xl h-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon"
                width="60px"
                height="60px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98m-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"
                ></path>
              </svg>
            </figure>
            <div class="card-body justify-center content-center py-4">
              <h2 class="card-title justify-between">
                Settings
                <div class="badge badge-outline">N/A</div>
              </h2>
            </div>
          </a> -->

          <!-- Faqs -->
          <NuxtLink
            to="/faqs"
            class="card card-compact card-side bg-slate-800 shadow-xl h-min justify-center content-center py-4"
          >
            <figure class="px-6 rounded-xl h-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon"
                width="60px"
                height="60px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M6.29 10.3a1 1 0 0 0 1.09 1.63a1.19 1.19 0 0 0 .33-.22a1 1 0 0 0 .21-.32A.85.85 0 0 0 8 11a1 1 0 0 0-.29-.7a1 1 0 0 0-1.42 0M7 5a1 1 0 0 1 0 2a1 1 0 0 0 0 2a3 3 0 1 0-2.6-4.5a1 1 0 0 0 .37 1.37a1 1 0 0 0 1.36-.37A1 1 0 0 1 7 5m12 1h-6a1 1 0 0 0 0 2h6a1 1 0 0 1 1 1v9.72l-1.57-1.45a1 1 0 0 0-.68-.27H9a1 1 0 0 1-1-1v-1a1 1 0 0 0-2 0v1a3 3 0 0 0 3 3h8.36l3 2.73A1 1 0 0 0 21 22a1.1 1.1 0 0 0 .4-.08A1 1 0 0 0 22 21V9a3 3 0 0 0-3-3"
                ></path>
              </svg>
            </figure>
            <div class="card-body justify-center content-center py-4">
              <h2 class="card-title justify-between">FAQs</h2>
            </div>
          </NuxtLink>
        </div>
        <!-- card end -->
      </div>
    </div>
    <!-- </ClientOnly> -->
    <!-- <gradient /> -->
  </div>
</template>

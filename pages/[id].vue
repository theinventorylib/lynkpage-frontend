<script setup lang="ts">
import type { UserDisplayInterface } from "../types";

// apiurl
const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

// get the userName
const userName = ref("");
// const router = useRouter();
const route = useRoute();

// themedata
const themeName = ref("");

// data Note: remove | undefined
const portfoliodata = ref<UserDisplayInterface>({
  username: "",
  full_name: "",
  image: "",
  thumbnail: "",
  occupation: "",
  skills: [],
  social_links: [],
  location: "",
  email: "",
  about: "",
  theme_name: "",
  is_premium: false,
  user_data: [],
});

// error handler
const errorVar = ref(false);
// loading handler
const loadingVar = ref(true);

// mounted
// onBeforeMount(async () => {
const subsList = route.params.id;
if (subsList.length < 3) {
  errorVar.value = true;
  loadingVar.value = false;
}

userName.value = subsList.toString();

const userName_blacklist = [
  "www",
  "app",
  "api",
  "localhost",
  "localhost:3000",
  "127.0.0.1",
  "127.0.0.1:3000",
];

if (!userName_blacklist.includes(userName.value)) {
  errorVar.value = false;
  // use fetch
  const { data, error, pending } = await useFetch("/api/getPortfolio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: userName.value }),
    // cache: "no-cache",
    server: true,
  });

  loadingVar.value = pending.value;

  if (data.value) {
    portfoliodata.value = data.value;
    themeName.value = data.value.theme_name;
  } else if (error.value) {
    errorVar.value = true;
  }
} else {
  errorVar.value = true;
}

// themeName.value = "cupcake";
// console.log("user data", portfoliodata.value);

// switching based on homeUrl
if (portfoliodata.value.image !== null) {
  if (homeUrl.includes("localhost:3000")) {
    // portfoliodata.value.image =
    //   "http://localhost:8000" + portfoliodata.value.image;
  } else {
    const domainMatch = homeUrl.match(/https?:\/\/([^/]+)\//);
    const domain = domainMatch ? domainMatch[1] : "";
    const newImage = portfoliodata.value.image.match(/(\/media\/.*)/);
    portfoliodata.value.image = `https://app.${domain}${newImage?.[1]}`;
  }
}

useSeoMeta({
  title: `${portfoliodata.value.full_name ? portfoliodata.value.full_name : "Lynkpage"} | ${
    portfoliodata.value.occupation
      ? portfoliodata.value.occupation
      : "User Not Found"
  }`,
  ogTitle: `${portfoliodata.value.full_name ? portfoliodata.value.full_name : "Lynkpage"} | ${
    portfoliodata.value.occupation
      ? portfoliodata.value.occupation
      : "User Not Found"
  }`,
  // include the user skills and occupation in the description
  description: `${portfoliodata.value.about}`,
  ogDescription: `${portfoliodata.value.about}`,
  ogImage: `${portfoliodata.value.image}`,
  ogUrl: `${homeUrl}/${portfoliodata.value.username}`,

  twitterTitle: `${portfoliodata.value.full_name} | ${portfoliodata.value.occupation}`,
  twitterDescription: `${portfoliodata.value.about}`,
  twitterImage: `${portfoliodata.value.image}`,
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});

// the end
// });
</script>
<template>
  <div :data-set-theme="themeName" data-act-class="!outline-base-content">
    <div :data-theme="themeName" class="bg-base-100 min-h-screen">
      <!-- portfolio -->
      <!-- portfolio navbar -->
      <section v-if="!errorVar">
        <div class="navbar bg-base-100 justify-between w-full">
          <div class="flex-1 justify-between">
            <router-link to="/" class="btn btn-ghost gap-0 normal-case text-xl"
              >lynk
              <p class="italic">page</p>
            </router-link>
          </div>
        </div>
      </section>
      <!-- portfolio navbar end -->

      <!-- loading skeleton -->
      <div v-if="loadingVar">
        <div
          class="card md:card-side bg-base-100 min-h-screen md:h-screen overflow-hidden no-scrollbar"
        >
          <!-- user card and avatar -->
          <div
            class="skeleton card bg-primary mx-3 rounded-md md:w-96 lg:w-96 sm:w-screen md:h-min md:shadow-sm no-scrollbar mt-16"
          >
            <figure
              class="skeleton align-top flex justify-center mb-4 bg-primary"
            >
              <img
                alt=""
                class="rounded-full mx-auto absolute w-32 h-32 border-8 border-slate-800 bg-primary"
              />
            </figure>
            <div
              class="skeleton card-body items-center text-center bg-primary rounded-2xl pt-14"
            ></div>
          </div>
          <!-- user card and avartar -->
          <div class="hidden md:divider mb-0 lg:divider-horizontal my-3"></div>
          <!-- links skeleton -->
          <div
            class="skeleton card-body w-screen md:w-96 md:overflow-y-auto no-scrollbar"
          >
            <div
              class="skeleton grid flex-row flex-wrap gap-4 md:grid-flow-row-dense md:grid-cols-3 md:auto-rows-min"
            >
              <!-- one -->
              <div
                class="skeleton card card-compact bg-primary shadow-xl py-2 px-2 pb-3"
              >
                <div
                  class="skeleton card-body items-start text-start text-ellipsis overflow-hidden"
                ></div>
              </div>
              <!-- two -->
              <div
                class="skeleton card card-compact bg-primary shadow-xl py-2 px-2 pb-3"
              >
                <div
                  class="skeleton card-body items-start text-start text-ellipsis overflow-hidden"
                ></div>
              </div>
              <!-- three -->
              <div
                class="skeleton card card-compact bg-primary shadow-xl py-2 px-2 pb-3"
              >
                <div
                  class="skeleton card-body items-start text-start text-ellipsis overflow-hidden"
                ></div>
              </div>
            </div>
          </div>
          <!-- link skeleton -->
        </div>
      </div>
      <!-- loading skeleton end -->

      <!-- page not found card -->
      <div v-if="errorVar && !loadingVar">
        <div class="hero min-h-screen">
          <div class="hero-content flex-col">
            <div class="card w-96 bg-neutral text-neutral-content">
              <div class="card-body items-center text-center">
                <h2 class="card-title">Error 404!</h2>
                <p>{{ userName }}'s page not found</p>
                <div class="card-actions justify-center">
                  <button class="btn btn-primary">Go home</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!errorVar && !loadingVar">
        <!-- portfolio -->
        <section>
          <div
            class="card md:card-side bg-base-100 md:h-screen overflow-hidden no-scrollbar"
          >
            <!-- user details -->
            <LazyUserCardView :user="portfoliodata" />
            <!-- user details end -->

            <div class="hidden md:divider mb-0 lg:divider-horizontal"></div>

            <!-- user data -->
            <div
              class="card-body w-screen md:w-96 md:overflow-y-auto no-scrollbar"
            >
              <!-- card -->
              <LazyShowcaseView
                id="showcase"
                :projects="portfoliodata.user_data"
              />
              <!-- card end -->
            </div>
            <!-- user data end -->
          </div>
        </section>
        <!-- portfolio end -->
      </div>
    </div>
  </div>
</template>

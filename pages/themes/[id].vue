<script lang="ts" setup>
const store = useAuthStore(); // use the auth store we just created
const { getUserData } = storeToRefs(store); // make authenticated state reactive with storeToRefs
const { updateUser } = store;
// theme from route
const theme = ref("");
const route = useRoute();
const router = useRouter();

// data
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

theme.value = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const saveTheme = async () => {
  console.log("theme", theme.value);
  const formdata = new FormData();
  formdata.append("theme_name", theme.value);
  // console.log("formdata", formdata.get("theme_name"));
  const response = await fetch("/api/patchUser", {
    method: "POST",
    body: formdata,
  });
  if (response.ok) {
    const data = await response.json();
    updateUser(data as UserInterface);
    router.push("/edit");
  }
};

onMounted(async () => {
  // username
  // use fetch
  const response = await fetch("/api/getPortfolio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: getUserData.value.username }),
  });

  const data = await response.json();
  portfoliodata.value = data;
});
</script>
<template>
  <div>
    <!-- portfolio -->
    <section :data-set-theme="theme" data-act-class="!outline-base-content">
      <div :data-theme="theme">
        <!-- portfolio navbar -->
        <div class="navbar bg-base-100 justify-between w-full">
          <div class="flex-1 justify-between">
            <router-link
              to="/themes"
              class="btn btn-ghost gap-0 normal-case text-xl"
            >
              <Icon name="uil:angle-left-b" size="38" class="icon" />
              lynk
              <p class="italic">page</p>
            </router-link>

            <button class="btn btn-accent" @click="saveTheme()">save</button>
          </div>
        </div>
        <!-- portfolio navbar end -->
        <div
          class="card md:card-side bg-base-100 min-h-screen md:h-screen overflow-hidden no-scrollbar"
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
      </div>
    </section>
    <!-- portfolio end -->
  </div>
</template>

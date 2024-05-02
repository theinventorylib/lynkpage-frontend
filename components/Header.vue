<script setup lang="ts">
const router = useRouter();
const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

const store = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated, getUserData } = storeToRefs(store); // make authenticated state reactive with storeToRefs

// props
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  showMenu: {
    type: Boolean,
    default: false,
    required: false,
  },
  showLink: {
    type: Boolean,
    defualt: false,
    required: false,
  },
});

const logout = async () => {
  await store.logUserOut();
  await router.push("/auth/login");
};

const viewProfileUrl = ref("");
onMounted(() => {
  const domainMatch = homeUrl.match(/https?:\/\/([^/]+)/);
  const domain = domainMatch ? domainMatch[1] : "";
  if (homeUrl.includes("localhost:3000")) {
    viewProfileUrl.value = `http://${domain}/${getUserData.value.username}`;
  } else {
    viewProfileUrl.value = `https://${domain}/${getUserData.value.username}`;
  }
});
</script>

<template>
  <nav class="navbar bg-base-100 w-full">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost gap-0 normal-case text-2xl">
        lynk
        <p class="italic">page</p>
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <div v-if="showMenu">
        <ul class="menu menu-horizontal px-1">
          <li><a href="/">Home</a></li>
          <li><a>Analytics</a></li>
          <li><a>Theme Store</a></li>
          <li><a href="/edit/account">Account Settings</a></li>
        </ul>
      </div>
    </div>
    <div class="navbar-end">
      <div v-if="showLink">
        <a :href="viewProfileUrl" class="btn btn-circle btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class=""
          >
            <path
              d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"
              fill="#6de873"
            />
          </svg>
        </a>
      </div>
      <div class="md:hidden dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>

        <div v-if="!authenticated">
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-[12]"
          >
            <li>
              <NuxtLink
                to="/auth/signup"
                class="btn btn-sm btn-ghost mb-2 md:mb-5"
              >
                Signup
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/auth/login"
                class="btn btn-sm btn-primary ml-2 md:ml-5"
              >
                Login
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div v-else>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-[12]"
          >
            <li>
              <a
                :href="viewProfileUrl"
                class="btn btn-sm btn-ghost ml-2 md:mb-5"
                >View Page</a
              >
            </li>
            <li>
              <NuxtLink
                class="btn btn-sm btn-error ml-2 md:ml-5"
                @click="logout"
              >
                Logout
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="sm:flex sm:flex-row hidden">
        <div v-if="!authenticated">
          <NuxtLink to="/auth/signup" class="btn btn-sm btn-ghost ml-2 md:ml-5">
            Signup
          </NuxtLink>
          <NuxtLink
            to="/auth/login"
            class="btn btn-sm btn-primary ml-2 md:ml-5"
          >
            Login
          </NuxtLink>
        </div>
        <div v-else>
          <NuxtLink class="btn btn-sm btn-error ml-2 md:ml-5" @click="logout">
            Logout
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

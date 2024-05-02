<script setup lang="ts">
// import { useAuthStore } from "~/store/auth";

const verifySuccess = ref(false);
const verifyFail = ref(false);
const verifyCheck = ref(false);
const fail = ref(false);
const resent = ref(false);
const email = ref("");
// const settoken = useAuthStore().settoken;
const route = useRoute();

// set the color mode
useColorMode().preference = "dark";

// verify the user on page load
onMounted(async () => {
  const slug = route.params.id;
  // use fetch
  const response = await fetch("/api/auth/verify/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: slug }),
  });

  if (response.status === 200) {
    verifySuccess.value = true;
  } else {
    verifyCheck.value = true;
  }
});

const resendHandler = async () => {
  // const data = useAuthStore().settoken;
  const response = await fetch("/api/auth/resend/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value }),
  });
  if (response.status === 200) {
    resent.value = true;
    fail.value = false;
  } else {
    fail.value = true;
    verifyFail.value = true;
  }
};
const changeForm = () => {
  fail.value = true;
  verifyCheck.value = false;
  verifyFail.value = false;
};
</script>

<template>
  <div>
    <div class="hero min-h-screen">
      <div class="hero-content flex-col">
        <!-- alerts -->
        <div v-if="verifySuccess === true">
          <div class="alert alert-success shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Your Email has been verified</span>
            </div>
          </div>
        </div>
        <div v-if="verifyFail === true">
          <div class="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error! please check your email and try again.</span>
            </div>
          </div>
        </div>
        <!-- boxes -->
        <div v-if="fail === true">
          <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Resend Verification</h2>
              <form @submit.prevent="resendHandler()">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Email</span>
                  </label>
                  <input
                    v-model="email"
                    type="email"
                    placeholder="email"
                    class="input input-bordered"
                    required
                  />
                </div>
                <div class="card-actions justify-center mt-4">
                  <button type="submit" class="btn btn-primary">Resend</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div v-if="resent === true">
          <div class="card w-96 bg-neutral text-neutral-content">
            <div class="card-body items-center text-center">
              <h2 class="card-title">Email sent!</h2>
              <p>Please check your email for the verification link</p>
              <div class="card-actions justify-end">
                <Nuxt-link to="/" class="btn btn-primary"> Home </Nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div v-if="verifySuccess">
          <!-- button to navigate to login page -->
          <NuxtLink to="/auth/login" class="btn btn-primary"> Login </NuxtLink>
        </div>
        <div v-if="verifyCheck === true">
          <div class="card w-96 bg-neutral text-neutral-content">
            <div class="card-body items-center text-center">
              <h2 class="card-title">Verification Problem</h2>
              <p>verification link has expired or is invalid</p>
              <div class="card-actions justify-end">
                <!-- resend verification? -->
                <button class="btn btn-secondary" @click="changeForm()">
                  Resend
                </button>
                <Nuxt-link to="/" class="btn btn-primary"> Home </Nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

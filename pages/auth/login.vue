<script setup lang="ts">
const store = useAuthStore(); // use the auth store we just created

const { getAuthenticatedState } = storeToRefs(store); // make authenticated state reactive with storeToRefs
const { authenticateUser } = store; // use authenticateUser action from  auth store

// set the color mode
useColorMode().preference = "dark";

const loginFail = ref(false);

const user = ref({
  username: "",
  password: "",
});
const router = useRouter();

const login = async () => {
  // check for exception cases
  if (!user.value) {
    loginFail.value = true;
    return;
  } else if (user.value.username === "" || user.value.password === "") {
    loginFail.value = true;
    return;
  }

  await authenticateUser(user.value).then(() => {
    if (getAuthenticatedState.value === true) {
      // reload the page
      router.push("/home");
    } else {
      loginFail.value = true;
    }
  });
};

const closeAlert = () => {
  loginFail.value = false;
};
</script>
<template>
  <Header />
  <section class="bg-base-100">
    <!-- hero -->
    <div class="card min-h-screen">
      <div class="card-body lg:mx-auto md:w-[35%]">
        <div class="text-center">
          <h1 class="text-5xl font-bold">Login</h1>
          <p class="py-6">
            Don't have an account?
            <a href="/auth/signup" class="link link-primary link-hover">
              Signup
            </a>
          </p>
        </div>
        <div class="card flex-shrink-0 shadow-2xl bg-gray-800">
          <div class="card-body">
            <!-- alert -->
            <div v-if="loginFail">
              <div class="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  @click="closeAlert()"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Incorrect Username or Password </span>
              </div>
            </div>
            <!-- form -->
            <form @submit.prevent="login()">
              <!-- username -->
              <div class="form-control w-[100%]">
                <label class="label">
                  <span class="label-text">Username</span>
                </label>
                <input
                  v-model="user.username"
                  type="text"
                  placeholder="username"
                  class="input input-bordered"
                  required
                />
              </div>
              <!-- password -->
              <div class="form-control w-[100%]">
                <label class="label">
                  <span class="label-text">Password</span>
                </label>
                <input
                  v-model="user.password"
                  type="password"
                  placeholder="password"
                  class="input input-bordered"
                  required
                />
                <label class="label">
                  <a href="#" class="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>
              <div class="form-control mt-6">
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
            <!-- form end -->
          </div>
        </div>
      </div>
    </div>
    <!--Hero end -->
  </section>

  <gradient />

  <Footer />
</template>

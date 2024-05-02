<script setup lang="ts">
const store = useAuthStore(); // use the auth store we just created

const { getAuthenticatedState } = storeToRefs(store); // make authenticated state reactive with storeToRefs
const { authenticateUser } = store; // use authenticateUser action from  auth store

// set the color mode
useColorMode().preference = "dark";

const router = useRouter();

const user = ref({
  username: "",
  full_name: "",
  email: "",
  password: "",
  password2: "",
});

const sent = ref(false);
const signupFail = ref(false);
const alertMsg = ref("");
const shouldSend = ref(false);

const register = async () => {
  // check if the passwords match
  if (user.value.password !== user.value.password2) {
    alertMsg.value = "Passwords do not match";
    signupFail.value = true;
    return;
  }
  if (!user.value) {
    alertMsg.value = "Please fill all fields";
    signupFail.value = true;
    return;
  }

  if (shouldSend.value !== true) {
    alertMsg.value = "Please check your inputs";
    signupFail.value = true;
    return;
  } else {
    signupFail.value = false;
  }
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user.value),
  });
  if (response.status === 201 || response.status === 200) {
    // authenticate the user
    const newUser = {
      username: user.value.username,
      password: user.value.password,
    };
    await authenticateUser(newUser).then(() => {
      if (getAuthenticatedState.value === true) {
        router.push("/home");
      } else {
        sent.value = true;
      }
    });
  } else {
    // alert(data.value);
    alertMsg.value = response.statusText;
    signupFail.value = true;
  }
  // sent.value = true;
};

// availability check
const usernameValidMsg = ref("");
const emailValidMsg = ref("");

//checking if the username is available
watch(
  () => user.value.username,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (newVal, oldVal) => {
    // return if the new value is empty
    if (newVal === "" || newVal.length < 3) {
      usernameValidMsg.value = "";
      return;
    } else if (newVal.length > 20) {
      usernameValidMsg.value = "Username must be less than 20 characters";
    }
    // check if the username is available
    const response = await fetch("/api/auth/usernamecheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: newVal }),
    });
    const data = await response.json();
    if (response.status === 200) {
      usernameValidMsg.value = data.message;
      if (data.message === "Username is available") {
        shouldSend.value = true;
      } else {
        shouldSend.value = false;
      }
    }
  },
);

// checking if the email is available
watch(
  () => user.value.email,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (newVal, oldVal) => {
    // return if the new value is empty
    if (newVal.length > 0) {
      // checking if the text is a valid email
      // waiting for the user to stop typing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const re = /\S+@\S+\.\S+/;
      if (!re.test(newVal)) {
        emailValidMsg.value = "Please enter a valid email";
        return;
      }
    } else if (newVal === "" && newVal.length < 1) {
      emailValidMsg.value = "";
      return;
    }
    // check if the email is available
    const response = await fetch("/api/auth/emailcheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newVal }),
    });
    const data = await response.json();
    if (response.status === 200) {
      emailValidMsg.value = data.message;
      if (data.message === "Email is available.") {
        shouldSend.value = true;
      } else {
        shouldSend.value = false;
      }
    }
  },
);
</script>

<template>
  <section class="bg-base-100">
    <Header />
    <div>
      <div class="card min-h-screen">
        <div class="card-body lg:mx-auto md:w-[35%]">
          <div v-if="sent === false" class="text-center lg:text-left">
            <h1 class="text-5xl font-bold">Signup</h1>
            <p class="py-6">
              Already have an account? &nbsp;
              <a href="/auth/login" class="link link-primary link-hover">
                Login
              </a>
            </p>
          </div>

          <div class="card w-full shadow-2xl bg-gray-800">
            <!-- alert -->
            <div v-if="signupFail" class="card-body">
              <div class="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current shrink-0 h-6 w-6"
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
                <div v-if="alertMsg !== ''">
                  <span>{{ alertMsg }}</span>
                </div>
                <div v-else>
                  <span>Signup error, please check your inputs</span>
                </div>
              </div>
            </div>

            <!-- verification email sent -->
            <div v-if="sent" class="card-body">
              <h2 class="card-title">Verification Email sent!</h2>
              <p>
                Please check your email for the confirmation email to continue
              </p>
              <div class="card-actions justify-end">
                <NuxtLink to="/" class="btn">Go Home</NuxtLink>
              </div>
            </div>

            <div v-else class="card-body">
              <form @submit.prevent="register()">
                <!-- user name -->
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
                  <label class="label">
                    <span class="label-text-alt">{{ usernameValidMsg }}</span>
                  </label>
                </div>

                <!-- email form -->
                <div class="form-control w-[100%]">
                  <label class="label">
                    <span class="label-text">Email</span>
                  </label>
                  <input
                    v-model="user.email"
                    type="email"
                    placeholder="email"
                    class="input input-bordered"
                    required
                  />
                  <label class="label">
                    <span class="label-text-alt">{{ emailValidMsg }}</span>
                  </label>
                </div>

                <!-- fullname form -->
                <div class="form-control w-[100%]">
                  <label class="label">
                    <span class="label-text">Full Name</span>
                  </label>
                  <input
                    v-model="user.full_name"
                    type="text"
                    placeholder="full name"
                    class="input input-bordered"
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
                </div>

                <!-- confirm password -->
                <div class="form-control w-[100%]">
                  <label class="label">
                    <span class="label-text">Confirm Password</span>
                  </label>
                  <input
                    v-model="user.password2"
                    type="password"
                    placeholder="confirm password"
                    class="input input-bordered"
                    required
                  />
                </div>

                <div class="form-control mt-6">
                  <button
                    type="submit"
                    :class="[
                      user.username === '' ||
                      user.password === '' ||
                      user.email === '' ||
                      user.full_name === '' ||
                      user.password2 === ''
                        ? 'btn btn-disabled'
                        : 'btn btn-primary',
                    ]"
                  >
                    Signup
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <gradient />
    </div>
    <Footer />
  </section>
</template>

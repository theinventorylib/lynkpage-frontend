<script setup lang="ts">
// import { storeToRefs } from "pinia"; // import storeToRefs helper hook from pinia
// import { useAuthStore } from "../../stores/auth";
const store = useAuthStore(); // use authenticateUser action from  auth store
const { getUserData } = storeToRefs(store); // make authenticated state reactive with storeToRefs
const { updateUser } = store;
// const router = useRouter();

// set the color mode
useColorMode().preference = "dark";

// form data
const username = ref("");
const email = ref("");
const deleteUsernamecheck = ref("");

onMounted(() => {
  username.value = getUserData.value.username;
  email.value = getUserData.value.email;
});
username.value = getUserData.value.username;
email.value = getUserData.value.email;

// watching and checking for email and username availability
const usernameValidMsg = ref("");
const emailValidMsg = ref("");
const shouldSend = ref(false);
const shouldDelete = ref(false);
const sent = ref(false);
const emailSent = ref(false);

//checking if the username is available by watching change betrween the username and the user.username
watch(
  () => username.value,
  (newVal, oldVal) => {
    // return if the new value is less than 3 characters or greater than 20 characters
    if (newVal === "" || newVal.length < 3) {
      usernameValidMsg.value = "";
      return;
    } else if (newVal.length > 20) {
      usernameValidMsg.value = "Username must be less than 20 characters";
    }
    // return if oldval is not the user.username
    if (
      oldVal !== getUserData.value.username &&
      newVal === getUserData.value.username
    ) {
      usernameValidMsg.value = "";
      shouldSend.value = false;
      return;
    }
    if (newVal !== oldVal) {
      if (newVal.length >= 3 && newVal.length <= 20) {
        // check if the username is available
        fetch("/api/auth/usernamecheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: newVal }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.is_taken === false) {
              usernameValidMsg.value = "Username is available";
              shouldSend.value = true;
            } else {
              usernameValidMsg.value = "Username is not available";
              shouldSend.value = false;
            }
          });
      }
    }
  },
);
// checking if the email is available by watching change betrween the email and the user.email
watch(
  () => email.value,
  (newVal, oldVal) => {
    // return if the new value is empty
    if (newVal === "") {
      emailValidMsg.value = "";
      return;
    }
    // return if oldval is not the user.email
    if (
      oldVal !== getUserData.value.email &&
      newVal === getUserData.value.email
    ) {
      emailValidMsg.value = "";
      shouldSend.value = false;
      return;
    }
    if (newVal.length > 0) {
      // checking if the text is a valid email
      // waiting for the user to stop typing
      // new Promise((resolve) => setTimeout(resolve, 1000));
      const re = /\S+@\S+\.\S+/;
      if (!re.test(newVal)) {
        emailValidMsg.value = "Please enter a valid email";
        return;
      }
    }
    if (newVal !== oldVal) {
      // check if the email is available
      fetch("/api/auth/emailcheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newVal }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.is_taken === false) {
            emailValidMsg.value = "Email is available";
            shouldSend.value = true;
          } else {
            emailValidMsg.value = "Email is not available";
            shouldSend.value = false;
          }
        });
    }
  },
);

// checking if delete username matches the user.username
watch(
  () => deleteUsernamecheck.value,
  (newVal) => {
    if (newVal === getUserData.value.username) {
      shouldDelete.value = true;
    } else {
      shouldDelete.value = false;
    }
  },
);

// function to update the user info
const updateUserInfo = async () => {
  if (shouldSend.value === true) {
    // fix a form to send
    const formData = new FormData();
    if (
      username.value !== getUserData.value.username &&
      username.value.length > 0
    ) {
      formData.append("username", username.value);
    }
    if (email.value !== getUserData.value.email && email.value.length > 0) {
      formData.append("email", email.value);
      emailSent.value = true;
    }

    await fetch("/api/patchUser", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        sent.value = true;
        const data = await res.json();
        updateUser(data as UserInterface);
      } else {
        sent.value = false;
      }
    });
  }
};

// function to delete user
const deleteUser = async () => {
  if (shouldDelete.value === false) {
    return;
  }
  const result = await fetch(`/api/deleteUser/` + deleteUsernamecheck.value, {
    method: "DELETE",
  });

  if (result.status === 204) {
    await store.logUserOut(true);
    // await router.push("/");
  } else {
    console.log("error");
  }
};
</script>
<template>
  <div id="wrapper">
    <!-- portfolio navbar -->
    <div class="bg-base-100">
      <!-- portfolio navbar -->
      <Header show-menu show-link />
      <!-- user account settings card -->
      <div class="card-body items-center">
        <h2 class="card-title text-2xl text-center sm:py-4 md:py-2">
          Account settings
        </h2>
        <div class="md:card-body space-y-6 mt-3">
          <!-- premium status -->
          <div class="card-body md:mx-96 bg-base-300 rounded-xl">
            <h2 class="card-title text-xl">Premium status</h2>
            <p class="text-lg">
              You are currently not a
              <span class="badge badge-success">Premium</span> user.
            </p>
            <div class="items-center justify-center mx-auto">
              <button class="btn btn-primary btn-wide my-3">
                <Icon name="uil:star" size="20" />
                <span>Upgrade to premium</span>
              </button>
            </div>
          </div>

          <!-- update account -->
          <div>
            <!-- success -->
            <div v-if="sent" class="alert alert-success">
              <div v-if="sent && !emailSent">
                <span>Account info Updated!</span>
              </div>
              <div v-if="sent && emailSent">
                <span
                  >Account info Updated! please check your eamil for
                  verification</span
                >
              </div>
            </div>
            <!-- form for updating some user info -->
            <div class="md:card md:mx-96">
              <form
                action=""
                method="post"
                enctype="multipart/form-data"
                @submit.prevent="updateUserInfo()"
              >
                <!-- username -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Change username</span>
                  </label>
                  <input
                    v-model="username"
                    type="text"
                    placeholder="username"
                    class="input input-bordered"
                  />
                  <label class="label">
                    <span class="label-text-alt">{{ usernameValidMsg }}</span>
                  </label>
                </div>
                <!-- email -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Change email</span>
                  </label>
                  <input
                    v-model="email"
                    type="email"
                    placeholder="email"
                    class="input input-bordered"
                  />

                  <label class="label">
                    <span class="label-text-alt">{{ emailValidMsg }}</span>
                  </label>
                </div>

                <!-- submit button -->
                <div class="form-control">
                  <button
                    type="submit"
                    :class="{
                      'btn btn-primary': shouldSend,
                      'btn btn-disabled': !shouldSend,
                    }"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- delete accoutn button -->
          <div class="card-body md:mx-96 bg-base-300 rounded-xl">
            <h2 class="card-title text-xl">Danger zone</h2>
            <p class="text-lg">
              Once you delete your account, there is no going back. Please be
              certain. <br />
              <span class="text-red-500">This action is irreversible.</span>
            </p>
            <div class="items-center justify-center mx-auto">
              <button
                class="btn btn-error btn-wide my-3"
                onclick="deletemodal.showModal()"
              >
                <Icon name="uil:trash-alt" size="20" />
                <span>Delete account</span>
              </button>
            </div>
          </div>

          <!-- delete account modal -->
          <dialog id="deletemodal" class="modal">
            <div class="modal-box">
              <form method="dialog">
                <button
                  class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
              </form>
              <!-- ask for username and validates it before activating the delete button -->
              <p>Please enter your username to delete your account</p>
              <form action="">
                <!-- username -->
                <div class="form-control mt-3">
                  <input
                    v-model="deleteUsernamecheck"
                    type="text"
                    placeholder="username"
                    :class="{
                      'input input-bordered': !shouldDelete,
                      'input input-bordered input-success': shouldDelete,
                    }"
                  />
                </div>
                <!-- delete button -->
                <div class="form-control mt-4">
                  <button
                    type="submit"
                    @click="deleteUser()"
                    :class="{
                      'btn btn-error': shouldDelete,
                      'btn btn-disabled': !shouldDelete,
                    }"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  </div>
</template>

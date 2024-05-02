<script setup lang="ts">
import type {
  UserInterface,
  SkillInterface,
  SocialLinkItem,
} from "../../types";

const { handleCount, updateUser } = useAuthStore(); // use the auth store we just created
// const { handleCount, updateUser } = store;
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
    required: true,
  },
});

// form variables
const fullname = ref("");
const occupation = ref("");
const about = ref("");
const skills: Ref<SkillInterface[]> = ref([]);
const image = ref<File | null>(null);

// extra variables
const skillInputField = ref("");

// getting file from input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFileChange = (e: any) => {
  if (!e || !e.target || !e.target.files || !e.target.files.length) {
    // Handle error, e.g. show an error message or return
    // console.error("Invalid event object");
    return;
  }
  const files = e.target.files;
  if (!files.length || files.length > 1) {
    return;
  }
  // only image files
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(files[0].type)) {
    return;
  }
  image.value = files[0];
};

// form functions
/* ------------------------------ Add functions ----------------------------- */
const addSkill = async (event: KeyboardEvent | MouseEvent) => {
  let skill = "";
  skill = skillInputField.value.trim();
  skillInputField.value = ""; // Clear the skillInputField variable
  if (skill !== "") {
    // check if the skill.name is not already in the list
    if (!skills.value.find((item) => item.name === skill)) {
      // add the skill to the list
      // send the data
      const response = await fetch("/api/postSkill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: skill }),
      });

      if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        // update the user data
        skills.value.push(data);
        // check data
        // console.log("skill: ", data);
        // handle count
        handleCount("skillAdd");
      }
    }
  }
  // e.target.value = ''
};

/* ----------------------------- Remove function ---------------------------- */
//TODO: fix the deletion when the return from the addSkill does not include an id
const removeSkill = async (skill: SkillInterface) => {
  console.log("skill: ", skill);
  // remove the skill from the list
  // skills is a list of objects or a list of strings
  if (typeof skills.value[0] === "string") {
  }
  // const exists = skills.value.find((item) => item.name === skill.name);

  if (skills.value.find((item) => item.name === skill.name)) {
    // check the thing
    console.log("skill: ", skill);
    const response = await fetch(`/api/deleteSkill/${skill.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204 || response.status === 301) {
      // update the user data
      skills.value = skills.value.filter((item) => item.name !== skill.name);
      // handle count
      handleCount("skillDelete");
    }
  }
};

// remove social link
const removeSocialLink = async (link: SocialLinkItem) => {
  // the social link from the list of socail links
  if (props.user.social_links.find((item) => item.name === link.name)) {
    const response = await fetch(`/api/personal/deleteSocialLink/${link.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204 || response.status === 301) {
      // update the user data
      props.user.social_links = props.user.social_links.filter(
        (item) => item.name !== link.name,
      );
      // handle count
      handleCount("socialLinkDelete");
    }
  }
};

// button active (for submitting changes)
const submitActive = computed(() => {
  if (
    fullname.value !== props.user.full_name ||
    occupation.value !== props.user.occupation ||
    about.value !== props.user.about ||
    image.value !== null
  ) {
    return true;
  } else {
    return false;
  }
});

// submit changes
const submitChanges = async () => {
  // create form data
  const formData = new FormData();
  if (fullname.value !== null) {
    formData.append("full_name", fullname.value);
  }
  if (occupation.value !== null) {
    formData.append("occupation", occupation.value);
  }
  if (about.value !== null) {
    formData.append("about", about.value);
  }
  if (image.value !== null) {
    formData.append("image", image.value);
  }

  // send the data
  if (formData !== null) {
    const response = await fetch("/api/patchUser", {
      method: "POST",
      body: formData,
    });

    if (response.status === 200 || response.status === 201) {
      const data = await response.json();
      // update the user data
      updateUser(data);
      // set the editDetails to false
      props.editMode(false);
    }
  }
};

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
    }
    return url;
  }
  return "";
};

// basic component functions
onMounted(() => {
  // set the variables values
  if (
    fullname.value === "" &&
    occupation.value === "" &&
    about.value === "" &&
    skills.value.length === 0
  ) {
    fullname.value = props.user.full_name;
    occupation.value = props.user.occupation;
    about.value = props.user.about;
    skills.value = props.user.skills;
  }
});
</script>
<template>
  <div>
    <div class="card bg-base-100 mx-3 md:w-96 lg:w-96 sm:w-screen md:h-fit md:shadow-sm no-scrollbar mt-16">
      <figure class="align-top flex justify-center mb-4">
        <img :src="getImage(
          user.image
            ? user.image
            : 'http://localhost:8000/static/images/user/user_default.png',
        )
          " height="128" width="128" alt="user-image"
          class="rounded-full mx-auto absolute w-32 h-32 border-8 border-base-100 transition duration-200 transform hover:scale-110 z-[11]" />
      </figure>

      <form action="" method="POST" enctype="multipart/form-data" @submit.prevent="submitChanges()">
        <div class="card items-center text-center bg-primary pt-14 p-5">
          <!-- image -->
          <div class="form-control w-[100%]">
            <label class="label">
              <span class="label-text">image</span>
            </label>
            <input type="file" class="file-input file-input-bordered" placeholder="Change your image"
              @change="onFileChange" @keydown.enter.prevent />
          </div>
          <!-- first name -->
          <div class="form-control w-[100%]">
            <label class="label">
              <span class="label-text">Full Name</span>
            </label>
            <input v-model="fullname" type="text" placeholder="full Name" class="input input-bordered"
              @keydown.enter.prevent />
          </div>
          <!-- occupation -->
          <div class="form-control w-[100%]">
            <label class="label">
              <span class="label-text">Occupation</span>
            </label>
            <input v-model="occupation" type="text" placeholder="Occupation" class="input input-bordered"
              @keydown.enter.prevent />
          </div>
          <!-- about -->
          <div class="form-control w-[100%]">
            <label class="label">
              <span class="label-text">About</span>
            </label>
            <textarea v-model="about" type="text" placeholder="About" class="textarea textarea-md w-full"
              maxlength="90"></textarea>
          </div>
          <!-- skills button -->
          <div class="flex form-control w-fit">
            <label class="label">
              <span class="label-text">Skills</span>
            </label>
            <div class="flex flex-wrap my-1">
              <div v-for="(skill, index) in skills" :key="index" class="badge badge-accent mx-1 my-1 space-x-2">
                {{ skill.name }}
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                  role="img" class="icon" width="20px" height="20px" viewBox="0 0 24 24"
                  style="color: rgb(228, 85, 83)">
                  <path fill="currentColor"
                    d="M15.71 8.29a1 1 0 0 0-1.42 0L12 10.59l-2.29-2.3a1 1 0 0 0-1.42 1.42l2.3 2.29l-2.3 2.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l2.29-2.3l2.29 2.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42L13.41 12l2.3-2.29a1 1 0 0 0 0-1.42m3.36-3.36A10 10 0 1 0 4.93 19.07A10 10 0 1 0 19.07 4.93m-1.41 12.73A8 8 0 1 1 20 12a7.95 7.95 0 0 1-2.34 5.66">
                  </path>
                </svg>
              </div>
            </div>

            <div>
              <input v-model="skillInputField" type="text" placeholder="Skills" :class="[
          premiumUserByCount(user, user.skill_count)
            ? 'input input-bordered w-48'
            : 'input input-bordered input-disabled w-48',
        ]" @keydown.enter.prevent="addSkill" :disabled="!premiumUserByCount(user, user.skill_count)" />
              <button type="button" :class="[
          premiumUserByCount(user, user.skill_count)
            ? 'btn btn-success btn-sm ml-2'
            : 'btn btn-disabled btn-sm ml-2',
        ]" @click="addSkill">
                Add
              </button>
            </div>
          </div>
          <!-- social links -->
          <div v-if="user.social_links.length > 0" class="form-control w-[100%]">
            <label class="label">
              <span class="label-text">Remove Social Links</span>
            </label>
            <div class="flex flex-wrap my-1">
              <div v-for="(link, index) in user.social_links" :key="index"
                class="badge badge-success mx-1 my-1 space-x-2">
                <p>
                  {{ link.name }}
                </p>
                <Icon name="uil:times-circle" size="20" color="#e45553" @click="removeSocialLink(link)" />
              </div>
            </div>
          </div>
        </div>

        <!-- save buttons -->
        <div class="md:pt-36 lg:pt-36 md:justify-center md:content-center">
          <!-- mobile  -->
          <div class="flex btm-nav z-30 md:hidden lg:hidden px-2">
            <button :type="submitActive ? 'submit' : 'button'" :class="[
          submitActive
            ? 'btn w-full btn-success'
            : 'btn w-full btn-disabled',
        ]">
              Save Changes
            </button>
          </div>
          <!-- medium and large screens -->
          <div :class="[
          submitActive
            ? 'hidden md:btm-nav md:w-96 lg:w-96 md:z-30'
            : 'hidden',
        ]">
            <button :type="submitActive ? 'submit' : 'button'"
              :class="[submitActive ? 'btn w-full btn-success' : 'hidden']">
              Save Changes
            </button>
          </div>
        </div>
        <!-- save buttons end -->
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  CategoryInterface,
  DisplayItem,
  CustomItem,
  SocialLinkItem,
} from "../../types";

const store = useAuthStore(); // use the auth store we just created
// store.$hydrate(); // hydrate the store
const { getUserData } = storeToRefs(store); // make authenticated state reactive with storeToRefs
const { handleCount, updateUser } = store;

// colormode
useColorMode().preference = getUserData.value.theme_name;

// apiurl
const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

const route = useRoute();
const router = useRouter();

// loading handler
const loadingVar = ref(true);

const personalCategories: Ref<CategoryInterface[]> = ref([]);
const dataPersonal: Ref<CustomItem[]> = ref([]);
const personalUData: Ref<DisplayItem[]> = ref([]);
const editDetails = ref(false);

// extra functions
// function to switch edit mode
const switchEditMode = () => {
  editDetails.value = !editDetails.value;
  // set the route hash
  if (editDetails.value) {
    router.replace({ hash: "#profile" });
  } else {
    router.replace({ hash: "" });
  }
};

//emit functions
// function for managing the data in the categories array (add, edit, delete)
// receiving the category name and the data
// and the action to be done
const manageData = (category: string, data: CustomItem, action: string) => {
  // Find the category object in personalUData based on the provided category name
  const categoryObj = personalUData.value.find(
    (item: DisplayItem) => item.name === category,
  );

  if (!categoryObj) {
    // If the specified category does not exist, you may handle this case accordingly
    // console.log(`Category "${category}" does not exist.`);
    return;
  }

  // Create a copy of the data array to avoid mutating the original array
  const catData = [...categoryObj.data];

  if (action === "add") {
    // handle count
    handleCount("itemAdd");
    catData.push(data);
  } else if (action === "edit") {
    // Find the index of the data with the same id in the category
    const dataIndex = catData.findIndex((item) => item.id === data.id);
    // Ensure dataIndex is valid
    if (dataIndex !== -1) {
      // Edit the data
      catData[dataIndex] = { ...catData[dataIndex], ...data };
    }
  } else if (action === "delete") {
    // Find the index of the data with the same id in the category
    const dataIndex = catData.findIndex((item) => item.id === data.id);
    // Ensure dataIndex is valid
    if (dataIndex !== -1) {
      // handle count
      handleCount("itemDelete");
      // Delete the data
      catData.splice(dataIndex, 1);
    }
  }

  // Update the data array in the specific category object
  categoryObj.data = catData;
};

// edit or delete
const manageCategory = (newData: DisplayItem, action: string) => {
  // Create a copy of personalUData to avoid mutating the original array
  const userData = [...personalUData.value];

  if (action === "add") {
    // update the user category_count data in the state
    handleCount("categoryAdd");
    // add new data to personalCategories
    personalCategories.value.push(newData);
    // add "data: []" to the newData and push
    newData.data = [];
    userData.push(newData);
  } else if (action === "edit") {
    // Find the index of the category to edit
    const dataIndex = userData.findIndex((item) => item.id === newData.id);
    // Ensure dataIndex is valid
    if (dataIndex !== -1) {
      // Update the category name
      userData[dataIndex].name = newData.name;
    }
  } else if (action === "delete") {
    // Find the index of the category to delete
    const dataIndex = userData.findIndex((item) => item.id === newData.id);
    // Ensure dataIndex is valid
    if (dataIndex !== -1) {
      handleCount("categoryDelete");
      // Delete the category
      userData.splice(dataIndex, 1);
    }
  }

  // Update the personalUData array
  personalUData.value = userData;
};

// manage user.social_links
const manageSocialLink = (data: SocialLinkItem, action: string) => {
  const userData = { ...getUserData.value };

  if (action === "add") {
    // add new data to user.social_links
    userData.social_links.push(data);
    // handle count
    handleCount("socialLinkAdd");
  }
  // Update the user.social_links array
  updateUser(userData);
};

// get the personal data and categry with fetch
onMounted(async () => {
  // get the personal data and categories
  const personalDataResponse = await fetch("/api/personal/getPersonalData", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const personalCategoriesResponse = await fetch(
    "/api/personal/getPersonalCategories",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (personalDataResponse.ok) {
    dataPersonal.value = await personalDataResponse.json();
  }

  if (personalCategoriesResponse.ok) {
    personalCategories.value = await personalCategoriesResponse.json();
    loadingVar.value = false;
  }

  // data creation
  if (dataPersonal.value !== null && personalCategories.value !== null) {
    personalUData.value = personalCategories.value.map(
      (item: CategoryInterface) => {
        return {
          ...item,
          data: dataPersonal.value.filter(
            (data: CustomItem) => data.category === item.name,
          ),
        };
      },
    );
    // update loading value
    loadingVar.value = false;
  }

  // image dynamics
  // switching based on homeUrl
  if (getUserData.value.image !== null) {
    if (homeUrl.includes("http://localhost:3000")) {
      // getUserData.value.image = getUserData.value.image.replace(
      //   "django:8000",
      //   "localhost:8000",
      // );
    } else {
      const domainMatch = homeUrl.match(/https?:\/\/([^/]+)\//);
      const domain = domainMatch ? domainMatch[1] : "";
      const newImage = getUserData.value.image.match(/(\/media\/.*)/);
      getUserData.value.image = `https://app.${domain}${newImage?.[1]}`;
      //user.value.image  = homeUrl + user.value.image.replace("/media/", "media/");
    }
  }

  // enter edit mode with route hash
  if (route.hash === "#profile" && editDetails.value === false) {
    editDetails.value = true;
  } else if (route.hash === "" && editDetails.value === true) {
    editDetails.value = false;
  }
});
</script>
<template>
  <div data-act-class="!outline-base-content">
    <!-- portfolio -->
    <div class="bg-base-100 min-h-screen">
      <!-- portfolio navbar -->
      <Header show-menu show-link />
      <!-- portfolio navbar end -->
      <div v-if="loadingVar">
        <div class="hero min-h-screen">
          <div class="hero-content flex-col">
            <span class="loading loading-infinity loading-lg"></span>
          </div>
        </div>
      </div>
      <!-- portfolio -->
      <section v-if="!loadingVar">
        <div
          class="card md:card-side bg-base-100 min-h-screen md:h-screen overflow-hidden no-scrollbar"
        >
          <div class="md:overflow-y-auto lg:overflow-y-auto no-scrollbar">
            <!-- user details -->
            <section v-if="editDetails === false">
              <!-- user view card -->
              <UserCardEdit :user="getUserData" :editMode="switchEditMode" />
            </section>
            <!-- user details end -->

            <!-- user details edit -->
            <section
              v-if="editDetails === true"
              id="profile"
              class="transition"
            >
              <!-- details navbar -->
              <section>
                <!-- <div class="navbar bg-base-100 w-full"> -->
                <div class="flex-1">
                  <button
                    class="btn btn-ghost normal-case text-xl justify-end"
                    @click="switchEditMode()"
                  >
                    <!-- proper aligned left chevron svg -->
                    <Icon name="uil:multiply" size="38" />
                  </button>
                </div>
                <!-- </div> -->
              </section>
              <!-- details navbar end -->
              <!-- user details -->
              <LazyUserCardEditDetails
                :user="getUserData"
                :editMode="switchEditMode"
              />
              <!-- user details end -->
            </section>
            <!-- user details edit end -->
          </div>

          <div class="hidden md:divider mb-0 lg:divider-horizontal"></div>

          <!-- user data -->
          <div
            class="card-body w-screen md:w-96 md:overflow-y-auto no-scrollbar"
          >
            <!-- card -->
            <!-- display content(component) based on the current tab -->
            <LazyShowcaseEdit
              id="showcase"
              :projects="personalUData"
              :categories="personalCategories"
              :manage-social-link="manageSocialLink"
              :manage-data="manageData"
              :manage-category="manageCategory"
            />

            <!-- card end -->
          </div>
          <!-- user data end -->
        </div>
      </section>
      <!-- portfolio end -->
    </div>
    <!-- portfolio end -->
  </div>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar {
  overflow: -moz-scrollbars-none;
}
.no-scrollbar {
  -webkit-scrollbar: none;
}
</style>

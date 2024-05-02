<script setup lang="ts">
import type { CategoryInterface, DisplayItem, CustomItem } from "../../types";

const { getUserData } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

// api
const config = useRuntimeConfig().public;
const homeUrl = config.homeUrl;

// props : a list of projects grouped by category
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  projects: {
    type: Array as PropType<DisplayItem[]>,
    required: true,
  },
  // vue require default value for props warning
  // eslint-disable-next-line vue/require-default-prop
  categories: {
    type: Array as PropType<CategoryInterface[]>,
    required: false,
  },
  // for managements
  // eslint-disable-next-line vue/require-default-prop
  manageSocialLink: {
    type: Function,
    required: true,
  },

  manageData: {
    type: Function,
    required: true,
  },

  manageCategory: {
    type: Function,
    required: true,
  },
});

// computation
const primaryOptions = ref(false);
const personalData = ref(false);
const personalDataPatch = ref(false);
const categoryBool = ref(false);
const categoryPatchBool = ref(false);
const socialLinkBool = ref(false);
const embedLinkBool = ref(false);

// data for form
//!!!! NOTE FIELDS ARE REUSED FOR PATCHING AND POSTING !!!!//
const name = ref("");
const title = ref("");
const image = ref<File | null>(null);
const link = ref("");
const category = ref("");
const patchId = ref();
const embededItem = ref(false);

/* ----------------------------- Modal Functions ---------------------------- */
const toggleModal = () => {
  primaryOptions.value = !primaryOptions.value;
};

// open category modal
const openCategory = () => {
  primaryOptions.value = false;
  categoryBool.value = !categoryBool.value;
};

// open category patch modal
const openCategoryPatch = (patchname: string, id: number) => {
  patchId.value = id;
  name.value = patchname;
  primaryOptions.value = false;
  categoryPatchBool.value = !categoryPatchBool.value;
};

// open data modal
const addItem = () => {
  primaryOptions.value = false;
  personalData.value = !personalData.value;
};

// Add link modal
const addEmbededLink = () => {
  primaryOptions.value = false;
  embedLinkBool.value = !embedLinkBool.value;
};

// Add social link modal
const addSocialLink = () => {
  primaryOptions.value = false;
  socialLinkBool.value = !socialLinkBool.value;
};

// open data patch modal
const openDataPatch = (
  id: number,
  patchtitle: string,
  patchlink: string,
  patchcategory: string,
) => {
  patchId.value = id;
  title.value = patchtitle;
  image.value = null;
  link.value = patchlink;
  category.value = patchcategory;
  primaryOptions.value = false;
  personalDataPatch.value = !personalDataPatch.value;
};

// dynamic form handling
const extraFields = ref({
  title: false,
  image: false,
  category: false,
});

const closeModal = () => {
  closeBtn();
  // change the class of the modal to close it
  const modal = document.getElementById("my-modal-showcase");
  modal?.click();
};

// close modal from btn
const closeBtn = () => {
  clearFormData();
  primaryOptions.value = false;
  categoryBool.value = false;
  personalData.value = false;
  personalDataPatch.value = false;
  categoryPatchBool.value = false;
  socialLinkBool.value = false;
  embedLinkBool.value = false;
  // dynamic form handling
  extraFields.value = {
    title: false,
    image: false,
    category: false,
  };
};

/* ----------------------------- Extra Functions ---------------------------- */
const clearFormData = () => {
  patchId.value = null;
  name.value = "";
  title.value = "";
  image.value = null;
  link.value = "";
  category.value = "";
};

// getting file from input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFileChange = (e: any) => {
  if (!e || !e.target || !e.target.files || !e.target.files.length) {
    // Handle error, e.g. show an error message or return
    console.error("Invalid event object");
    return;
  }
  const files = e.target.files;
  if (!files.length || files.length > 1) {
    return;
  }
  // only image files
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(files[0].type)) {
    return;
  }
  image.value = files[0];
};

/* ----------------------------- Post functions ----------------------------- */
// method for posting data
const postData = async () => {
  // form data
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("link", link.value);
  if (image.value) {
    formData.append("image", image.value, image.value.name);
  }
  if (embededItem.value) {
    formData.append("embeded_item", "1");
  }
  formData.append("category", category.value);

  // use fetch
  const res = await fetch("/api/personal/postPersonalData", {
    method: "POST",
    body: formData,
  });
  // if the response is ok or 201, add the data to the categories array
  if (res.status === 200 || res.status === 201) {
    // get the data
    const data = await res.json();
    props.manageData(category.value, data, "add");
  }
  // close the modal
  closeModal();
};

const postCategory = async () => {
  // use fetch
  const res = await fetch("/api/personal/postPersonalCategory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value,
      //user: user.value.id,
    }),
  });
  if (res.status === 200 || res.status === 201) {
    // get the data
    const data = await res.json();
    props.manageCategory(data, "add");
  }
  // close the modal
  closeModal();
};

// create social link
const postSocialLink = async () => {
  const response = await fetch("/api/personal/postCreateSocialLink", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value.replace(/\s+/g, "-").toLowerCase(),
      link: link.value,
      display: true,
    }),
  });

  if (response.status === 200 || response.status === 201) {
    const data = await response.json();
    console.log(data);
    // add the new category to the personalCategories array
    props.manageSocialLink(data, "add");
    // close the modal
    closeModal();
  }
};

/* ----------------------------- Patch Functions ---------------------------- */
// method for patching data
const patchData = async (id: number) => {
  // form data
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("link", link.value);
  if (image.value) {
    formData.append("image", image.value, image.value.name);
  }
  formData.append("category", category.value);

  // use fetch
  const res = await fetch(`/api/personal/patchPersonalData/${id}`, {
    method: "POST",
    body: formData,
  });
  // if the response is ok or 201, add the data to the categories array
  if (res.status === 200 || res.status === 201) {
    // get the data
    const data = await res.json();
    props.manageData(category.value, data, "edit");
  }
  // close the modal
  closeModal();
};

const patchCategory = async (id: number) => {
  // use fetch
  const res = await fetch(`/api/personal/patchPersonalCategory/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value,
      //user: user.value.id,
    }),
  });
  if (res.status === 200 || res.status === 201) {
    // get the data
    const data = await res.json();
    // using id because of the change in the category name
    props.manageCategory(data, "edit");
  }
  // close the modal
  closeModal();
};

/* ----------------------------- Delete Functions --------------------------- */
// method for deleting data
const deleteData = async (item: CustomItem, category: string) => {
  // use fetch
  const res = await fetch(`/api/personal/deletePersonalData/${item.id}`, {
    method: "DELETE",
  });

  // if the response is ok or 201, add the data to the categories array
  if (res.status === 204 || 301) {
    // get the data
    props.manageData(category, item, "delete");
  }
};

const deleteCategory = async (category: DisplayItem) => {
  // use fetch
  const res = await fetch(
    `/api/personal/deletePersonalCategory/${category.id}`,
    {
      method: "DELETE",
    },
  );

  // if the response is ok or 201, add the data to the categories array
  if (res.status === 204 || res.status === 301) {
    props.manageCategory(category, "delete");
  }
};

// a watch that takes the image url as an argument and returns the image
const getImage = (url: string) => {
  if (url) {
    // check image url if it is a local image or a image
    if (homeUrl.includes("http://localhost:3000")) {
      //   url = url.replace("django:8000", "localhost:8000");
    } else {
      const domainMatch = homeUrl.match(/https?:\/\/([^/]+)\//);
      const domain = domainMatch ? domainMatch[1] : "";
      const newImage = url.match(/(\/media\/.*)/);
      url = `https://app.${domain}${newImage?.[1]}`;
      //user.value.image  = homeUrl + user.value.image.replace("/media/", "media/");
    }
    return url;
  }
  return "";
};
</script>
<template>
  <div>
    <!-- button to open modal -->
    <label for="my-modal-showcase" class="btn bg-secondary w-full mx-auto my-3" @click="toggleModal()">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
        class="icon" width="20px" height="20px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2">
        </path>
      </svg>
      Add
    </label>

    <!-- showcasing content -->
    <div v-for="(cat, index) in projects" :key="index">
      <!-- cards -->
      <h2 class="font-bold text-2xl text-center mx-4 my-5">
        {{ cat.name }}
        <button class="btn btn-xs btn-circle btn-ghost mx-1" @click="deleteCategory(cat)">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
            role="img" class="icon" width="25px" height="25px" viewBox="0 0 24 24" style="color: rgb(228, 85, 83)">
            <path fill="currentColor"
              d="M10 18a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1M20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2M10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Zm-3-1a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1">
            </path>
          </svg>
        </button>
        <label for="my-modal-showcase" class="btn btn-xs btn-circle btn-ghost mx-2"
          @click="openCategoryPatch(cat.name, cat.id)">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
            role="img" class="icon" width="25px" height="25px" viewBox="0 0 24 24" style="color: rgb(29, 149, 117)">
            <path fill="currentColor"
              d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-.71-.29a1 1 0 0 0-.71.29l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8a1.19 1.19 0 0 0 .22-.33a1 1 0 0 0 0-.24a.7.7 0 0 0 0-.14ZM6.83 20H4v-2.83l9.93-9.93l2.83 2.83ZM18.17 8.66l-2.83-2.83l1.42-1.41l2.82 2.82Z">
            </path>
          </svg>
        </label>
      </h2>
      <div class="grid flex-row flex-wrap gap-4 md:grid-flow-row-dense md:grid-cols-3 md:auto-rows-min">
        <span v-for="(item, index) in cat.data" :key="index" :class="[
      item.image
        ? 'card card-compact bg-primary shadow-xl h-min justify-center content-center items-center'
        : item.embeded_item
          ? 'card card-compact bg-primary shadow-xl h-min justify-center content-center items-center'
          : 'card card-compact bg-primary shadow-xl h-min justify-center content-center items-center',
    ]">
          <!-- should render if embeded_item is true -->
          <figure v-if="item.embeded_item" class="w-full h-content">
            <iframe :src="embededLink(item.link)" frameborder="0" allowfullscreen class="w-full z-0"
              style="object-fit: cover"></iframe>
          </figure>
          <!-- Should only render when there is an image -->
          <figure v-else :class="[item.image ? 'h-40 ' : 'hidden']">
            <img :src="getImage(item.image)" alt="item image" :class="[item.image ? ' h-content' : 'hidden']" />
          </figure>
          <!-- should only render when there is a title -->
          <div :class="[
      item.image && item.title
        ? 'card-body justify-center items-center text-center content-center text-ellipsis overflow-hidden'
        : item.title
          ? 'card-body justify-center items-center text-center content-center overflow-hidden'
          : 'card-body',
    ]">
            <h2 class="card-title">
              {{ item.title }}
            </h2>
            <div class="flex-row space-x-2">
              <label for="my-modal-showcase" class="badge badge-success z-2" @click="
      openDataPatch(item.id, item.title, item.link, item.category)
      ">
                edit
              </label>
              <button class="badge badge-error z-2" @click="deleteData(item, item.category)">
                delete
              </button>
            </div>
          </div>
        </span>
      </div>
      <!-- card end -->
    </div>
    <!-- showcasing content end -->

    <!-- creation modal -->
    <input id="my-modal-showcase" type="checkbox" class="modal-toggle" />
    <div for="my-model-showcase" class="modal modal-bottom sm:modal-middle cursor-pointer">
      <div class="modal-box" for="">
        <label for="my-modal-showcase" class="btn btn-sm btn-circle absolute right-2 top-2"
          @click="closeBtn()">✕</label>
        <!-- Displaying options for the modal -->
        <section v-if="primaryOptions === true" class="transition">
          <h3 class="font-bold text-lg py-3">Add New</h3>
          <div class="card flex-shrink-0 w-full gap-2">
            <!-- rows of buttons -->
            <div class="card-body grid grid-cols-2 gap-2">
              <label for="my-modal-showcase" @click="openCategory()" :class="[
      premiumUserByCount(getUserData, getUserData.category_count)
        ? 'swap swap-active btn btn-primary btn-sm btn-block'
        : 'swap btn-error btn-sm btn-block',
    ]">
                <p class="swap-on">Category</p>
                <p class="swap-off">
                  <Icon name="uil:star" size="20" />
                  Premium
                </p>
              </label>
              <label for="my-modal-showcase" @click="addItem()" :class="[
      premiumUserByCount(getUserData, getUserData.item_count)
        ? 'swap swap-active btn btn-primary btn-sm btn-block'
        : 'swap btn btn-error btn-sm btn-block',
    ]">
                <p class="swap-on">Link Item</p>
                <p class="swap-off">
                  <Icon name="uil:star" size="20" />
                  Premium
                </p>
              </label>
              <label for="my-modal-showcase" :class="[
      premiumUserByCount(getUserData, getUserData.item_count)
        ? 'swap swap-active btn btn-primary btn-sm btn-block'
        : 'swap btn btn-error btn-sm btn-block',
    ]" @click="addEmbededLink()">
                <p class="swap-on">Youtube Embed</p>
                <p class="swap-off">
                  <Icon name="uil:star" size="20" />
                  Premium
                </p>
              </label>
              <label for="my-modal-showcase" :class="[
      premiumUserByCount(getUserData, getUserData.social_link_count)
        ? 'swap swap-active btn btn-primary btn-sm btn-block'
        : 'swap btn btn-error btn-sm btn-block',
    ]" @click="addSocialLink()">
                <p class="swap-on">Social Link</p>
                <p class="swap-off">
                  <Icon name="uil:star" size="20" />
                  Premium
                </p>
              </label>
            </div>
          </div>
        </section>
        <!-- if/else bool to triger the form component -->
        <!-- category Addition -->
        <section v-if="categoryBool === true" class="transition">
          <h3 class="font-bold text-lg py-3">Create Category</h3>
          <div class="card flex-shrink-0 w-full bg-base-100">
            <div class="card-body">
              <form action="" method="post" @submit.prevent="postCategory()">
                <!-- name -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Category Name</span>
                  </label>
                  <input v-model="name" type="text" placeholder="name" class="input input-bordered" />
                </div>
                <!-- submit button -->
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <!-- data addition -->
        <section v-if="personalData === true" class="transition">
          <h3 class="font-bold text-lg py-3">Add New</h3>
          <div class="card flex-shrink-0 w-full bg-base-100">
            <form action="" method="post" enctype="multipart/form-data" @submit.prevent="postData()">
              <!-- link -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">link</span>
                </label>
                <input v-model="link" type="text" placeholder="URL" class="input input-bordered" @keydown.enter.prevent
                  required />
              </div>
              <!-- category -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Category</span>
                </label>
                <select v-model="category" class="select select-bordered">
                  <option disabled selected>Pick one</option>
                  <option v-for="(cat, index) in categories" :key="index">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <!-- title -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Title</span>
                </label>
                <input v-model="title" type="text" placeholder="title" class="input input-bordered"
                  @keydown.enter.prevent />
              </div>
              <!-- image -->
              <div v-if="extraFields.image" class="form-control">
                <label class="label">
                  <span class="label-text">image</span>
                </label>
                <input type="file" class="file-input file-input-bordered" @change="onFileChange"
                  @keydown.enter.prevent />
                <div class="label">
                  <button class="label-text-alt btn btn-xs btn-error" @click="extraFields.image = !extraFields.image">
                    Remove
                  </button>
                </div>
              </div>

              <h3 class="font-bold text-lg py-3 mt-4">Add an ...</h3>
              <!-- extra options -->
              <div class="shadow-none m-2 grid grid-cols-2 gap-2">
                <button type="button" @click="extraFields.image = !extraFields.image"
                  :class="extraFields.image ? 'hidden' : 'btn btn-sm btn-block'">
                  image
                </button>
                <!-- <button type="button" class="btn btn-sm btn-block">icon</button> -->
              </div>
              <!-- submit button -->
              <div class="form-control mt-6">
                <button type="submit" class="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </section>

        <!-- link addition -->
        <section v-if="embedLinkBool === true" class="transition">
          <!-- space for division -->
          <div class="card flex-shrink-0 w-full bg-base-100 mt-4">
            <form action="" method="post" enctype="multipart/form-data" @submit.prevent="postData()">
              <!-- link -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">link</span>
                </label>
                <input v-model="link" type="text" placeholder="URL" class="input input-bordered" @keydown.enter.prevent
                  required />
              </div>
              <!-- category -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Category</span>
                </label>
                <select v-model="category" class="select select-bordered">
                  <option disabled selected>Pick one</option>
                  <option v-for="(cat, index) in categories" :key="index">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <!-- title -->
              <div v-if="extraFields.title" class="form-control">
                <label class="label">
                  <span class="label-text">Title</span>
                </label>
                <input v-model="title" type="text" placeholder="title" class="input input-bordered"
                  @keydown.enter.prevent />
                <div class="label">
                  <button class="label-text-alt btn btn-xs btn-error" @click="extraFields.title = !extraFields.title">
                    Remove
                  </button>
                </div>
              </div>

              <!-- embed hidden -->
              <input type="hidden" name="embeded_item" :value="(embededItem = true)" />

              <h3 class="font-bold text-lg py-3 mt-4">Add a ...</h3>
              <!-- extra options -->
              <div class="shadow-none m-2 grid grid-cols-2 gap-2">
                <button type="button" @click="extraFields.title = !extraFields.title"
                  :class="extraFields.title ? 'hidden' : 'btn btn-sm btn-block'">
                  title
                </button>
              </div>
              <!-- submit button -->
              <div class="form-control mt-6">
                <button type="submit" class="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </section>

        <!-- social link addition -->
        <section v-if="socialLinkBool === true" class="transition">
          <div class="card flex-shrink-0 w-full shadow-2xl bg-base-100 mt-4">
            <div class="card-body">
              <form action="" method="post" @submit.prevent="postSocialLink()">
                <h2 class="card-title">Create Category</h2>
                <!-- name -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Social Link Name</span>
                  </label>
                  <input v-model="name" type="text" placeholder="name" class="input input-bordered" required />
                </div>

                <!-- link -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Social link</span>
                  </label>
                  <input v-model="link" type="text" placeholder="link" class="input input-bordered" required />
                </div>

                <!-- submit button -->
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <!-- category patching -->
        <section v-if="categoryPatchBool === true" class="transition">
          <h3 class="font-bold text-lg py-3">Edit Category</h3>
          <div class="card flex-shrink-0 w-full bg-base-100">
            <div class="card-body">
              <form action="" method="post" @submit.prevent="patchCategory(patchId)">
                <!-- name -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Category Name</span>
                  </label>
                  <input v-model="name" type="text" placeholder="name" class="input input-bordered" />
                </div>
                <!-- submit button -->
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">Update</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <!-- data patching -->
        <section v-if="personalDataPatch === true" class="transition">
          <div class="card flex-shrink-0 w-full bg-base-100">
            <form action="" method="post" enctype="multipart/form-data" @submit.prevent="patchData(patchId)">
              <!-- category -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Category</span>
                </label>
                <select v-model="category" class="select select-bordered">
                  <option disabled selected>Pick one</option>
                  <option v-for="(cat, index) in categories" :key="index">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <!-- title -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Title</span>
                </label>
                <input v-model="title" type="text" placeholder="title" class="input input-bordered" />
              </div>
              <!-- image -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">image</span>
                </label>
                <input type="file" class="file-input file-input-bordered" @change="onFileChange" />
              </div>
              <!-- link -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">link</span>
                </label>
                <input v-model="link" type="text" placeholder="link" class="input input-bordered" />
              </div>
              <!-- submit button -->
              <div class="form-control mt-6">
                <button type="submit" class="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
    <!-- creation modal end -->
  </div>
</template>

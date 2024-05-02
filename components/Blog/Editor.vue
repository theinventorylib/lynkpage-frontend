<script setup lang="ts">
const emit = defineEmits(["update-content"]);

const props = defineProps({
  content: {
    type: String,
    default: "",
    required: false,
  },
});
// editable is an html element
// const title = ref("");
// editable is a html element
const editable: HTMLElement | any = ref(null);
const showMenu = ref(false);
const blockFormatted = ref(false);

const updateBlog = (event: any) => {
  editable.value = event.target.innerHTML;
  emit("update-content", editable.value);
};

// for the slash key anti-pattern
const onWrapperKeypress = (event: KeyboardEvent) => {
  const slashKey = event.key === "/";
  if (slashKey) {
    showMenu.value = true;
  } else {
    showMenu.value = false;
  }
};

const onKeypress = (event: KeyboardEvent) => {
  // const range = selection?.getRangeAt(0);
  // prevent default behaviour if it's a enter key
  if (event.key === "Enter") {
    // play out the event then run the  if block

    if (blockFormatted.value) {
      // play out the event

      // format the block after teh event has played out
      // Optimized delay using setTimeout
      setTimeout(() => {
        if (blockFormatted.value) {
          document.execCommand("formatBlock", false, "p");
          blockFormatted.value = false;
        }
      }, 10); // Adjust delay as needed
    }
  }
  // backspace fallback to div fix
  if (event.key === "Backspace" && editable.value === "<div><br></div>") {
    document.execCommand("formatBlock", false, "p");
  }
  // do somethig here
};

const insertImage = () => {
  const url = prompt("Enter image URL:");
  if (url) {
    document.execCommand("insertImage", false, url);
  }
};

const createElement = (tagName: string) => {
  // insert the block
  document.execCommand("formatBlock", false, tagName);
  // the "/" from the wrapper still lingers
  if (tagName === "img") {
    insertImage();
  }

  // fallback to p to avoid divs
  blockFormatted.value = true; // not working
};

// onMounted
onMounted(() => {
  editable.value = props.content;
});
</script>
<template>
  <div class="content-center items-center px-[10%] md:px-[30%] lg:px-[20%]">
    <div class="mx-auto container mt-5">
      <!-- blog content -->
      <div id="wrapper" @keydown="onWrapperKeypress" ref="wrapper">
        <input
          id="post-title"
          placeholder="Title"
          class="w-full bg-transparent"
        />
        <hr />
        <br />
        <div
          contenteditable
          @input="updateBlog"
          @keypress="onKeypress"
          ref="editable"
          id="blog-content"
        >
          <div>
            <p>What's on your mind?</p>
          </div>
        </div>
      </div>
      <!-- blog content ends -->
      <!-- blog content options -->
      <div v-if="showMenu" class="menu">
        <!-- Menu items for DaisyUI -->
        <!-- Example: -->
        <button class="btn btn-primary" @click="createElement('h2')">
          Insert H2
        </button>
        <button class="btn btn-primary" @click="createElement('h3')">
          Insert H3
        </button>
        <button class="btn btn-primary" @click="insertImage">
          Insert Image
        </button>
        <button class="btn btn-primary" @click="createElement('blockquote')">
          Insert Quote
        </button>
        <!-- Add more buttons for other elements as needed -->
      </div>
      <!-- blog content options end -->
    </div>
  </div>
</template>
<style>
#blog-content {
  font-size: 1.3rem;
  font-weight: 400;
  border: none;
  outline: none;
}
#blog-content h1 {
  font-size: 3rem;
  font-weight: 700;
  border: none;
  outline: none;
}
#post-title {
  font-size: 3rem;
  font-weight: 700;
  border: none;
  outline: none;
}
#blog-content h2 {
  font-size: 2rem;
  font-weight: 700;
  border: none;
  outline: none;
}
#blog-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  border: none;
  outline: none;
}
</style>

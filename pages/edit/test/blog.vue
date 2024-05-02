<script setup lang="ts">
import { sanitize } from "isomorphic-dompurify";

const content: ref<string> = ref("");

const updateContent = (newContent: string) => {
  content.value = newContent;
};

const saveContent = () => {
  const htmlContent = content.value;
  const sanitizedContent = sanitize(htmlContent);
  // Remove attributes starting with data-v-
  const filteredContent = sanitizedContent.replace(
    /(\s*)data-v-\w+="[^"]*"/g,
    "",
  );
  console.log(filteredContent);
  // Implement logic to save the sanitized content (e.g., to a database)
};
</script>

<template>
  <div>
    <BlogEditor :content="content" @update-content="updateContent" />
    <button @click="saveContent">Save</button>
  </div>
</template>
<style>
/* remove the border from the editable div */
[contenteditable] {
  border: none;
  outline: none;
}
/* title  */
#post-title {
  font-size: 3rem;
  font-weight: 700;
  border: none;
  outline: none;
}
/* content */
#post-content {
  font-size: 1.3rem;
  font-weight: 400;
  border: none;
  outline: none;
}
</style>

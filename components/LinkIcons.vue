<script setup lang="ts">
import type { LinkInterface } from "../types";
// passing the selected social icons
const props = defineProps({
  // filter the social icons and show only the ones with display: true
  links: {
    type: Array as PropType<LinkInterface[]>,
    default: [],
    required: true,
  },
});

const finalLinks = computed(() => {
  return props.links.filter((link: LinkInterface) => link.display === true);
});
</script>
<template>
  <div>
    <ClientOnly>
      <div class="flex flex-wrap justify-center mx-2 space-x-2">
        <div v-for="(lin, index) in finalLinks" :key="index">
          <a :href="lin.link">
            <Icon :name="'uil:' + lin.name" size="35" />
          </a>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

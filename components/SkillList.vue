<script setup lang="ts">
import type { SkillInterface } from "../types";
// passing the selected social icons
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  skills: {
    type: Array as PropType<SkillInterface[]>,
    required: true,
  },
});

// const helper: string = "uil"
</script>

<template>
  <div>
    <ClientOnly>
      <div class="flex flex-row flex-wrap justify-center mx-2 space-x-2 my-2">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="badge badge-accent my-1"
        >
          {{ skill.name }}
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

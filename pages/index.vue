<script setup lang="ts">
const possibleUsername = ref("");

// set the color mode
useColorMode().preference = "dark";

// generate a random username
const generateUsername = () => {
  const adjectives = ["Happy", "Sunny", "Lucky", "Clever", "Gentle", "Vibrant"];
  const nouns = ["Bear", "Star", "Moon", "Cloud", "Wave", "River"];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}`;
};

// set the possible username every 2 seconds
onMounted(() => {
  setInterval(() => {
    possibleUsername.value = generateUsername();
  }, 2000);
});

// before destroyed, clear interval
onBeforeUnmount(() => {
  clearInterval(possibleUsername.value);
});
</script>
<template>
  <div id="wrapper">
    <Header />

    <!-- portfolio hero -->
    <div class="hero min-h-screen bg-base-800">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <!-- <img
          src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
          class="max-w-md rounded-lg shadow-2xl"
        /> -->
        <div>
          <h1 class="text-5xl font-bold">Your One lynkpage</h1>
          <h2 class="text-3xl font-bold">to rule them all!</h2>
          <h3 class="text-xl font-bold py-5">
            lynkpage.com/<a class="text-primary">
              {{ possibleUsername }}
            </a>
          </h3>
          <p class="pb-5">could be your next personal page.</p>
          <NuxtLink to="/auth/signup" class="btn btn-primary"
            >Get Started</NuxtLink
          >
        </div>
      </div>
    </div>

    <!-- gradient -->
    <gradient />

    <!-- footer -->
    <Footer />
    <!-- footer end -->
  </div>
</template>

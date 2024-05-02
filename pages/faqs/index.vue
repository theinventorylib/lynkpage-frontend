<script setup lang="ts"></script>
// showing faqs
<template>
  <div>
    <Header show-menu show-link />
    <div class="card">
      <!-- greetings card -->
      <div class="px-12 py-5">
        <h2 class="card-title text-6xl">FAQs</h2>
      </div>
      <div class="card-body">
        <!-- accordion for faqs -->
        <div class="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" />
          <div class="collapse-title text-xl font-medium">
            What is the site about?
          </div>
          <div class="collapse-content">
            <p>
              This site is similar to a personal portfolio, you can share a bit
              more about yourself, your projects, and your interests. using
              links, images, icons and blog feature for more extensive writting
              we offer a range of themes(premium) so you can be in control of
              the look and feel of your page. the analytics feature(premium) is
              for those who migh use their page for marketing and others.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" />
          <div class="collapse-title text-xl font-medium">
            How do I get started?
          </div>
          <div class="collapse-content">
            <p>
              You can start by creating an account, then you can start editing
              your page, you can add links, images, icons, and blog
              posts(premium). you can also change the theme of your page, and if
              you want to get more out of your page you can upgrade to premium.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" />
          <div class="collapse-title text-xl font-medium">
            How do I change the theme of my page?
          </div>
          <div class="collapse-content">
            <p>
              You can change the theme of your page by going to the edit page
              and clicking on the theme button, then you can choose from a
              variety of themes(premium) and you can also customize the theme to
              your liking(premium).
            </p>
          </div>
        </div>
        <!-- accordion for faqs end -->
      </div>
    </div>
  </div>
</template>

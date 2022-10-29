<template>
  <div class="bg-sta-gray-light">
    <div class="container flex flex-wrap p-4 md:my-2">
      <div class="flex items-center w-full md:w-1/4 lg:w-1/5">
        <nav class="w-full">
          <ul class="flex justify-evenly space-x-2 md:block md:space-x-0">
            <li
              v-for="(item, index) in navItems"
              :key="index"
              class="flex mt-2 text-center text-white md:block md:text-left underline"
            >
              <component
                :is="item[0].startsWith('/') ? 'NuxtLink' : 'a'"
                :to="item[0]"
                :href="item[0]"
              >
                <span class="hover:text-sta-orange">{{ item[1] }}</span>
              </component>
            </li>
          </ul>
        </nav>
      </div>
      <div
        class="flex flex-1 flex-wrap items-center justify-center mt-4 w-full md:mt-0 gap-x-4"
      >
        <div class="w-44">
          <a href="https://bristolsta.com" target="_blank">
            <img
              src="@/assets/images/sta-logo-left.png"
              class="mx-auto max-h-full"
              style="max-height: 100px"
              alt="Stage Technicians' Association Logo"
            />
          </a>
        </div>
        <div class="w-48">
          <a href="https://bristolsu.org.uk" target="_blank">
            <img
              src="@/assets/images/bristol-su-supporting-logo.png"
              class="mx-auto max-h-full"
              style="max-height: 100px"
              alt="Bristol SU Balloon Logo"
            />
          </a>
        </div>

        <div
          class="lg:flex-1 mt-2 text-center text-white md:mt-0 lg:text-left md:ml-12"
        >
          <p class="mb-2 md:mb-4">
            &copy; Bristol Stage Technicians' Association
            {{ new Date().getFullYear() }}
          </p>
          <p>This website is built and run by Bristol SU student volunteers.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navItems: [
        ['/privacy', 'Privacy Policy'],
        ['/terms', 'Terms & Conditions'],
        [
          'mailto:support@uobtheatre.com?subject=Request For Support',
          'Contact Us'
        ]
      ]
    };
  }
};
</script>

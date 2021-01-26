<template>
  <div class="bg-sta-gray-light">
    <div class="container flex flex-wrap p-4 md:my-2">
      <div class="flex items-center w-full md:w-1/3 lg:w-2/5">
        <nav class="w-full">
          <ul class="flex space-x-2 md:space-x-0 justify-evenly md:block">
            <li
              v-for="(item, index) in navItems"
              :key="index"
              class="flex mt-2 text-center text-white md:text-left hover:text-sta-orange md:block"
            >
              <router-link :to="item[0]">{{ item[1] }}</router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="flex flex-wrap items-center flex-1 w-full mt-4 md:mt-0">
        <div class="w-1/2 h-16 md:w-32 md:h-auto">
          <a href="https://bristolsta.com" target="_blank"
            ><img
              src="@/assets/images/sta-logo-white.png"
              class="max-h-full mx-auto"
              style="max-width: 100px"
              alt="Stage Technicians' Association Logo"
          /></a>
        </div>
        <div class="w-1/2 h-16 md:w-32 md:h-auto">
          <a href="https://bristolsu.org" target="_blank">
            <img
              src="@/assets/images/bristol-su-logo.png"
              class="max-h-full mx-auto"
              style="max-width: 100px"
              alt="Bristol SU Baloon Logo"
          /></a>
        </div>

        <div
          class="flex-1 mt-2 text-center text-white md:mt-0 md:ml-12 md:text-left"
        >
          <p class="mb-2 md:mb-4">
            &copy; Bristol Stage Technicians' Association
            {{ new Date().getFullYear() }}
          </p>
          <p>
            This theatre website is built and run by Bristol SU student
            volunteers.
          </p>
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
        ['/', 'Privacy Policy'],
        ['/', 'Terms & Conditions'],
        ['/', 'Contact Us'],
      ],
    };
  },
};
</script>

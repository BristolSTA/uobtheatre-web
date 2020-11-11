<template>
  <div class="bg-sta-gray-light">
    <div class="container flex flex-wrap p-4">
      <div class="flex items-center w-full md:w-1/3 lg:w-1/2">
        <nav class="w-full">
          <ul class="flex justify-evenly md:block">
            <li
              v-for="(item, index) in navItems"
              :key="index"
              class="mt-2 inline-block md:block"
            >
              <router-link
                :to="item[0]"
                class="text-white hover:text-sta-orange"
                >{{ item[1] }}</router-link
              >
            </li>
          </ul>
        </nav>
      </div>
      <div class="flex items-center w-full mt-4 flex-1">
        <div class="w-32">
          <a href="https://bristolsta.com" target="_blank"
            ><img
              src="@/assets/images/sta-logo-white.png"
              alt="Stage Technicians' Association Logo"
          /></a>
        </div>
        <div class="w-32 ml-10">
          <a href="https://bristolsu.org" target="_blank">
            <img
              src="@/assets/images/bristol-su-logo.png"
              alt="Bristol SU Baloon Logo"
          /></a>
        </div>

        <div class="text-white ml-10">
          <p class="mb-4">
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
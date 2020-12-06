<template>
  <div class="h-full bg-sta-gray">
    <h1 class="container pt-4 text-left text-white text-h1">
      The Winston Theatre
    </h1>
    <div class="flex flex-wrap items-center justify-center">
      <div
        class="flex flex-col items-center w-full px-10 text-justify text-white md:block md:w-auto md:max-w-md"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <br />
        <p><strong>Address: </strong></p>
        <p>The Richmond Building</p>
        <p>105 Queens Road</p>
        <p>Bristol, BS8 1LN</p>
      </div>
      <div class="w-full max-w-xl m-6 h-80 md:w-2/3">
        <img
          class="w-full p-8"
          src="@/assets/images/placeholder-homepage-splash.jpg"
          alt="feature_image"
          ref="featured_image"
        />
      </div>
    </div>

    <div class="flex justify-center h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2218.0465457381238!2d-2.6128241361907865!3d51.45667798827902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48718dc5ca9a5089%3A0xd52e92fe92092806!2sBristol%20SU%20(Richmond%20Building)!5e0!3m2!1sen!2suk!4v1607260466320!5m2!1sen!2suk"
        frameborder="0"
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"
        title="SU-map"
        class="flex w-full h-full p-8 md:w-2/3"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Venues',
  data() {},
};
</script>

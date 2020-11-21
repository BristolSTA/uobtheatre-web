<template>
  <div class="">
    <div
      class="flex items-center font-semibold text-center"
      style="width: 360px"
    >
      <div class="w-1/2 py-3 bg-sta-orange br">Login</div>
      <div class="w-1/2 py-3 bg-sta-gray-light bl">Sign Up</div>
      <div
        class="absolute w-6 h-6 bg-white rounded-full text-sta-gray-light mid"
      >
        or
      </div>
    </div>

    <h1>This is login</h1>
  </div>
</template>

<style lang="scss">
.br {
  border-right: 3px solid;
  @apply border-sta-gray;
}
.bl {
  border-left: 3px solid;
  @apply border-sta-gray;
}
.mid {
  height: 10px;
  width: 10px;
  left: 180px-10px;
}
</style>

<script>
export default {
  name: 'login-box',
};
</script>

<template functional>
  <div class="h-screen bg-sta-gray auth-background">
    <div class="flex items-center justify-center h-full">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-background {
  background-image: url('~@/assets/images/pros-arch-lit.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
}
</style>
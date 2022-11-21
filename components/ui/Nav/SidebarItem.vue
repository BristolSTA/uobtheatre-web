<template>
  <div
    class="px-3 py-2 rounded"
    :class="[
      isActive ? 'text-sta-orange' : ' text-gray-400 hover:text-gray-100'
    ]"
  >
    <NuxtLink :to="href" @click="$emit('click')">
      <div class="flex items-center space-x-4">
        <div v-if="icon" class="flex w-5">
          <font-awesome-icon :icon="icon" />
        </div>
        <div><slot /></div>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default defineNuxtComponent({
  props: {
    icon: {
      default: null,
      type: String
    },
    href: {
      default: null,
      type: String
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      const currentUrl = useRoute().path;
      if (this.isRoot) {
        return currentUrl === this.href;
      }
      return currentUrl.startsWith(this.href);
    }
  }
});
</script>

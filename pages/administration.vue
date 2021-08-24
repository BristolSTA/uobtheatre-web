<template>
  <div class="flex min-h-full">
    <admin-sidebar
      class="w-full md:w-auto"
      :class="{ 'hidden md:visible': !showSidebar }"
      @close="showSidebar = false"
    />
    <div class="flex-grow p-4" :class="{ 'hidden md:visible': showSidebar }">
      <button class="md:hidden" @click="showSidebar = true">
        <font-awesome-icon icon="caret-square-right" class="fa-2x" />
      </button>
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
export default {
  components: { AdminSidebar },
  data() {
    return {
      showSidebar: false,
    }
  },
  head: {
    titleTemplate: (chunk) =>
      chunk ? `${chunk} | Admin | UOB Theatre` : 'Administration | UOB Theatre',
  },
}
</script>

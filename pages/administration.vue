<template>
  <div class="flex min-h-full">
    <admin-sidebar
      class="w-full md:w-auto"
      :class="{ 'hidden md:visible': !showSidebar }"
      @close="showSidebar = false"
    />
    <div
      class="grow max-w-full min-w-0"
      :class="{ 'hidden md:visible': showSidebar }"
    >
      <breadcrumbs :use-auto="true" :wide="true" />
      <div class="p-4">
        <button class="md:hidden" @click="showSidebar = true">
          <font-awesome-icon icon="caret-square-right" class="fa-2x" />
        </button>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import Breadcrumbs from '@/components/ui/UiBreadcrumbs.vue';

definePageMeta({
  middleware: ['authed', 'admin']
});

export default defineNuxtComponent({
  components: { AdminSidebar, Breadcrumbs },
  layout: 'admin',
  data() {
    return {
      showSidebar: false
    };
  },
  head: {
    titleTemplate: (chunk) =>
      chunk ? `${chunk} | Admin | UOB Theatre` : 'Administration | UOB Theatre'
  }
});
</script>

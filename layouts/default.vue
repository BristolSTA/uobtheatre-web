<template>
  <div class="flex flex-col h-screen font-body">
    <NuxtLoadingIndicator color="#FF9F1C" :height="5" />
    <LayoutNavBar />
    <UiBreadcrumbs v-if="navStore.breadcrumbs" :crumbs="navStore.breadcrumbs" />
    <main class="flex-1 pb-2 text-white bg-sta-gray">
      <NuxtErrorBoundary>
        <slot />
        <template #error="{ error }"
          >123<LayoutErrorPageInner :error="error"
        /></template>
      </NuxtErrorBoundary>
    </main>
    <LayoutFooterBar />
  </div>
</template>

<script setup lang="ts">
import useNavStore from '@/store/nav';

const router = useRouter();
const navStore = useNavStore();
router.beforeEach((to, from) => {
  navStore.breadcrumbs = undefined;
});
</script>

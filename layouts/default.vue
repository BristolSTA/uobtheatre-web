<template>
  <div class="flex flex-col h-screen font-body">
    <NuxtLoadingIndicator color="#FF9F1C" :height="5" />
    <LayoutNavBar />
    <UiBreadcrumbs v-if="navStore.breadcrumbs" :crumbs="navStore.breadcrumbs" />
    <main class="flex-1 pb-2 text-white bg-sta-gray">
      <NuxtErrorBoundary @error="onBoundaryErrorCatch">
        <slot />
        <template #error="{ error }"
          ><LayoutErrorPageInner :error="error"
        /></template>
      </NuxtErrorBoundary>
    </main>
    <LayoutFooterBar />
  </div>
</template>

<script setup lang="ts">
import useNavStore from '@/store/nav';
import { silentErrorHandler } from '@/utils/misc';

const router = useRouter();
const navStore = useNavStore();
router.beforeEach(() => {
  navStore.breadcrumbs = undefined;
});

function onBoundaryErrorCatch(error: unknown) {
  if (
    error &&
    typeof error == 'object' && // @ts-ignore
    [404, 401].includes(error?.statusCode)
  )
    // Don't log 404s, 401s, etc
    return;

  silentErrorHandler(error);
}
</script>

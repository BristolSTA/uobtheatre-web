<template>
  <div class="flex flex-col h-screen font-body">
    <LayoutNavBar v-if="!boxOfficeStore.lockdownMode" />
    <LayoutMaintenanceBanner />
    <LayoutSiteMessageModal location="LANDING_MODAL" />
    <UiBreadcrumbs v-if="navStore.breadcrumbs" :crumbs="navStore.breadcrumbs" />
    <main class="flex-1 pb-2 text-white bg-sta-gray">
      <NuxtErrorBoundary @error="onBoundaryErrorCatch">
        <slot />
        <template #error="{ error, clearError }"
          ><LayoutErrorPageInner :error="error" @clear-error="clearError"
        /></template>
      </NuxtErrorBoundary>
    </main>
    <LayoutFooterBar v-if="!boxOfficeStore.lockdownMode" />
  </div>
</template>

<script setup lang="ts">
import useNavStore from '@/store/nav';
import { silentErrorHandler } from '@/utils/misc';
import useBoxOfficeStore from '~~/store/box-office';

const router = useRouter();
const navStore = useNavStore();
const boxOfficeStore = useBoxOfficeStore();
router.beforeEach(() => {
  navStore.breadcrumbs = undefined;
});

function onBoundaryErrorCatch(error: Error) {
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

<template>
  <div class="h-full text-white bg-sta-gray">
    <Head>
      <Title>{{ title || 'Loading...' }}</Title>
    </Head>

    <div
      v-if="banner"
      class="min-h-25vh 2xl:min-h-40vh bg-cover bg-center"
      :style="{ 'background-image': banner }"
    />
    <div>
      <h1 class="container align-middle py-3 text-center text-h1">
        {{ title }}
      </h1>
    </div>

    <div
      class="grid gap-4 p-4 lg:mx-5 xl:mx-10 grid-cols-1 lg:grid-cols-5"
      style="grid-template-rows: auto auto auto"
    >
      <div
        class="lg:col-start-4 lg:col-span-2 lg:row-start-1 lg:sticky lg:mb-auto lg:mt-auto lg:top-4 lg:bottom-4"
      >
        <div
          class="flex flex-col flex-wrap items-center justify-center bg-sta-gray-light rounded-lg h-min"
        >
          <!-- Sidebar content (top/main) -->
          <slot name="sidebar" />
        </div>
      </div>

      <div
        class="lg:mr-5 xl:mr-10 lg:col-start-1 lg:col-span-3 flex flex-col rounded"
      >
        <!-- Main page content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  /** CSS background-image value, e.g. url("https://...") */
  banner?: string | null;
}>();
</script>

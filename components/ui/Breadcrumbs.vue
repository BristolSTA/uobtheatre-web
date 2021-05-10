<template>
  <div class="flex py-1 font-semibold align-middle text-sta-gray-lightest">
    <div
      v-for="(crumb, index) in crumbs"
      :key="index"
      class="flex pr-2 text-sm"
    >
      <NuxtLink v-if="crumb.route" :to="crumb.route">
        <span class="text-sta-orange-light hover:text-white">{{
          crumb.text
        }}</span>
        <font-awesome-icon class="ml-2" icon="chevron-right" />
      </NuxtLink>
      <template v-else> {{ crumb.text }}</template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    crumbs: {
      required: true,
      type: Array,
    },
  },
}
</script>

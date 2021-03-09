<template>
  <div class="flex py-1 text-white align-middle">
    <div
      v-for="(crumb, index) in crumbs"
      :key="index"
      class="flex pr-2 text-sm"
    >
      <router-link v-if="crumb.route" :to="crumb.route">
        <span class="text-blue-500 hover:text-gray-300">{{ crumb.text }}</span>
        <font-awesome-icon class="ml-2" icon="chevron-right" />
      </router-link>
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
};
</script>

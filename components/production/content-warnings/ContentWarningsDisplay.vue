<template>
  <ul class="gap-y-2 flex flex-col">
    <li v-for="(warning, index) in contentWarnings" :key="index">
      <content-warning-display :content-warning="warning" />
    </li>
  </ul>
</template>

<script>
import ContentWarningDisplay from './ContentWarningDisplay.vue';
export default defineNuxtComponent({
  components: { ContentWarningDisplay },
  props: {
    contentWarnings: {
      required: true,
      type: Array
    }
  }
});
</script>

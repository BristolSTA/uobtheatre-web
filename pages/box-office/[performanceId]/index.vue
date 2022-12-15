<template>
  <div class="sm:container">
    <Head>
      <Title>{{ performance.production.name }} Box Office</Title>
    </Head>
    <div class="py-1 sm:py-10">
      <overview
        :production="performance.production"
        :performance="performance"
      />
    </div>
    <box-office-navigation :performance="performance" :show-home="false" />
  </div>
</template>

<script>
import Overview from '@/components/box-office/Overview.vue';
import BoxOfficeNavigation from '@/components/box-office/BoxOfficeNavigation.vue';
import { dateFormat } from '~~/utils/datetime';

import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
  components: { Overview, BoxOfficeNavigation },
  props: {
    performance: {
      required: true,
      type: Object
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', path: '/box-office' },
        {
          text: `${this.performance.production.name} on ${dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`
        }
      ];
    }
  }
});
</script>

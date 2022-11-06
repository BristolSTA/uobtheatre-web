<template>
  <div class="container">
    <div class="py-1 sm:py-6">
      <overview
        :production="performance.production"
        :performance="performance"
        :detailed="false"
      />

      <box-office-navigation :performance="performance" :compact="true" />
    </div>

    <ticket-scanner :check-in-mode="true" :performance-id="performance.id" />
  </div>
</template>

<script>
import Overview from '@/components/box-office/Overview.vue';
import TicketScanner from '@/components/ui/Inputs/TicketScanner.vue';
import BoxOfficeNavigation from '@/components/box-office/BoxOfficeNavigation.vue';
import { dateFormat } from '~~/utils/datetime';

export default defineNuxtComponent({
  components: { Overview, TicketScanner, BoxOfficeNavigation },
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
          )}`,
          path: `/box-office/${this.performance.id}`
        },
        {
          text: 'Collect or Check'
        }
      ];
    }
  }
});
</script>

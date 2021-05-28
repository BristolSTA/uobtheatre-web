<template>
  <div class="sm:container">
    <div class="py-1 sm:py-10">
      <overview
        :production="performance.production"
        :performance="performance"
      />
    </div>
    <div class="flex flex-wrap justify-center">
      <menu-tile
        v-for="(box, index) in navItems"
        :key="index"
        :route="box.route"
        :icon="box.icon"
        :name="box.name"
        class="w-full mb-4 md:mr-4 bg-sta-green hover:bg-sta-orange md:w-1/3 lg:w-1/4 2xl:w-1/5"
      />
    </div>
  </div>
</template>

<script>
import Overview from '@/components/box-office/Overview.vue'
import MenuTile from '@/components/box-office/MenuTile.vue'

export default {
  components: { Overview, MenuTile },
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      navItems: [
        {
          name: 'Check or Collect Tickets',
          icon: 'user-check',
          route: `/box-office/${this.performance.id}/collect`,
        },
        {
          name: 'Sell Tickets',
          icon: 'cash-register',
          route: `/box-office/${this.performance.id}/sell`,
        },
        {
          name: 'View Bookings',
          icon: 'clipboard-list',
          route: `/box-office/${this.performance.id}/bookings`,
        },
      ],
    }
  },
  head() {
    return {
      title: `${this.performance.production.name} Box Office`,
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`,
        },
      ]
    },
  },
}
</script>

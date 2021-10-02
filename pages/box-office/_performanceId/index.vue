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
        :to="box.path"
        :icon="box.icon"
        class="
          w-full
          mb-4
          md:mr-4
          bg-sta-green
          hover:bg-sta-orange
          md:w-1/3
          lg:w-1/4
          2xl:w-1/5
        "
        >{{ box.name }}</menu-tile
      >
    </div>
  </div>
</template>

<script>
import Overview from '@/components/box-office/Overview.vue'
import MenuTile from '@/components/ui/MenuTile.vue'

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
          path: `/box-office/${this.performance.id}/collect`,
        },
        {
          name: 'Sell Tickets',
          icon: 'cash-register',
          path: `/box-office/${this.performance.id}/sell`,
        },
        {
          name: 'View Bookings',
          icon: 'clipboard-list',
          path: `/box-office/${this.performance.id}/bookings`,
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
        { text: 'Box Office', path: '/box-office' },
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

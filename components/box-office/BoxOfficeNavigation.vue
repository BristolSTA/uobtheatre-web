<template>
  <div class="flex flex-wrap justify-center m-4 gap-4">
    <menu-tile
      v-for="(box, index) in completeNavItems"
      :key="index"
      :to="box.path"
      :icon="box.icon"
      class="bg-sta-green hover:bg-sta-orange"
      :text-size="compact ? 'text-sm' : undefined"
      :class="[compact ? '' : 'w-full md:w-1/3 lg:w-1/4 2xl:w-1/5']"
    >
      {{ box.name }}
    </menu-tile>
  </div>
</template>

<script>
import MenuTile from '../ui/MenuTile.vue';
export default defineNuxtComponent({
  components: { MenuTile },
  props: {
    performance: {
      required: true,
      type: Object
    },
    showHome: {
      default: true,
      type: Boolean
    },
    compact: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      navItems: [
        {
          name: 'Check or Collect Tickets',
          icon: 'user-check',
          path: `/box-office/${this.performance.id}/collect`
        },
        {
          name: 'Sell Tickets',
          icon: 'cash-register',
          path: `/box-office/${this.performance.id}/sell`
        },
        {
          name: 'View Bookings',
          icon: 'clipboard-list',
          path: `/box-office/${this.performance.id}/bookings`
        }
      ]
    };
  },
  computed: {
    completeNavItems() {
      const items = [];
      if (this.showHome) {
        items.push({
          name: 'Dashboard',
          icon: 'home',
          path: `/box-office/${this.performance.id}`
        });
      }

      items.push(...this.navItems);
      return items;
    }
  }
});
</script>

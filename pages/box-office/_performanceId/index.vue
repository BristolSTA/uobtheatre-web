<template>
  <div class="sm:container">
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
import Overview from "@/components/box-office/Overview.vue";
import BoxOfficeNavigation from "@/components/box-office/BoxOfficeNavigation.vue";

export default {
  components: { Overview, BoxOfficeNavigation },
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },

  head() {
    return {
      title: `${this.performance.production.name} Box Office`,
    };
  },
  computed: {
    crumbs() {
      return [
        { text: "Box Office", path: "/box-office" },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            "ccc dd MMM T"
          )}`,
        },
      ];
    },
  },
};
</script>

<template>
  <div class="text-white container my-6">
    <ul class="uppercase text-xl">
      <li
        class="font-semibold inline-block hover:text-sta-rouge"
        :class="{ 'text-sta-rouge': overview }"
      >
        <clickable-link @click="overview = true">Overview</clickable-link>
      </li>
      <li
        class="font-semibold inline-block hover:text-sta-rouge ml-6"
        :class="{ 'text-sta-rouge': !overview }"
      >
        <clickable-link @click="overview = false"
          >Cast & Credits</clickable-link
        >
      </li>
    </ul>
    <div v-if="overview" class="flex flex-wrap lg:flex-nowrap p-4 lg:space-x-4">
      <div
        class="flex-none w-full mb-4 sm:w-1/2 lg:w-auto lg:mb-0 order-1 text-center"
      >
        <img
          class="max-h-80 inline-block"
          :src="production.poster_image"
          alt="show poster"
        />
      </div>
      <div class="flex-grow order-3 mt-4 lg:mt-0 lg:order-2">
        {{ production.description }}
      </div>
      <div
        class="flex flex-col flex-none space-y-2 order-2 bg-sta-gray-dark p-5 w-full sm:w-1/2 lg:w-1/3 lg:order-3"
      >
        <h3 class="text-xl font-semibold uppercase">Show Information</h3>
        <p><strong>Medium:</strong> {{ medium }}</p>
        <p v-if="production.age_rating">Ages {{ production.age_rating }}+</p>
        <div v-if="production.warnings" class="bg-sta-rouge p-3">
          <span class="text-xl font-semibold uppercase">Audience Warnings</span>
          <ul class="list-disc list-inside">
            <li v-for="(warning, index) in production.warnings" :key="index">
              {{ warning }}
            </li>
          </ul>
        </div>
        <p>
          A production by <strong>{{ production.society.name }}</strong>
        </p>
        <a
          v-if="production.facebook_event"
          :href="production.facebook_event"
          class="text-sta-green uppercase font-semibold"
          target="_blank"
        >
          <icon-list-item :icon="['fab', 'facebook']"
            >Facebook Event</icon-list-item
          ></a
        >
      </div>
    </div>
    <div v-else>Cast and credits here</div>
  </div>
</template>

<script>
import ClickableLink from '@/components/ui/ClickableLink.vue';
import IconListItem from '@/components/ui/IconListItem.vue';
export default {
  name: 'production-cast-and-credits',
  components: { ClickableLink, IconListItem },
  props: {
    production: {
      required: true,
    },
  },
  data() {
    return {
      overview: true,
    };
  },
  computed: {
    medium() {
      if (this.production.is_online && this.production.is_inperson)
        return 'In Person + Online';
      if (this.production.is_online) return 'Online Only';
      return 'In Person Only';
    },
  },
};
</script>
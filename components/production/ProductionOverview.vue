<template>
  <div class="flex flex-wrap p-4 lg:flex-nowrap lg:space-x-4">
    <div
      class="
        flex-none
        order-1
        w-full
        mb-4
        text-center
        sm:w-1/2
        lg:w-auto lg:mb-0
      "
    >
      <img
        ref="poster-image"
        class="inline-block max-h-80"
        :src="production.posterImage.url"
        alt="show poster"
      />
    </div>
    <tip-tap-output
      class="flex-grow order-3 mt-4 lg:mt-0 lg:order-2"
      :html="production.description"
    />
    <div
      class="
        flex flex-col flex-none
        order-2
        w-full
        p-5
        space-y-2
        bg-sta-gray-dark
        sm:w-1/2
        lg:w-1/3 lg:order-3
      "
    >
      <h3 class="text-xl font-semibold uppercase">Show Information</h3>
      <p v-if="medium"><strong>Medium:</strong> {{ medium }}</p>
      <p v-if="production.ageRating" ref="age-rating">
        Ages {{ production.ageRating }}+
      </p>
      <div
        v-if="production.warnings.length"
        ref="warnings"
        class="p-3 bg-sta-rouge"
      >
        <span class="text-xl font-semibold uppercase">Audience Warnings</span>
        <ul class="list-disc list-inside">
          <li v-for="(warning, index) in production.warnings" :key="index">
            {{ warning.description }}
          </li>
        </ul>
      </div>
      <p>
        A production by
        <NuxtLink
          class="font-semibold hover:text-gray-300"
          :to="`/society/${production.society.slug}`"
        >
          {{ production.society.name }}
        </NuxtLink>
      </p>
      <a
        v-if="production.facebookEvent"
        ref="facebook-link"
        :href="production.facebookEvent"
        class="font-semibold uppercase text-sta-green"
        target="_blank"
      >
        <icon-list-item :icon="['fab', 'facebook']">
          Facebook Event
        </icon-list-item>
      </a>
    </div>
  </div>
</template>

<script>
import IconListItem from '@/components/ui/IconListItem.vue'
import TipTapOutput from '@/components/ui/TipTapOutput.vue'
export default {
  components: {
    IconListItem,
    TipTapOutput,
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  computed: {
    medium() {
      if (!this.production.performances.edges.length) return null
      if (this.hasOnlinePerformances && this.hasInPersonPerformances)
        return 'In Person + Online'
      if (this.hasOnlinePerformances) return 'Online Only'
      return 'In Person Only'
    },
    hasOnlinePerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isOnline
      )
    },
    hasInPersonPerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isInperson
      )
    },
  },
}
</script>

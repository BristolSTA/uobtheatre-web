<template>
  <div class="container my-6 text-white">
    <ul class="text-xl uppercase">
      <li
        class="inline-block font-semibold"
        :class="{
          'text-sta-rouge hover:text-sta-rouge': overview & hasCastCrew,
        }"
      >
        <clickable-link @click="overview = true"> Overview </clickable-link>
      </li>
      <li
        v-if="hasCastCrew"
        class="inline-block ml-6 font-semibold hover:text-sta-rouge"
        :class="{ 'text-sta-rouge': !overview }"
      >
        <clickable-link :disabled="!hasCastCrew" @click="overview = false">
          Cast &amp; Credits
        </clickable-link>
      </li>
    </ul>
    <div
      v-if="overview"
      ref="overview"
      class="flex flex-wrap p-4 lg:flex-nowrap lg:space-x-4"
    >
      <div
        class="flex-none order-1 w-full mb-4 text-center sm:w-1/2 lg:w-auto lg:mb-0"
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
        class="flex flex-col flex-none order-2 w-full p-5 space-y-2 bg-sta-gray-dark sm:w-1/2 lg:w-1/3 lg:order-3"
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
    <div v-else ref="cast-credits" class="flex flex-wrap justify-center">
      <div
        v-if="production.productionTeam.length"
        class="cast-credit-section lg:w-1/2"
      >
        <h1 class="crew-section-header">Production Team</h1>
        <div class="flex flex-wrap justify-center">
          <div
            v-for="(groups, groupsIndex) in productionTeamSplit"
            :key="groupsIndex"
            class="w-full text-center md:w-1/2"
          >
            <div
              v-for="(group, index) in groups"
              :key="index"
              class="crew-item"
            >
              <h4 class="font-semibold uppercase">
                {{ group[0].role }}
              </h4>
              <p v-for="(member, gIndex) in group" :key="gIndex">
                {{ member.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="production.crew.length" class="cast-credit-section lg:w-1/2">
        <h1 class="uppercase crew-section-header">Crew</h1>
        <div class="flex flex-wrap justify-center">
          <div
            v-for="(groups, groupsIndex) in crewGroupedSplit"
            :key="groupsIndex"
            class="w-full text-center md:w-1/2"
          >
            <div
              v-for="(group, index) in groups"
              :key="index"
              class="crew-item"
            >
              <h4 class="font-semibold uppercase">
                {{ group[0].role.department.description }}
              </h4>
              <p v-for="(member, gIndex) in group" :key="gIndex">
                {{ member.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="production.cast.length" class="w-full p-4 text-center">
        <h1 class="uppercase crew-section-header">Cast</h1>
        <div class="flex flex-wrap justify-center space-y-4">
          <div
            v-for="(member, index) in sortedCast"
            :key="index"
            class="flex items-center w-full px-2 sm:justify-center sm:w-1/3 md:w-1/4 xl:w-1/5 production-cast-member"
          >
            <div v-if="member.profilePicture" class="flex-none w-20">
              <img
                class="rounded-full"
                :src="member.profilePicture.url"
                alt="profile image"
              />
            </div>
            <div class="flex-grow text-center">
              <p>
                <strong>{{ member.name }}</strong>
              </p>
              <p>{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash'

import ClickableLink from '@/components/ui/ClickableLink.vue'
import IconListItem from '@/components/ui/IconListItem.vue'
import TipTapOutput from '../ui/TipTapOutput.vue'
export default {
  name: 'ProductionCastAndCredits',
  components: { ClickableLink, IconListItem, TipTapOutput },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      overview: true,
    }
  },
  computed: {
    productionTeamSplit() {
      let i = 0
      return lodash
        .chain(this.production.productionTeam)
        .groupBy('role')
        .groupBy(() => {
          const res = Math.floor(i % 2)
          i++
          return res
        })
        .value()
    },
    crewGroupedSplit() {
      let i = 0
      return lodash
        .chain(this.production.crew)
        .groupBy('role.department.description')
        .groupBy(() => {
          const res = Math.floor(i % 2)
          i++
          return res
        })
        .value()
    },
    sortedCast() {
      return lodash.sortBy(this.production.cast, 'profilePicture')
    },
    hasCastCrew() {
      return Boolean(
        this.production.crew.length ||
          this.production.cast.length ||
          this.production.productionTeam.length
      )
    },
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

<style lang="scss" scoped>
.crew-section-header {
  @apply text-2xl;
  @apply tracking-wide;
  @apply uppercase;
}
.cast-credit-section {
  @apply w-full;
  @apply p-4;
  @apply text-center;
}
</style>

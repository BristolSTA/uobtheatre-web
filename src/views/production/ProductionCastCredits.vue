<template>
  <div class="container my-6 text-white">
    <ul class="text-xl uppercase">
      <li
        class="inline-block font-semibold hover:text-sta-rouge"
        :class="{ 'text-sta-rouge': overview }"
      >
        <clickable-link @click="overview = true">Overview</clickable-link>
      </li>
      <li
        class="inline-block ml-6 font-semibold hover:text-sta-rouge"
        :class="{ 'text-sta-rouge': !overview }"
      >
        <clickable-link @click="overview = false"
          >Cast & Credits</clickable-link
        >
      </li>
    </ul>
    <div v-if="overview" class="flex flex-wrap p-4 lg:flex-nowrap lg:space-x-4">
      <div
        class="flex-none order-1 w-full mb-4 text-center sm:w-1/2 lg:w-auto lg:mb-0"
      >
        <img
          class="inline-block max-h-80"
          :src="production.poster_image"
          alt="show poster"
        />
      </div>
      <div class="flex-grow order-3 mt-4 lg:mt-0 lg:order-2">
        {{ production.description }}
      </div>
      <div
        class="flex flex-col flex-none order-2 w-full p-5 space-y-2 bg-sta-gray-dark sm:w-1/2 lg:w-1/3 lg:order-3"
      >
        <h3 class="text-xl font-semibold uppercase">Show Information</h3>
        <p><strong>Medium:</strong> {{ medium }}</p>
        <p v-if="production.age_rating">Ages {{ production.age_rating }}+</p>
        <div v-if="production.warnings" class="p-3 bg-sta-rouge">
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
          class="font-semibold uppercase text-sta-green"
          target="_blank"
        >
          <icon-list-item :icon="['fab', 'facebook']"
            >Facebook Event</icon-list-item
          ></a
        >
      </div>
    </div>
    <div v-else class="flex flex-wrap justify-center">
      <div
        class="cast-credit-section"
        v-if="this.production.productionTeam.length"
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
              <h4 class="font-semibold uppercase">{{ group[0].role }}</h4>
              <p v-for="(member, gIndex) in group" :key="gIndex">
                {{ member.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="cast-credit-section" v-if="this.production.crew.length">
        <h1 class="crew-section-header">CREW</h1>
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
              <h4 class="font-semibold uppercase">{{ group[0].department }}</h4>
              <p v-for="(member, gIndex) in group" :key="gIndex">
                {{ member.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full p-4 text-center" v-if="this.production.cast.length">
        <h1 class="crew-section-header">CAST</h1>
        <div class="flex flex-wrap justify-center space-y-4">
          <div
            v-for="(member, index) in sortedCast"
            :key="index"
            class="flex items-center justify-center w-full px-2 sm:w-1/4 xl:w-1/5"
          >
            <div v-if="member.profile_picture" class="flex-none w-20">
              <img
                class="rounded-full"
                :src="member.profile_picture"
                alt="profile image"
              />
            </div>

            <div class="text-center sm:flex-grow">
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

<style lang="scss" scoped>
.crew-section-header {
  @apply text-2xl tracking-wide uppercase;
}
.cast-credit-section {
  @apply w-full p-4 text-center lg:w-1/2;
}
</style>

<script>
import lodash from 'lodash';
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
    productionTeamSplit() {
      let i = 0;
      return lodash
        .chain(this.production.productionTeam)
        .groupBy('role')
        .groupBy(() => {
          let res = Math.floor(i % 2);
          i++;
          return res;
        })
        .value();
    },
    crewGroupedSplit() {
      let i = 0;
      return lodash
        .chain(this.production.crew)
        .groupBy('department')
        .groupBy(() => {
          let res = Math.floor(i % 2);
          i++;
          return res;
        })
        .value();
    },
    sortedCast() {
      return lodash.sortBy(this.production.cast, 'profile_picture');
    },
    medium() {
      if (this.production.is_online && this.production.is_inperson)
        return 'In Person + Online';
      if (this.production.is_online) return 'Online Only';
      return 'In Person Only';
    },
  },
};
</script>
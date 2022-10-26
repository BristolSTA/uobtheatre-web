<template>
  <div class="flex flex-wrap justify-center">
    <div v-if="production.cast.length" class="p-4 w-full text-center">
      <h1 class="crew-section-header underline uppercase">Cast</h1>
      <div class="flex flex-wrap justify-center">
        <div
          v-for="(member, index) in sortedCast"
          :key="index"
          class="production-cast-member flex items-center px-4 py-2 sm:justify-center"
        >
          <div v-if="member.profilePicture" class="flex-none pr-4 w-20">
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
    <div
      v-if="production.productionTeam.length"
      class="cast-credit-section lg:w-1/2"
    >
      <h1 class="crew-section-header underline">Production Team</h1>
      <div class="flex flex-wrap justify-center space-x-10">
        <role-group
          v-for="(group, index) in productionTeamGrouped"
          :key="index"
          :name="group[0].role"
        >
          <p v-for="(member, gIndex) in group" :key="gIndex">
            {{ member.name }}
          </p>
        </role-group>
      </div>
    </div>
    <div v-if="production.crew.length" class="cast-credit-section lg:w-1/2">
      <h1 class="crew-section-header underline uppercase">Crew</h1>
      <div class="flex flex-wrap justify-center space-x-10">
        <role-group
          v-for="(group, index) in crewGrouped"
          :key="index"
          :name="group[0].role.department.description"
        >
          <p v-for="(member, gIndex) in group" :key="gIndex">
            {{ member.name }}
          </p>
        </role-group>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash';

import RoleGroup from './RoleGroup.vue';
export default {
  name: 'ProductionCastAndCredits',
  components: {
    RoleGroup,
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      overview: true,
    };
  },
  computed: {
    productionTeamGrouped() {
      return lodash
        .chain(this.production.productionTeam)
        .groupBy('role')
        .value();
    },
    crewGrouped() {
      return lodash
        .chain(this.production.crew)
        .groupBy('role.department.description')
        .value();
    },
    sortedCast() {
      return lodash.sortBy(this.production.cast, 'profilePicture');
    },
  },
};
</script>

<style lang="scss" scoped>
.crew-section-header {
  @apply text-2xl;
  @apply tracking-wide;
  @apply uppercase;
  @apply mb-6;
}
.cast-credit-section {
  @apply py-4;
  @apply text-center;
}
</style>

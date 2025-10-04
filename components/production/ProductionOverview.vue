<template>
  <div class="flex flex-wrap p-4 lg:flex-nowrap gap-4 justify-evenly">
    <div
      class="flex-none order-1 w-full text-center sm:w-auto lg:mb-0 lg:w-auto"
    >
      <production-poster-image
        ref="poster-image"
        class="inline-block max-h-80"
        :image-object="production.posterImage"
        alt="show poster"
      />
    </div>
    <tip-tap-output
      class="flex-grow order-3 mt-4 lg:order-2 lg:mt-0 break-words min-w-0"
      :html="production.description"
    />
    <div class="sm:w-auto lg:order-3 lg:w-1/3 w-full">
      <!-- Side Information Bar -->
      <div class="flex flex-col order-2 p-5 bg-sta-gray-dark space-y-2">
        <h3 class="text-xl font-semibold uppercase">Show Information</h3>
        <p v-if="medium"><strong>Medium:</strong> {{ medium }}</p>
        <p v-if="production.ageRating" ref="age-rating">
          Ages {{ production.ageRating }}+
        </p>
        <p>
          A production by
          <NuxtLink
            class="hover:text-gray-300 font-semibold"
            :to="`/society/${production.society.slug}`"
          >
            {{ production.society.name }}
          </NuxtLink>
        </p>
        <a
          v-if="production.facebookEvent"
          ref="facebook-link"
          :href="production.facebookEvent"
          class="text-sta-green font-semibold uppercase"
          target="_blank"
        >
          <icon-list-item :icon="['fab', 'facebook']">
            Facebook Event
          </icon-list-item>
        </a>
        <div
          v-if="production.contentWarnings.length > 0"
        >
          <h3 class="font-semibold">Content Warnings</h3>
          <p class="text-sm w-fit text-white/75">
            We recognise that aspects of this performance may cause distress or
            challenging emotions for some of our audience members. Click below
            if you would like to see the content warnings for this show (may
            contain 'spoilers').
          </p>
          <UButton
            ref="warnings"
            color="success"
            class="mt-2 p-2 btn btn-rouge w-full justify-center"
            @click="showContentWarningsDetail = true"
          >
            View Content Warnings
            <font-awesome-icon class="px-2" icon="chevron-right" />
          </UButton>
          <content-warnings-display
            v-if="showContentWarningsDetail"
            :content-warnings="production.contentWarnings"
            :contact-email="production.contactEmail"
            @close="showContentWarningsDetail = false"
          />
        </div>
        <div
          v-if="production.productionAlert"
          ref="production-alert"
          class="bg-sta-rouge-dark text-white text-sm p-2 flex flex-col rounded-sm space-y-1"
        >
          <div class="flex items-center justify-center text-lg gap-2">
            <font-awesome-icon icon="warning" />
            <h3 class="font-bold">Production Alert</h3>
          </div>
          <p class="mb-2">
            {{
              /[.!?]$/.test(production.productionAlert)
                ? production.productionAlert
                : production.productionAlert + '.'
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentWarningsDisplay from './content-warnings/ContentWarningsDisplay.vue';
import ProductionPosterImage from './ProductionPosterImage.vue';
import TipTapOutput from '~~/components/ui/UiTipTapOutput.vue';
import IconListItem from '~~/components/ui/UiIconListItem.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export default {
  components: {
    FontAwesomeIcon,
    IconListItem,
    TipTapOutput,
    ContentWarningsDisplay,
    ProductionPosterImage
  },
  props: {
    production: { required: true, type: Object }
  },
  data() {
    return {
      showContentWarningsDetail: false
    };
  },
  computed: {
    medium() {
      if (!this.production.performances.edges.length) {
        return null;
      }
      if (this.hasOnlinePerformances && this.hasInPersonPerformances) {
        return 'In Person + Online';
      }
      if (this.hasOnlinePerformances) {
        return 'Online Only';
      }
      return 'In Person Only';
    },
    hasOnlinePerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isOnline
      );
    },
    hasInPersonPerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isInperson
      );
    }
  }
};
</script>

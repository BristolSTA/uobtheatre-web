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
    <div class="sm:w-auto lg:order-3 lg:w-1/3 w-full flex-none">
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
        <button
          v-if="production.contentWarnings.length || production.productionAlert"
          ref="warnings"
          class="p-3 bg-sta-rouge rounded-md hover:bg-sta-rouge-dark transition-colors flex gap-1 items-center flex-wrap justify-center"
          @click="showContentWarningsDetail = true"
        >
          This production has {{ warningsDisplay }}.
          <div
            class="text-right min-w-max flex items-center justify-items-center gap-1"
          >
            See More <font-awesome-icon icon="chevron-right" />
          </div>
        </button>
      </div>
    </div>
  </div>
  <modal
    v-if="showContentWarningsDetail"
    @close="showContentWarningsDetail = false"
  >
    <!-- Show Warning Information Pop-Up -->
    <div ref="warning-modal" class="lg:w-1/3-screen">
      <div v-if="production.productionAlert">
        <h2 class="text-lg font-semibold">Production Alert</h2>
        <p>
          {{
            /[.!?]$/.test(production.productionAlert)
              ? production.productionAlert
              : production.productionAlert + '.'
          }}
          For more information, please contact
          <a :href="`mailto:${production.contactEmail}`" class="underline">{{
            production.contactEmail
          }}</a
          >.
        </p>
      </div>
      <hr
        v-if="production.contentWarnings.length && production.productionAlert"
        class="my-1 border-sta-gray-light"
      />
      <div v-if="production.contentWarnings.length">
        <h2 class="text-lg font-semibold">Content Warnings</h2>
        <p>
          This production features content warnings that may make it unsuitable
          or distressing to viewers. For more information, please contact
          <a :href="`mailto:${production.contactEmail}`" class="underline">{{
            production.contactEmail
          }}</a
          >.
        </p>
        <hr class="my-1 border-sta-gray-light" />
        <content-warnings-display
          :content-warnings="production.contentWarnings"
        />
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '../ui/Modal.vue';
import ContentWarningsDisplay from './content-warnings/ContentWarningsDisplay.vue';
import ProductionPosterImage from './ProductionPosterImage.vue';
import TipTapOutput from '~~/components/ui/UiTipTapOutput.vue';
import IconListItem from '~~/components/ui/UiIconListItem.vue';
export default {
  components: {
    IconListItem,
    TipTapOutput,
    Modal,
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
    },
    warningsDisplay() {
      let warningDisplay = '';
      if (this.production.productionAlert) {
        warningDisplay += 'an alert';
        if (this.production.contentWarnings.length) {
          warningDisplay += ' and ';
        }
      }
      if (this.production.contentWarnings.length) {
        warningDisplay +=
          this.production.contentWarnings.length === 1
            ? 'a content warning'
            : 'content warnings';
      }
      return warningDisplay;
    }
  }
};
</script>

<template>
  <div class="min-h-full bg-sta-gray">
    <Head>
      <Title>Book {{ production.name }}</Title>
    </Head>
    <production-draft-warning-banner :production="production" />
    <div class="container">
      <production-banner
        class="pb-2 md:pb-8"
        :production="production"
        :show-buy-tickets-button="false"
        :show-detailed-info="false"
      />
      <div class="flex flex-wrap mb-2 md:flex-nowrap md:space-x-2">
        <div class="md:flex-none md:w-1/4 w-full flex-col">
          <booking-navigation
            class="hidden md:flex"
            :current-stage-index="currentStageIndex"
            :production="production"
            :booking="booking"
            @goto-stage="navigateToStage"
          />
          <div
            v-if="currentStage"
            class="mb-1 text-center md:hidden flex items-center"
          >
            <clickable-link
              v-if="currentStageIndex > 0"
              class="text-white flex-1"
              @click="gotoPreviousStage"
            >
              <font-awesome-icon icon="chevron-left" class="fa-2x" />
            </clickable-link>
            <h1
              class="text-sta-green text-h2 sm:text-h1 justify-center flex-auto"
            >
              {{ currentStage.name }}
            </h1>
            <div class="flex-1" />
          </div>
          <div
            v-if="booking.raw && booking.raw.expiresAt"
            class="p-2 bg-sta-green-dark my-2 rounded text-center shadow-inner"
          >
            You have
            <strong>
              <time-remaining-countdown
                :expires-at="booking.raw.expiresAt"
                @finished="bookingExpired"
              />
            </strong>
            to complete this booking
          </div>
        </div>

        <div
          id="booking-view"
          class="flex-grow sm:pb-4 max-w-full bg-sta-gray-dark sm:p-3"
        >
          <NuxtPage
            data-test="nuxt-page"
            :production="production"
            :booking="booking"
            :ticket-matrix="ticketMatrix"
            @mounted="onChildMount"
            @select-performance="onSelectPerformance"
            @next-stage="navigateToStage()"
            @paid="paid = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import {
  getNextStage,
  getPreviousStage,
  getStageIndex
} from './book/-bookingStages';
import Booking from '~~/classes/Booking';
import TicketsMatrix from '~~/classes/TicketsMatrix';
import BookingNavigation from '@/components/booking/BookingNavigation.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import DeleteBookingMutation from '@/graphql/mutations/booking/DeleteBooking.gql';
import ProductionDraftWarningBanner from '@/components/production/ProductionDraftWarningBanner.vue';
import { swal } from '~~/utils/alerts';

import ProductionBasicInfoFragment from '@/graphql/fragments/production/ProductionBasicInfoFragment.gql';
import ProductionPerformancesFragment from '@/graphql/fragments/production/ProductionPerformancesFragment.gql';
import TimeRemainingCountdown from '@/components/ui/Formatters/TimeRemainingCountdown.vue';
import {
  PerformanceTicketOptionsDocument,
  UserDraftBookingForPerformanceDocument
} from '~~/graphql/codegen/operations';
import { defineBreadcrumbs } from '~~/composables/defineBreadcrumbs';
import { events, recordEvent } from '~~/utils/analytics';

definePageMeta({
  middleware: 'authed'
});

export default defineNuxtComponent({
  components: {
    BookingNavigation,
    ProductionDraftWarningBanner,
    ProductionBanner,
    ClickableLink,
    TimeRemainingCountdown
  },
  async beforeRouteLeave(_, __, next) {
    if (!this.booking.id || this.paid) {
      return next();
    }

    const { isDismissed } = await swal.fire({
      title: "You haven't finished your booking!",
      text: "You haven't yet paid for your booking. If you leave now, your reserved tickets will be released back for sale. Are you sure you want to leave?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Abandon Booking',
      confirmButtonColor: '#d94519',
      cancelButtonText: 'Keep editing'
    });

    if (isDismissed) {
      return next(false);
    }

    // Delete their booking
    useDefaultApolloClient().mutate({
      mutation: DeleteBookingMutation,
      variables: {
        bookingId: this.booking.id
      }
    });

    recordEvent(events.booking.abandoned);

    return next();
  },
  setup() {
    const { breadcrumbs } = defineBreadcrumbs();
    return { breadcrumbs };
  },
  async asyncData() {
    const { data } = await useDefaultApolloClient().query({
      query: gql`
        query production($slug: String!) {
          production(slug: $slug) {
            ...ProductionBasicInfo
            ...ProductionPerformances
          }
        }
        ${ProductionBasicInfoFragment}
        ${ProductionPerformancesFragment}
      `,
      variables: {
        slug: useRoute().params.slug
      }
    });

    const production = data.production;
    if (!production) {
      throw createSafeError({
        statusCode: 404,
        message: 'This production does not exist'
      });
    }

    return {
      production
    };
  },
  data() {
    return {
      booking: new Booking(),
      ticketMatrix: null,
      previousBooking: null,
      currentStage: null,
      paid: false
    };
  },
  head() {
    return {
      script: [
        { src: useRuntimeConfig().public.services.square.script, defer: 'true' }
      ]
    };
  },
  computed: {
    currentStageIndex() {
      return getStageIndex(this.currentStage);
    }
  },
  mounted() {
    this.breadcrumbs = [
      { text: "What's On", path: '/productions' },
      {
        text: this.production.name,
        path: `/production/${this.production.slug}`
      },
      { text: 'Book' }
    ];
  },
  methods: {
    bookingExpired() {
      const production = this.production;

      // Clear away all of the data
      this.loadDataForStage();

      // Set the booking to a blank one
      this.booking = new Booking();

      // Record the event
      recordEvent(events.booking.expried);

      // Display popup to user
      swal
        .fire({
          title: 'Booking Expired',
          text: "Sorry! Your booking has expired. We do this to ensure that tickets aren't reserved for too long.",
          confirmButtonText: 'Create a new booking',
          cancelButtonText: 'Return to home',
          showCancelButton: true,
          showConfirmButton: true
        })
        .then(({ isDismissed }) => {
          if (isDismissed) {
            return useRouter().push('/');
          }
          return useRouter().push(`/production/${production.slug}/book`);
        });
    },
    onChildMount(stageInfo) {
      this.currentStage = stageInfo;

      this.loadDataForStage();
      if (!this.currentStage.shouldBeUsed(this.production, this.booking)) {
        return this.navigateToStage(null, true);
      }
      if (!this.currentStage.eligable(this.production, this.booking)) {
        return this.gotoPreviousStage();
      }
    },
    gotoPreviousStage() {
      this.navigateToStage(
        getPreviousStage(this.currentStageIndex, this.production, this.booking)
      );
    },
    navigateToStage(stage = null, replace = false) {
      if (!stage) {
        stage = getNextStage(
          this.currentStageIndex,
          this.production,
          this.booking
        );
      }

      useRouter()[replace ? 'replace' : 'push']({
        name: stage.stageInfo.routeName,
        hash: '#booking-view',
        params: {
          slug: this.production.slug,
          performanceId: this.booking.performance
            ? this.booking.performance.id
            : null
        }
      });
    },
    loadDataForStage() {
      if (useRoute().params.performanceId) {
        // Check if user already has a draft booking for this performance if not already
        if (this.previousBooking === null) {
          useDefaultApolloClient()
            .query({
              query: UserDraftBookingForPerformanceDocument,
              variables: {
                performanceID: useRoute().params.performanceId
              },
              fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
              this.previousBooking = data.me.bookings.edges.length
                ? data.me.bookings.edges[0].node
                : false;

              if (this.previousBooking) {
                swal
                  .fire({
                    title: 'Resume previous booking?',
                    text: 'You previously started a booking for this performance. Would you like to resume it?',
                    showCancelButton: true,
                    confirmButtonText: 'Resume',
                    cancelButtonText: 'No, start fresh'
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      recordEvent(events.booking.resumed);
                      this.booking.updateFromAPIData(this.previousBooking);
                    }
                  });
              }
            });
        }

        if (!this.booking.performance) {
          this.booking.performance = this.production.performances.edges
            .map((edge) => edge.node)
            .find(
              (performance) =>
                performance.id === useRoute().params.performanceId
            );
        }

        if (!this.ticketMatrix) {
          useDefaultApolloClient()
            .query({
              query: PerformanceTicketOptionsDocument,
              variables: {
                id: this.booking.performance.id
              }
            })
            .then((result) => {
              this.ticketMatrix = new TicketsMatrix(result.data.performance);
            });
        }
      }
    },
    onSelectPerformance(performance) {
      this.booking.performance = performance;
      this.booking.tickets = [];
      this.ticketMatrix = null;
      this.navigateToStage();
    }
  }
});
</script>

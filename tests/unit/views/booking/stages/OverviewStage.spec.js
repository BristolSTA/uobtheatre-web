import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

import Booking from '@/classes/Booking';
import BookingPriceOverview from '@/components/booking/overview/BookingPriceOverview.vue';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import UserOverview from '@/components/booking/overview/UserOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import OverviewStage from '@/views/booking/stages/OverviewStage.vue';

import FakeBooking from '../../../fixtures/FakeBooking.js';
import {
  executeWithServer,
  generateMountOptions,
  runApolloQuery,
} from '../../../helpers';

describe('Overview Stage', () => {
  let overviewComponent;
  let production;
  let booking = new Booking();

  beforeEach(async () => {
    await executeWithServer(async (server) => {
      let bookingModel = FakeBooking(server);

      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      });

      booking.updateFromAPIData(data.booking);
      production = data.booking.performance.production;

      overviewComponent = shallowMount(
        OverviewStage,
        generateMountOptions(['router'], {
          propsData: {
            production: production,
            booking: booking,
          },
        })
      );
    });
  });

  it('contains correct overview components', async () => {
    expect(overviewComponent.findComponent(PerformanceOverview).exists()).to.be
      .true;
    expect(overviewComponent.findComponent(VenueOverview).exists()).to.be.true;
    expect(overviewComponent.findComponent(UserOverview).exists()).to.be.true;
    expect(overviewComponent.findComponent(TicketsOverview).exists()).to.be
      .true;
    expect(overviewComponent.findComponent(BookingPriceOverview).exists()).to.be
      .true;
  });

  it('emits not eligible when booking dirty', async () => {
    booking.clearTickets();

    overviewComponent = await shallowMount(
      OverviewStage,
      generateMountOptions(['router'], {
        propsData: {
          production: production,
          booking: booking,
        },
      })
    );
    expect(overviewComponent.emitted('stage-unable')).to.be.ok;
  });
});

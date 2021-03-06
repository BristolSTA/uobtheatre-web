import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

import Booking from '@/classes/Booking';
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import ViewBooking from '@/views/user/ViewBooking.vue';

import FakeBooking from '../../fixtures/FakeBooking.js';
import {
  executeWithServer,
  generateMountOptions,
  runApolloQuery,
} from '../../helpers';

describe('Overview Stage', () => {
  let overviewComponent;
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
      let bookingData = Object.assign({}, data.booking, {
        status: 'PAID',
        bookingReference: 'ABS1352EBV54',
      });
      booking.updateFromAPIData(bookingData);
    });

    overviewComponent = await shallowMount(
      ViewBooking,
      generateMountOptions(['router'], {
        params: {
          bookingRef: 1,
        },
      })
    );
  });

  it('contains correct overview components', async () => {
    expect(overviewComponent.findComponent(PerformanceOverview).exists()).to.be
      .true;
    expect(overviewComponent.findComponent(VenueOverview).exists()).to.be.true;
    expect(overviewComponent.findComponent(TicketsOverview).exists()).to.be
      .true;
    expect(overviewComponent.findComponent(PaymentOverview).exists()).to.be
      .true;
  });
});

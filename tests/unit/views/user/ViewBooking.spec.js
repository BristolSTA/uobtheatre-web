import { expect } from 'chai';

import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import ViewBooking from '@/views/user/ViewBooking.vue';

import FakeBooking from '../../fixtures/FakeBooking.js';
import {
  executeWithServer,
  generateMountOptions,
  mountWithRouterMock,
  seedAndAuthAsUser,
  waitFor,
} from '../../helpers';

describe('View Booking', () => {
  let component, server;

  beforeAll(async () => {
    server = await executeWithServer(async (server) => {
      let user = seedAndAuthAsUser(server);
      FakeBooking(
        server,
        {
          user,
        },
        true
      );
    }, false);
  });

  afterAll(() => {
    server.shutdown();
  });

  beforeEach(async () => {
    component = await mountWithRouterMock(
      ViewBooking,
      generateMountOptions(['apollo']),
      {
        params: {
          bookingRef: 'ABS1352EBV54',
        },
      }
    );
    await waitFor(() => component.vm.booking.performance);
    await component.vm.$nextTick();
  });

  it('contains correct components', async () => {
    expect(component.findComponent(PerformanceOverview).exists()).to.be.true;
    expect(component.findComponent(VenueOverview).exists()).to.be.true;
    expect(component.findComponent(TicketsOverview).exists()).to.be.true;
    expect(component.findComponent(PaymentOverview).exists()).to.be.true;
  });
});

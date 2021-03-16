import { expect } from 'chai';

import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import Ticket from '@/components/booking/Ticket.vue';
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
import ViewBooking from '@/views/user/ViewBooking.vue';

import FakeBooking from '../../fixtures/FakeBooking.js';
import {
  assertNoVisualDifference,
  executeWithServer,
  generateMountOptions,
  mountWithRouterMock,
  seedAndAuthAsUser,
  waitFor,
} from '../../helpers';

describe('View Booking', () => {
  let viewBookingComponent, server;

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
    viewBookingComponent = await mountWithRouterMock(
      ViewBooking,
      generateMountOptions(['apollo'], {
        mocks: {
          $store: {
            state: {
              auth: {
                user: {
                  firstName: 'Alex',
                  lastName: 'Toof',
                },
              },
            },
          },
        },
        stubs: { 'qrcode-vue': true },
      }),
      {
        params: {
          bookingRef: 'ABS1352EBV54',
        },
      }
    );
    await waitFor(() => viewBookingComponent.vm.booking.performance);
    await viewBookingComponent.vm.$nextTick();
  });

  it('contains correct components', async () => {
    expect(viewBookingComponent.findComponent(PerformanceOverview).exists()).to
      .be.true;
    expect(viewBookingComponent.findComponent(VenueOverview).exists()).to.be
      .true;
    expect(viewBookingComponent.findComponent(TicketsOverview).exists()).to.be
      .true;
    expect(viewBookingComponent.findComponent(PaymentOverview).exists()).to.be
      .true;
  });

  it('has correct breadcrumbs', async () => {
    let breadcrumbs = viewBookingComponent.findComponent(Breadcrumbs);
    expect(breadcrumbs.exists()).to.be.true;

    assertNoVisualDifference(breadcrumbs.props('crumbs'), [
      { text: 'My Account', route: { name: 'user' } },
      { text: 'Booking Details' },
    ]);
  });

  it('has working ticket dropdown', async () => {
    let ticketbanner = viewBookingComponent.findComponent({ ref: 'tickets' });

    expect(viewBookingComponent.vm.expanded).to.be.false;
    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(0);

    await ticketbanner.trigger('click');

    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(4);

    await ticketbanner.trigger('click');
    expect(viewBookingComponent.vm.expanded).to.be.false;
    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(0);
  });

  it('scrolls to tickets on btn', () => {
    viewBookingComponent.vm.$refs.tickets.scrollIntoView = jest.fn();
    expect(viewBookingComponent.vm.expanded).to.be.false;

    viewBookingComponent.find('#ticket-jump').trigger('click');
    expect(viewBookingComponent.vm.expanded).to.be.true;
    expect(
      viewBookingComponent.vm.$refs.tickets.scrollIntoView.mock.calls
    ).length(1);
  });
});

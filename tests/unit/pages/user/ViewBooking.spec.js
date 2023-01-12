import { expect, vi } from 'vitest';
import { mount } from '#testSupport/helpers';
import {
  GenericApolloResponse,
  GenericNodeConnection
} from '#testSupport/helpers/api';

import FakeBooking from '#testSupport/fixtures/Booking.js';
import User from '#testSupport/fixtures/User.js';
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import Ticket from '@/components/booking/Ticket.vue';
import ViewBooking from '@/pages/user/booking/[reference]/index.vue';

describe('View Booking', () => {
  let viewBookingComponent;

  beforeEach(async () => {
    viewBookingComponent = await mount(ViewBooking, {
      apollo: {
        queryResponses: [
          GenericApolloResponse(
            'me',
            User({
              bookings: GenericNodeConnection([FakeBooking()])
            })
          )
        ]
      },
      pinia: {
        initialState: {
          auth: {
            user: {
              firstName: 'Alex',
              lastName: 'Toof'
            }
          }
        }
      },
      routeInfo: {
        params: {
          reference: 'ABS1352EBV54'
        }
      }
    });
  });

  it('contains correct components', () => {
    expect(viewBookingComponent.findComponent(PerformanceOverview).exists()).to
      .be.true;
    expect(viewBookingComponent.findComponent(VenueOverview).exists()).to.be
      .true;
    expect(viewBookingComponent.findComponent(TicketsOverview).exists()).to.be
      .true;
    expect(viewBookingComponent.findComponent(PaymentOverview).exists()).to.be
      .true;
  });

  it('has working ticket dropdown', async () => {
    const ticketbanner = viewBookingComponent.find({ ref: 'tickets' });

    expect(viewBookingComponent.vm.expanded).to.be.false;
    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(0);

    await ticketbanner.trigger('click');

    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(1);

    await ticketbanner.trigger('click');
    expect(viewBookingComponent.vm.expanded).to.be.false;
    expect(viewBookingComponent.findAllComponents(Ticket).length).to.eq(0);
  });

  it('scrolls to tickets on btn', () => {
    viewBookingComponent.vm.$refs.tickets.scrollIntoView = vi.fn();
    expect(viewBookingComponent.vm.expanded).to.be.false;

    viewBookingComponent.find('#ticket-jump').trigger('click');
    expect(viewBookingComponent.vm.expanded).to.be.true;
    expect(
      viewBookingComponent.vm.$refs.tickets.scrollIntoView.mock.calls
    ).length(1);
  });
});

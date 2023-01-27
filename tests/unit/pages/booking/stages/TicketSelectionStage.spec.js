import { expect } from 'vitest';
import { mount } from '#testSupport/helpers';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import TicketsMatrix from '@/classes/TicketsMatrix';
import TicketSelectionStage from '@/pages/production/[slug]/book/[performanceId]/tickets.vue';
import SelectedTicketsTable from '@/components/booking/SelectedTicketsTable.vue';
import TicketOptions from '@/components/booking/TicketOptions.vue';

import FullBooking from '#testSupport/fixtures/instances/FullBooking';
import {
  GenericApolloResponse,
  GenericMutationResponse
} from '#testSupport/helpers/api';
import { flushPromises } from '@vue/test-utils';

describe('Ticket Selection Stage', () => {
  let stageComponent;
  let ticketTypes;
  let production;
  let performance;

  async function mountComponent(mutationResponses) {
    const bookingMock = FullBooking();
    production = bookingMock.performance.production;
    performance = bookingMock.performance;

    ticketTypes = new TicketsMatrix(performance);
    const booking = new Booking();
    booking.performance = performance;

    stageComponent = await mount(TicketSelectionStage, {
      shallow: false,
      apollo: {
        mutationResponses
      },
      propsData: {
        production,
        booking,
        ticketMatrix: ticketTypes
      }
    });
  }

  beforeEach(async () => {
    await mountComponent();
  });

  it('displays the available seat locations', () => {
    expect(stageComponent.findComponent(TicketOptions).exists()).to.be.true;
    expect(
      stageComponent.findComponent(TicketOptions).props('ticketMatrix')
    ).to.eq(stageComponent.vm.ticketMatrix);
    expect(stageComponent.findComponent(TicketOptions).props('booking')).to.eq(
      stageComponent.vm.booking
    );
  });

  it('reacts to request update event', async () => {
    await mountComponent([
      GenericApolloResponse(
        'booking',
        GenericMutationResponse({ booking: FullBooking({ tickets: [] }) })
      )
    ]);
    expect(stageComponent.vm.booking.dirty).to.be.true;
    await stageComponent
      .findComponent(TicketOptions)
      .vm.$emit('request-update');

    await flushPromises();

    expect(stageComponent.vm.booking.dirty).to.be.false;
  });

  describe('with selected tickets', () => {
    beforeEach(async () => {
      const booking = new Booking();
      booking.performance = performance;
      booking.tickets = [
        new Ticket(
          performance.ticketOptions[0].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[0].concessionType.id
        ),
        new Ticket(
          performance.ticketOptions[0].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[0].concessionType.id
        ),
        new Ticket(
          performance.ticketOptions[0].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[1].concessionType.id
        ),
        new Ticket(
          performance.ticketOptions[1].seatGroup.id,
          performance.ticketOptions[0].concessionTypes[1].concessionType.id
        )
      ];
      await stageComponent.setProps({
        booking
      });
    });

    it('displays selected tickets', () => {
      expect(stageComponent.findComponent(SelectedTicketsTable).exists()).to.be
        .true;
      expect(
        stageComponent.findComponent(SelectedTicketsTable).props('booking')
      ).to.eq(stageComponent.vm.booking);
      expect(
        stageComponent.findComponent(SelectedTicketsTable).props('ticketMatrix')
      ).to.eq(stageComponent.vm.ticketMatrix);
    });
  });
});

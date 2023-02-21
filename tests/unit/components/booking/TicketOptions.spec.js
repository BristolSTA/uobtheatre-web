import { mount } from '#testSupport/helpers';
import { expect, vi } from 'vitest';
import lo from 'lodash';
import FullBooking from '#testSupport/fixtures/instances/FullBooking';
import TicketOptions from '@/components/booking/TicketOptions.vue';
import SeatGroup from '@/components/booking/SeatGroup.vue';
import Booking from '~~/classes/Booking';
import TicketsMatrix from '@/classes/TicketsMatrix';
import Ticket from '@/classes/Ticket';

describe('Ticket Options', () => {
  let component;
  beforeEach(async () => {
    component = await mount(TicketOptions, {
      props: {
        booking: Booking.fromAPIData(FullBooking()),
        ticketMatrix: new TicketsMatrix(FullBooking().performance)
      }
    });
  });

  it('displays available seat locations', async () => {
    const seatGroupComponents = component.findAllComponents(SeatGroup);
    expect(seatGroupComponents.length).to.eq(2);
    expect(
      seatGroupComponents.at(0).props('ticketOption').seatGroup.name
    ).to.eq('Best seats in the house');
    expect(
      seatGroupComponents.at(1).props('ticketOption').seatGroup.name
    ).to.eq('The Meh Seats');
    expect(seatGroupComponents.at(1).props('discounts').length).to.eq(1);

    // NB: Current tickets == all the tickets in the booking
    expect(seatGroupComponents.at(1).props('currentTickets').length).to.eq(4);

    expect(seatGroupComponents.at(1).props('groupCapacityRemaining')).to.eq(11);

    component.vm.ticketMatrix.performanceCapacityRemaining = 5;
    await component.vm.$forceUpdate();

    expect(seatGroupComponents.at(1).props('groupCapacityRemaining')).to.eq(5);

    await component.vm.booking.tickets.push(
      new Ticket(
        FullBooking().performance.ticketOptions[0].seatGroup.id,
        FullBooking().performance.ticketOptions[0].concessionTypes[0].concessionType.id
      )
    );

    expect(seatGroupComponents.at(1).props('currentTickets').length).to.eq(5);
  });

  it('reacts to select location event and toggles accordion', async () => {
    // By default, all should be collpased
    const seatGroupComponents = component.findAllComponents(SeatGroup);
    expect(
      !seatGroupComponents.at(0).props('expanded') &&
        !seatGroupComponents.at(0).props('expanded')
    ).to.be.true;

    await seatGroupComponents.at(0).vm.$emit('select-location');

    expect(seatGroupComponents.at(0).props('expanded')).to.be.true;
    expect(seatGroupComponents.at(1).props('expanded')).to.be.false;

    await seatGroupComponents.at(1).vm.$emit('select-location');
    expect(seatGroupComponents.at(0).props('expanded')).to.be.false;
    expect(seatGroupComponents.at(1).props('expanded')).to.be.true;

    await seatGroupComponents.at(1).vm.$emit('select-location');
    expect(seatGroupComponents.at(0).props('expanded')).to.be.false;
    expect(seatGroupComponents.at(1).props('expanded')).to.be.false;
  });

  it('reacts to add ticket event', async () => {
    component.vm.interaction_timer = vi.fn();
    await component
      .findComponent(SeatGroup)
      .vm.$emit(
        'add-ticket',
        component.vm.ticketMatrix.ticketOptions[0].seatGroup,
        component.vm.ticketMatrix.ticketOptions[0].concessionTypes[0]
          .concessionType
      );
    expect(component.vm.booking.tickets.length).to.eq(5);
    expect(component.vm.booking.tickets[0].seatGroup.id).to.eq(1);
    expect(component.vm.booking.tickets[0].concessionType.id).to.eq(1);
    expect(component.vm.interaction_timer.mock.calls.length).to.eq(1);
  });

  it('reacts to add ticket event (multiple)', async () => {
    component.vm.interaction_timer = vi.fn();
    await component
      .findComponent(SeatGroup)
      .vm.$emit(
        'add-ticket',
        component.vm.ticketMatrix.ticketOptions[0].seatGroup,
        component.vm.ticketMatrix.ticketOptions[0].concessionTypes[0]
          .concessionType,
        3
      );
    expect(component.vm.booking.tickets.length).to.eq(3 + 4);
    expect(component.vm.booking.tickets[0].seatGroup.id).to.eq(1);
    expect(component.vm.booking.tickets[0].concessionType.id).to.eq(1);
    expect(component.vm.interaction_timer.mock.calls.length).to.eq(1);
  });

  it('reacts to set ticket number event', async () => {
    component.vm.interaction_timer = vi.fn();

    // Set to have 3 Best Seat Adults (from 2)
    await component
      .findComponent(SeatGroup)
      .vm.$emit(
        'set-tickets',
        component.vm.ticketMatrix.ticketOptions[0].seatGroup,
        component.vm.ticketMatrix.ticketOptions[0].concessionTypes[0]
          .concessionType,
        3
      );
    expect(component.vm.booking.tickets.length).to.eq(5);
    expect(component.vm.booking.tickets[0].seatGroup.id).to.eq(1);
    expect(component.vm.booking.tickets[0].concessionType.id).to.eq(1);
    expect(component.vm.interaction_timer.mock.calls.length).to.eq(1);
  });

  it('reacts to remove ticket event', async () => {
    component.vm.interaction_timer = vi.fn();
    component.vm.booking.tickets = [
      new Ticket(
        FullBooking().performance.ticketOptions[0].seatGroup.id,
        FullBooking().performance.ticketOptions[0].concessionTypes[0].concessionType.id
      )
    ];
    await component
      .findComponent(SeatGroup)
      .vm.$emit(
        'remove-ticket',
        component.vm.ticketMatrix.ticketOptions[0].seatGroup,
        component.vm.ticketMatrix.ticketOptions[0].concessionTypes[0]
          .concessionType
      );
    expect(component.vm.booking.tickets.length).to.eq(0);
    expect(component.vm.interaction_timer.mock.calls.length).to.eq(1);
  });

  it('calls update API once interaction timer debounced', async () => {
    vi.spyOn(lo, 'debounce');

    component = await mount(TicketOptions, {
      props: {
        booking: component.vm.booking,
        ticketMatrix: component.vm.ticketMatrix
      }
    });
    expect(lo.debounce.mock.calls.length).to.eq(1);
    expect(lo.debounce.mock.calls[0][0]).to.eq(component.vm.requestUpdate);
    expect(lo.debounce.mock.calls[0][1]).to.eq(2000);

    lo.debounce.mockReset();
  });

  it('emits request update event when triggered', () => {
    component.vm.requestUpdate();
    expect(component.emitted()['request-update'].length).to.eq(1);
  });
});

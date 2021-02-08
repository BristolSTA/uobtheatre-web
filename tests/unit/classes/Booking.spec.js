import { expect } from 'chai';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import TicketsMatrix from '@/classes/TicketsMatrix';

import FakePriceBreakdown from '../fixtures/FakePriceBreakdown';
import FakeTicketOption from '../fixtures/FakeTicketOption';
import FakeTickets from '../fixtures/FakeTickets';
import {
  assertNoVisualDifference,
  createFromFactoryAndSerialize,
  executeWithServer,
} from '../helpers';
describe('Booking Class', () => {
  /** @member {Booking} */
  let booking;
  let seat_group;
  let concession_100_edge;
  let concession_1000_edge;
  let concession_500_edge;
  let tickets_matrix;

  beforeAll(() => {
    executeWithServer((server) => {
      seat_group = createFromFactoryAndSerialize(
        'seatGroupNode',
        1,
        undefined,
        server
      );
      concession_100_edge = createFromFactoryAndSerialize(
        'concessionTypeBookingType',
        1,
        {
          price: 100,
        },
        server
      );
      concession_1000_edge = createFromFactoryAndSerialize(
        'concessionTypeBookingType',
        1,
        {
          price: 1000,
        },
        server
      );
      concession_500_edge = createFromFactoryAndSerialize(
        'concessionTypeBookingType',
        1,
        {
          price: 500,
        },
        server
      );
    });

    let ticketOption = (() => FakeTicketOption)();
    ticketOption.seatGroup = seat_group;
    ticketOption.concessionTypes = [
      concession_1000_edge,
      concession_100_edge,
      concession_500_edge,
    ];

    tickets_matrix = new TicketsMatrix({
      capacityRemaining: 100,
      ticketOptions: [ticketOption],
    });
  });

  beforeEach(() => {
    booking = new Booking();
  });

  let fakeTicket = (concessionEdge = null) => {
    return new Ticket(
      seat_group.id,
      concessionEdge
        ? concessionEdge.concessionType.id
        : concession_100_edge.concessionType.id
    );
  };

  it('can be constructed from API data', () => {
    let apiData = {
      priceBreakdown: FakePriceBreakdown,
    };
    let booking = Booking.fromAPIData(apiData);
    expect(booking).to.be.instanceOf(Booking);
    expect(booking.price_breakdown).to.eq(FakePriceBreakdown);

    apiData = {
      priceBreakdown: FakePriceBreakdown,
      tickets: [FakeTickets[0], FakeTickets[0], FakeTickets[1]],
    };
    booking = Booking.fromAPIData(apiData);
    expect(booking).to.be.instanceOf(Booking);
    expect(booking.tickets.length).to.eq(3);
    expect(booking.dirty).to.be.false;
  });
  it('can get tickets', () => {
    expect(booking.tickets).to.be.instanceOf(Array);
    expect(booking.tickets).to.be.empty;

    booking.tickets.push(['An Item']);

    expect(booking.tickets.length).to.eq(1);
  });
  it('can add a ticket', () => {
    let ticket = fakeTicket();
    booking.addTicket(ticket, tickets_matrix);
    expect(booking.tickets).to.include(ticket);
    expect(booking.dirty).to.be.true;
  });

  it('can set number of tickets', () => {
    booking.setTicketCount(seat_group, concession_100_edge, 10, tickets_matrix);
    expect(booking.ticketCount(seat_group, concession_100_edge)).to.eq(10);

    booking.setTicketCount(seat_group, concession_100_edge, 5, tickets_matrix);
    expect(booking.ticketCount(seat_group, concession_100_edge)).to.eq(5);

    booking.setTicketCount(seat_group, concession_100_edge, 0, tickets_matrix);
    expect(booking.ticketCount(seat_group, concession_100_edge)).to.eq(0);
    expect(booking.dirty).to.be.true;
  });

  describe('Matching Tickets', () => {
    let ticket1;
    let ticket2;
    let ticket3;
    let ticket4;
    beforeEach(() => {
      ticket1 = fakeTicket(concession_100_edge);
      ticket2 = fakeTicket(concession_1000_edge);
      ticket3 = fakeTicket(concession_500_edge);
      ticket4 = new Ticket(2, concession_100_edge.concessionType.id);
      booking.tickets = [ticket1, ticket2, ticket3, ticket4];
    });

    it('can find matching tickets', () => {
      expect(booking.findTickets()).to.include(
        ticket1,
        ticket2,
        ticket3,
        ticket4
      );

      expect(booking.findTickets({ id: 2 })).to.include(ticket4);
      expect(booking.findTickets(null, concession_100_edge)).to.include(
        ticket1,
        ticket4
      );
      expect(booking.findTickets({ id: 4 }, { id: 100 })).to.be.empty;
    });

    it('can find number of matching tickets', () => {
      expect(booking.ticketCount()).to.eq(4);

      expect(booking.ticketCount({ id: 2 })).to.eq(1);
      expect(booking.ticketCount(null, concession_100_edge)).to.eq(2);
      expect(booking.ticketCount({ id: 4 }, { id: 100 })).to.eq(0);
    });
  });

  it('can remove a single ticket', () => {
    let t1 = fakeTicket();
    let t2 = fakeTicket();
    let t3 = fakeTicket(concession_1000_edge);
    booking.tickets = [t1, t2, t3];

    booking.removeTicket(seat_group, concession_100_edge, tickets_matrix);

    expect(booking.tickets.length).to.eq(2);
    expect(booking.tickets).to.include(t1, t3);
    expect(booking.dirty).to.be.true;
  });

  it('can clear tickets', () => {
    booking.tickets = [1, 2, 3];

    booking.clearTickets();

    expect(booking.tickets.length).to.eq(0);
    expect(booking.dirty).to.be.true;
  });
  it('can get tickets total price estimate in pennies', () => {
    expect(booking.tickets_total_price_estimate(tickets_matrix)).to.eq(0);

    booking.tickets = [
      fakeTicket(concession_100_edge),
      fakeTicket(concession_1000_edge),
      fakeTicket(concession_500_edge),
    ];
    expect(booking.tickets_total_price_estimate(tickets_matrix)).to.eq(1600);
  });
  it('can get tickets total price estimate in pounds', () => {
    expect(booking.tickets_total_price_pounds_estimate(tickets_matrix)).to.eq(
      '0.00'
    );

    booking.tickets = [
      fakeTicket(concession_100_edge),
      fakeTicket(concession_1000_edge),
      fakeTicket(concession_500_edge),
    ];

    expect(booking.tickets_total_price_pounds_estimate(tickets_matrix)).to.eq(
      '16.00'
    );
  });
  it('can get total booking price in pounds', () => {
    expect(booking.total_price_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.total_price_pounds).to.eq('22.58');
  });
  it('can get sub total booking price in pounds', () => {
    expect(booking.sub_total_price_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.sub_total_price_pounds).to.eq('21.50');
  });
  it('can get tickets price in pounds', () => {
    expect(booking.tickets_price_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.tickets_price_pounds).to.eq('22.50');
  });
  it('can get tickets discounted price in pounds', () => {
    expect(booking.tickets_discounted_price_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.tickets_discounted_price_pounds).to.eq('21.50');
  });
  it('can tell if booking has discounts applied', () => {
    expect(booking.has_discounts).to.be.false;

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.has_discounts).to.be.true;
  });
  it('can get discounts value in pounds', () => {
    expect(booking.discounts_value_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.discounts_value_pounds).to.eq('1.00');
  });
  it('can get ticket overview', () => {
    expect(booking.ticket_overview(tickets_matrix)).to.be.empty;

    booking.price_breakdown = FakePriceBreakdown;
    booking.tickets = [fakeTicket(concession_100_edge)];

    expect(booking.dirty).to.be.true;
    expect(JSON.stringify(booking.ticket_overview(tickets_matrix))).to.equal(
      JSON.stringify(booking.ticket_overview_estimate(tickets_matrix))
    ); // Stringified here due to not being visually difference, but generated at different times through mapping

    booking.dirty = false;

    expect(booking.ticket_overview(tickets_matrix)).to.eq(
      FakePriceBreakdown.tickets
    );
  });
  it('can generate ticket overview estimate', () => {
    expect(booking.ticket_overview_estimate(tickets_matrix)).to.be.empty;

    booking.tickets = [
      fakeTicket(concession_100_edge),
      fakeTicket(concession_1000_edge),
      fakeTicket(concession_1000_edge),
      fakeTicket(concession_500_edge),
    ];
    expect(booking.ticket_overview_estimate(tickets_matrix).length).to.eq(3);
    expect(booking.ticket_overview_estimate(tickets_matrix)[0]).to.include({
      number: 1,
      totalPrice: 100,
      ticketPrice: 100,
    });
    expect(
      booking.ticket_overview_estimate(tickets_matrix)[0].seat_group
    ).to.include(seat_group);
    expect(
      booking.ticket_overview_estimate(tickets_matrix)[0].concession_type
    ).to.include(concession_100_edge.concessionType);
    expect(booking.ticket_overview_estimate(tickets_matrix)[1]).to.include({
      number: 2,
      totalPrice: 2000,
      ticketPrice: 1000,
    });
  });
  it('can get misc costs', () => {
    expect(booking.misc_costs).to.be.empty;

    booking.price_breakdown = FakePriceBreakdown;

    assertNoVisualDifference(booking.misc_costs, FakePriceBreakdown.miscCosts);
  });
});

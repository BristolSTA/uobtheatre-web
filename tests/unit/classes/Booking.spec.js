import { expect } from 'chai';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import { makeServer } from '@/fakeApi';

import FakePriceBreakdown from '../fixtures/FakePriceBreakdown';
import { createFromFactoryAndSerialize } from '../helpers';
describe('Booking Class', () => {
  /** @member {Booking} */
  let booking;
  let performance;
  let seat_group;
  let concession_100;
  let concession_1000;
  let concession_500;
  let ticket_types;

  beforeAll(async () => {
    let server = makeServer({ environment: 'test' });
    performance = createFromFactoryAndSerialize('performance', 1, null, server);
    seat_group = createFromFactoryAndSerialize(
      'seatGroup',
      1,
      {
        performance: server.schema.performances.first(),
      },
      server
    );
    concession_100 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
        id: 1,
        price: 100,
        performance: server.schema.performances.first(),
      },
      server
    );
    concession_1000 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
        id: 2,
        price: 1000,
        performance: server.schema.performances.first(),
      },
      server
    );
    concession_500 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
        id: 3,
        price: 500,
        performance: server.schema.performances.first(),
      },
      server
    );
    ticket_types = await fetch(
      `api/productions/myperf/performances/${performance.id}/ticket_types`
    );
    ticket_types = await ticket_types.json();
    server.shutdown();
  });

  beforeEach(() => {
    booking = new Booking();
  });

  let fakeTicket = (concession = null) => {
    return new Ticket(
      seat_group.id,
      concession ? concession.id : concession_100.id
    );
  };

  it('can be constructed from API data', () => {
    let apiData = {
      price_breakdown: FakePriceBreakdown,
    };
    let booking = Booking.fromAPIData(apiData);
    expect(booking).to.be.instanceOf(Booking);
    expect(booking.price_breakdown).to.eq(FakePriceBreakdown);

    apiData = {
      price_breakdown: FakePriceBreakdown,
      tickets: [
        { seat_group_id: 1, concession_type_id: 2 },
        { seat_group_id: 3, concession_type_id: 4 },
        { seat_group_id: 5, concession_type_id: 6 },
      ],
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
    booking.addTicket(ticket);
    expect(booking.tickets).to.include(ticket);
    expect(booking.dirty).to.be.true;
  });

  it('can set number of tickets', () => {
    booking.setTicketCount(seat_group, concession_100, 10);
    expect(booking.ticketCount(seat_group, concession_100)).to.eq(10);

    booking.setTicketCount(seat_group, concession_100, 5);
    expect(booking.ticketCount(seat_group, concession_100)).to.eq(5);

    booking.setTicketCount(seat_group, concession_100, 0);
    expect(booking.ticketCount(seat_group, concession_100)).to.eq(0);
    expect(booking.dirty).to.be.true;
  });

  describe('Matching Tickets', () => {
    let ticket1;
    let ticket2;
    let ticket3;
    let ticket4;
    beforeEach(() => {
      ticket1 = fakeTicket(concession_100);
      ticket2 = fakeTicket(concession_1000);
      ticket3 = fakeTicket(concession_500);
      ticket4 = new Ticket(2, concession_100.id);
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
      expect(booking.findTickets(null, concession_100)).to.include(
        ticket1,
        ticket4
      );
      expect(booking.findTickets({ id: 4 }, { id: 100 })).to.be.empty;
    });

    it('can find number of matching tickets', () => {
      expect(booking.ticketCount()).to.eq(4);

      expect(booking.ticketCount({ id: 2 })).to.eq(1);
      expect(booking.ticketCount(null, concession_100)).to.eq(2);
      expect(booking.ticketCount({ id: 4 }, { id: 100 })).to.eq(0);
    });
  });

  it('can remove a single ticket', () => {
    let t1 = fakeTicket();
    let t2 = fakeTicket();
    let t3 = fakeTicket(concession_1000);
    booking.tickets = [t1, t2, t3];

    booking.removeTicket(seat_group, concession_100);

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
  it('can get tickets total price in pennies', () => {
    expect(booking.tickets_total_price(ticket_types)).to.eq(0);

    booking.tickets = [
      fakeTicket(concession_100),
      fakeTicket(concession_1000),
      fakeTicket(concession_500),
    ];
    expect(booking.tickets_total_price(ticket_types)).to.eq(1600);
  });
  it('can get tickets total price in pounds', () => {
    expect(booking.tickets_total_price_pounds(ticket_types)).to.eq('0.00');

    booking.tickets = [
      fakeTicket(concession_100),
      fakeTicket(concession_1000),
      fakeTicket(concession_500),
    ];

    expect(booking.tickets_total_price_pounds(ticket_types)).to.eq('16.00');
  });
  it('can get total booking price in pounds', () => {
    expect(booking.total_price_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.total_price_pounds).to.eq('22.58');
  });
  it('can get tickets price in pounds', () => {
    expect(booking.tickets_price_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.tickets_price_pounds).to.eq('22.50');
  });
  it('can get discounts value in pounds', () => {
    expect(booking.discounts_value_pounds).to.eq('0.00');

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.discounts_value_pounds).to.eq('1.00');
  });
  it('can get ticket overview', () => {
    expect(booking.ticket_overview).to.be.empty;

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.ticket_overview).to.eq(FakePriceBreakdown.tickets);
  });
  it('can get misc costs', () => {
    expect(booking.misc_costs).to.be.empty;

    booking.price_breakdown = FakePriceBreakdown;

    expect(booking.misc_costs).to.eq(FakePriceBreakdown.misc_costs);
  });
});

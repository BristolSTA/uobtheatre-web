import { expect } from 'chai';
import { fake } from 'faker';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import { makeServer } from '@/fakeApi';

import { createFromFactoryAndSerialize } from '../helpers';
describe('Ticket Class', () => {
  /** @member {Booking} */
  let booking;
  let performance;
  let seat_group;
  let concession_100;
  let concession_1000;
  let concession_500;

  beforeAll(() => {
    let server = makeServer({ environment: 'test' });
    performance = createFromFactoryAndSerialize('performance', 1, null, server);
    seat_group = createFromFactoryAndSerialize('seatGroup', 1, null, server);
    concession_100 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
        id: 1,
        price: 100,
      },
      server
    );
    concession_1000 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
        id: 2,
        price: 1000,
      },
      server
    );
    concession_500 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
        id: 3,
        price: 500,
      },
      server
    );
    server.shutdown();
  });

  beforeEach(() => {
    booking = new Booking();
  });

  let fakeTicket = (concession = null) => {
    return new Ticket(seat_group, concession ?? concession_100);
  };

  it('can be constructed from API data', () => {
    let apiData = {
      performance: performance,
      booking_reference: 'abcd-1234',
    };
    let booking = Booking.fromAPIData(apiData);
    expect(booking).to.be.instanceOf(Booking);
    expect(booking.reference).to.eq(apiData.booking_reference);
    expect(booking.performance).to.eq(apiData.performance);
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
  });

  it('can set number of tickets', () => {
    booking.setTicketCount(seat_group, concession_100, 10);
    expect(booking.ticketCount(seat_group, concession_100)).to.eq(10);

    booking.setTicketCount(seat_group, concession_100, 5);
    expect(booking.ticketCount(seat_group, concession_100)).to.eq(5);

    booking.setTicketCount(seat_group, concession_100, 0);
    expect(booking.ticketCount(seat_group, concession_100)).to.eq(0);
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
      ticket4 = new Ticket({ id: 2 }, concession_100);
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
  });

  it('can clear tickets', () => {
    booking.tickets = [1, 2, 3];

    booking.clearTickets();

    expect(booking.tickets.length).to.eq(0);
  });
  it('can get total price in pennies', () => {
    expect(booking.total_price).to.eq(0);

    booking.tickets = [
      fakeTicket(concession_100),
      fakeTicket(concession_1000),
      fakeTicket(concession_500),
    ];

    expect(booking.total_price).to.eq(1600);
  });
  it('can get total price in pounds', () => {
    expect(booking.total_price_pounds).to.eq('0.00');

    booking.tickets = [
      fakeTicket(concession_100),
      fakeTicket(concession_1000),
      fakeTicket(concession_500),
    ];

    expect(booking.total_price_pounds).to.eq('16.00');
  });
});

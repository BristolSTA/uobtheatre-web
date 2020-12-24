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
        price: 100,
      },
      server
    );
    concession_1000 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
        price: 1000,
      },
      server
    );
    concession_500 = createFromFactoryAndSerialize(
      'concessionType',
      1,
      {
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
  it('can remove a ticket by index', () => {
    let ticket1 = fakeTicket();
    let ticket2 = fakeTicket();
    let ticket3 = fakeTicket();
    booking.tickets = [ticket1, ticket2, ticket3];

    booking.removeTicketByIndex(1);

    expect(booking.tickets.length).to.eq(2);
    expect(booking.tickets).to.include(ticket1, ticket3);
    expect(booking.tickets).not.to.include(ticket2);
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

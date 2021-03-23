import { expect } from 'chai';
import { DateTime } from 'luxon';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import TicketsMatrix from '@/classes/TicketsMatrix';
import { generateConcessionTypeBookingTypes } from '@/fakeApi/utils';

import FakeBooking from '../fixtures/FakeBooking';
import FakePerformance from '../fixtures/FakePerformance';
import {
  assertNoVisualDifference,
  executeWithServer,
  runApolloQuery,
} from '../helpers';
describe('Booking Class', () => {
  /** @member {Booking} */
  let booking;
  let seat_group;
  let concession_100_edge;
  let concession_1000_edge;
  let concession_500_edge;
  let tickets_matrix;
  let bookingAPIData;

  jest.spyOn(DateTime, 'local');

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      let performance = server.create(
        'performanceNode',
        Object.assign({}, FakePerformance(server), {
          ticketOptions: [
            server.create('PerformanceSeatGroupNode', {
              capacityRemaining: 100,
              seatGroup: server.create('seatGroupNode'),
              concessionTypes: generateConcessionTypeBookingTypes(
                [
                  server.create('concessionTypeNode'),
                  server.create('concessionTypeNode'),
                  server.create('concessionTypeNode'),
                ],
                server,
                [{ price: 100 }, { price: 1000 }, { price: 500 }]
              ),
            }),
          ],
        })
      );

      seat_group = performance.ticketOptions.models[0].seatGroup;
      concession_100_edge =
        performance.ticketOptions.models[0].concessionTypes.models[0];
      concession_1000_edge =
        performance.ticketOptions.models[0].concessionTypes.models[1];
      concession_500_edge =
        performance.ticketOptions.models[0].concessionTypes.models[2];

      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/PerformanceTicketOptions.gql'),
        variables: {
          id: performance.id,
        },
      });
      tickets_matrix = new TicketsMatrix(data.performance);

      let bookingModel = FakeBooking(server);
      let gqlResult = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      });
      bookingAPIData = gqlResult.data.booking;
    });
  });

  beforeEach(() => {
    booking = new Booking();
    booking.dirty = false;
  });

  let fakeTicket = (concessionEdge = null) => {
    return new Ticket(
      seat_group.id,
      concessionEdge
        ? concessionEdge.concessionType.id
        : concession_100_edge.concessionType.id
    );
  };

  it('can be constructed from API data', async () => {
    let apiData;
    await executeWithServer(async (server) => {
      let bookingModel = FakeBooking(server);
      let { data } = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      });
      apiData = data.booking;
    });
    booking = Booking.fromAPIData(apiData);
    expect(booking).to.be.instanceOf(Booking);
    expect(booking.price_breakdown).to.eq(apiData.priceBreakdown);
    expect(booking.tickets.length).to.eq(4);
    expect(booking.performance).to.eq(apiData.performance);
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

  it('cant add a ticket if matrix doesnt allow', () => {
    let ticket = fakeTicket();
    jest.spyOn(tickets_matrix, 'canAddTickets').mockReturnValueOnce(false);
    booking.addTicket(ticket, tickets_matrix);

    expect(booking.tickets).not.to.include(ticket);
    expect(booking.dirty).to.be.false;
  });

  it('can set number of tickets', () => {
    booking.setTicketCount(seat_group, concession_100_edge, 10, tickets_matrix);
    expect(booking.ticketCount(seat_group, concession_100_edge)).to.eq(10);

    booking.setTicketCount(seat_group, concession_100_edge, 5, tickets_matrix);
    expect(booking.ticketCount(seat_group, concession_100_edge)).to.eq(5);

    booking.setTicketCount(seat_group, concession_100_edge, 0, tickets_matrix);
    expect(booking.ticketCount(seat_group, concession_100_edge)).to.eq(0);

    booking.setTicketCount(null, null, 0, tickets_matrix);
    expect(booking.tickets.length).to.eq(0);

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
      expect(
        booking.findTickets(null, concession_100_edge.concessionType)
      ).to.include(ticket1, ticket4);
      expect(booking.findTickets({ id: 4 }, { id: 100 })).to.be.empty;
    });

    it('can find number of matching tickets', () => {
      expect(booking.ticketCount()).to.eq(4);

      expect(booking.ticketCount({ id: 2 })).to.eq(1);
      expect(
        booking.ticketCount(null, concession_100_edge.concessionType)
      ).to.eq(2);
      expect(booking.ticketCount({ id: 4 }, { id: 100 })).to.eq(0);
    });
  });

  it('can remove a single ticket', () => {
    let t1 = fakeTicket();
    let t2 = fakeTicket();
    let t3 = fakeTicket(concession_1000_edge);
    booking.tickets = [t1, t2, t3];

    booking.removeTicket(
      seat_group,
      concession_100_edge.concessionType,
      tickets_matrix
    );

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
    expect(booking.total_price).to.eq(0);

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    expect(booking.total_price).to.eq(3728);
  });
  it('can get total booking price in pounds', () => {
    expect(booking.total_price_pounds).to.eq('0.00');

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    expect(booking.total_price_pounds).to.eq('37.28');
  });
  it('can get sub total booking price in pounds', () => {
    expect(booking.sub_total_price_pounds).to.eq('0.00');

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    expect(booking.sub_total_price_pounds).to.eq('35.50');
  });
  it('can get tickets price in pounds', () => {
    expect(booking.tickets_price_pounds).to.eq('0.00');

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    expect(booking.tickets_price_pounds).to.eq('36.00');
  });
  it('can get tickets discounted price in pounds', () => {
    expect(booking.tickets_discounted_price_pounds).to.eq('0.00');

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    expect(booking.tickets_discounted_price_pounds).to.eq('35.50');
  });
  it('can tell if booking has discounts applied', () => {
    expect(booking.has_discounts).to.be.false;

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    expect(booking.has_discounts).to.be.true;
  });
  it('can get discounts value in pounds', () => {
    expect(booking.discounts_value_pounds).to.eq('0.00');

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    expect(booking.discounts_value_pounds).to.eq('0.50');
  });
  it('can get ticket overview', () => {
    expect(booking.ticket_overview(tickets_matrix)).to.be.empty;

    booking.price_breakdown = bookingAPIData.priceBreakdown;
    booking.tickets = [fakeTicket(concession_100_edge)];

    booking.dirty = true; // Test that when dirty, it uses the estimate
    expect(JSON.stringify(booking.ticket_overview(tickets_matrix))).to.equal(
      JSON.stringify(booking.ticket_overview_estimate(tickets_matrix))
    ); // Stringified here due to not being visually difference, but generated at different times through mapping

    booking.dirty = false;

    expect(booking.ticket_overview(tickets_matrix)).to.eq(
      bookingAPIData.priceBreakdown.tickets
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
      booking.ticket_overview_estimate(tickets_matrix)[0].seat_group.name
    ).to.eq(seat_group.name);
    expect(
      booking.ticket_overview_estimate(tickets_matrix)[0].concession_type.name
    ).to.include(concession_100_edge.concessionType.name);
    expect(booking.ticket_overview_estimate(tickets_matrix)[1]).to.include({
      number: 2,
      totalPrice: 2000,
      ticketPrice: 1000,
    });
  });
  it('can get misc costs', () => {
    expect(booking.misc_costs).to.be.empty;

    booking.price_breakdown = bookingAPIData.priceBreakdown;

    assertNoVisualDifference(
      booking.misc_costs,
      bookingAPIData.priceBreakdown.miscCosts
    );
  });
  it('can tell if a booking is active', () => {
    booking.updateFromAPIData(bookingAPIData);
    // Day before
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-08T10:00:00'));
    expect(booking.is_active).to.be.true;

    // 6 Hours before start
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T10:00:00'));
    expect(booking.is_active).to.be.true;

    // 40 minutes in
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T16:40:00'));
    expect(booking.is_active).to.be.true;

    // At end time
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T18:00:00'));
    expect(booking.is_active).to.be.true;

    // 1 Hour After Finish
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-09T19:00:00'));
    expect(booking.is_active).to.be.true;
  });
  it('can tell if a booking is inactive', () => {
    booking.updateFromAPIData(bookingAPIData);
    // Midnight next day
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-10T00:00:00'));
    expect(booking.is_active).to.be.false;

    // 10AM Next Day
    DateTime.local.mockReturnValue(DateTime.fromISO('2020-03-10T10:00:00'));
    expect(booking.is_active).to.be.false;
  });
});

import { DateTime } from 'luxon';

import { generatePriceBreakdown } from '@/fakeApi/booking.model';

import FakePerformance from './FakePerformance';

/**
 * Facts about this booking:
 * Best Seats in the House: 2 x Adult (@ 1000p), 1 x Student (@ 800p)
 * Meh Seats: 1 x Student (@ 800p)
 *
 * Total Tickets Price: 3600p
 * Discount Value: 50p
 * Subtotal: 3550p
 * Misc Costs: 5% of 3550p = 178p
 * Total: 3728p
 */

export default (server, overrides = {}, paid = false) => {
  let performance = server.create('PerformanceNode', FakePerformance(server));

  server.create('miscCostNode', {
    percentage: 0.05,
    name: 'Booking Fee',
    production: performance.production,
  });

  let bestSeatGroup = performance.ticketOptions.models[0].seatGroup;
  let mehSeatGroup = performance.ticketOptions.models[1].seatGroup;
  let adultConcession =
    performance.ticketOptions.models[0].concessionTypes.models[0]
      .concessionType;
  let studentConcession =
    performance.ticketOptions.models[0].concessionTypes.models[1]
      .concessionType;

  let bookingOverrides = {
    performance,
    reference: 'ABS1352EBV54',
    tickets: [
      server.create('ticketNode', {
        seatGroup: bestSeatGroup,
        concessionType: adultConcession,
      }),
      server.create('ticketNode', {
        seatGroup: bestSeatGroup,
        concessionType: adultConcession,
      }),
      server.create('ticketNode', {
        seatGroup: bestSeatGroup,
        concessionType: studentConcession,
      }),
      server.create('ticketNode', {
        seatGroup: mehSeatGroup,
        concessionType: studentConcession,
      }),
    ],
  };
  let bookingModel;
  if (paid) {
    bookingModel = server.create('bookingNode', 'paid', bookingOverrides);
    bookingModel.payments.models[0].update({
      cardBrand: 'VISA',
      last4: '1234',
      value: 2575,
      createdAt: DateTime.fromISO('2021-03-13T15:05:00'),
    });
  } else bookingModel = server.create('bookingNode', bookingOverrides);

  bookingModel.update(overrides);
  bookingModel.update({
    priceBreakdown: server.create(
      'PriceBreakdownNode',
      generatePriceBreakdown(server.schema, bookingModel)
    ),
  });
  return bookingModel;
};

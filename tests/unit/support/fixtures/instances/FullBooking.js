import PriceBreakdownTicket from '../PriceBreakdownTicket';
import bookingFixture from '#testSupport/fixtures/Booking';
import PerformanceSeatGroup from '#testSupport/fixtures/PerformanceSeatGroup';
import ConcessionTypeBookingType from '#testSupport/fixtures/ConcessionTypeBookingType';
import SeatGroup from '#testSupport/fixtures/SeatGroup';
import ConcessionType from '#testSupport/fixtures/ConcessionType';
import Ticket from '#testSupport/fixtures/Ticket';

/**
 * Has
 * 4 Tickets
 *  2 Adult Best Seats in the House
 *  1 Student Best Seats in the House
 *  1 Student The Meh Seats
 */
export default (overrides = {}) => {
  const bookingdata = bookingFixture();

  const adult = ConcessionType({
    name: 'Adult',
    description: null
  });
  const adultBookingType = ConcessionTypeBookingType({
    concessionType: adult
  });
  const student = ConcessionType({
    name: 'Student',
    id: 2,
    description: 'Valid ID NOT required'
  });
  const studentBookingType = ConcessionTypeBookingType({
    concessionType: student,
    price: 800,
    pricePounds: '8.00'
  });

  const mehSeatGroup = SeatGroup({
    name: 'The Meh Seats',
    id: 2,
    description: null
  });

  bookingdata.performance.ticketOptions = [
    PerformanceSeatGroup({
      capacityRemaining: 10,
      concessionTypes: [adultBookingType, studentBookingType]
    }),
    PerformanceSeatGroup({
      capacityRemaining: 11,
      seatGroup: mehSeatGroup,
      concessionTypes: [adultBookingType, studentBookingType]
    })
  ];

  bookingdata.tickets = [
    Ticket({ id: 7 }),
    Ticket({
      id: 8
    }),
    Ticket({
      id: 9,
      concessionType: student
    }),
    Ticket({
      id: 10,
      seatGroup: mehSeatGroup,
      concessionType: student
    })
  ];

  bookingdata.priceBreakdown.tickets = [
    PriceBreakdownTicket({
      ticketPrice: 300,
      number: 2,
      concessionType: adult,
      totalPrice: 600
    }),
    PriceBreakdownTicket({
      ticketPrice: 800,
      number: 1,
      concessionType: student,
      totalPrice: 800
    }),
    PriceBreakdownTicket({
      ticketPrice: 800,
      number: 1,
      seatGroup: mehSeatGroup,
      concessionType: student,
      totalPrice: 100
    })
  ];

  return Object.assign(bookingdata, overrides);
};

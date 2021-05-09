import bookingFixture from '@/tests/unit/fixtures/Booking'
import PerformanceSeatGroup from '@/tests/unit/fixtures/PerformanceSeatGroup'
import ConcessionTypeBookingType from '@/tests/unit/fixtures/ConcessionTypeBookingType'
import SeatGroup from '@/tests/unit/fixtures/SeatGroup'
import ConcessionType from '@/tests/unit/fixtures/ConcessionType'
import Ticket from '@/tests/unit/fixtures/Ticket'
import PriceBreakdownTicket from '../PriceBreakdownTicket'

export default () => {
  const bookingdata = bookingFixture()

  bookingdata.performance = {
    id: '1',
    production: {
      id: '1',
      name: 'Legally Blonde',
      slug: 'legally-blonde',
    },
    venue: {
      slug: 'anson-theatre',
    },
    durationMins: 120,
  }

  const adult = ConcessionTypeBookingType({
    concessionType: ConcessionType({
      name: 'Adult',
      description: null,
    }),
  })
  const student = ConcessionTypeBookingType({
    concessionType: ConcessionType({
      name: 'Student',
      id: '3',
      description: 'Valid ID NOT required',
    }),
    price: 800,
    pricePounds: '8.00',
  })

  const mehSeatGroup = SeatGroup({
    name: 'The Meh Seats',
    id: '2',
    description: null,
  })

  bookingdata.performance.ticketOptions = [
    PerformanceSeatGroup({
      capacityRemaining: 10,
      concessionTypes: [adult, student],
    }),
    PerformanceSeatGroup({
      capacityRemaining: 11,
      seatGroup: mehSeatGroup,
      concessionTypes: [adult, student],
    }),
  ]

  bookingdata.tickets = [
    Ticket({ id: '7' }),
    Ticket({
      id: '8',
    }),
    Ticket({
      id: '9',
      concessionType: student,
    }),
    Ticket({
      id: '10',
      seatGroup: mehSeatGroup,
      concessionType: student,
    }),
  ]

  bookingdata.priceBreakdown.tickets = [
    PriceBreakdownTicket({
      ticketPrice: 300,
      number: 2,
      concessionType: adult,
      totalPrice: 600,
    }),
    PriceBreakdownTicket({
      ticketPrice: 800,
      number: 1,
      concessionType: student,
      totalPrice: 800,
    }),
    PriceBreakdownTicket({
      ticketPrice: 800,
      number: 1,
      seatGroup: mehSeatGroup,
      concessionType: student,
      totalPrice: 100,
    }),
  ]
  //   console.log(bookingdata)

  return bookingdata
}

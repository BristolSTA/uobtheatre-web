import bookingFixture from '@/tests/unit/fixtures/Booking'
import PerformanceSeatGroup from '@/tests/unit/fixtures/PerformanceSeatGroup'
import ConcessionTypeBookingType from '@/tests/unit/fixtures/ConcessionTypeBookingType'
import SeatGroup from '@/tests/unit/fixtures/SeatGroup'
import ConcessionType from '@/tests/unit/fixtures/ConcessionType'
import Ticket from '@/tests/unit/fixtures/Ticket'
import rawBookingJSON from './booking'

export default () => {
  const rawBookingData = rawBookingJSON

  console.log(rawBookingData)

  const bookingdata = bookingFixture()

  const adult = ConcessionTypeBookingType()
  const student = ConcessionTypeBookingType({
    concessionType: ConcessionType({
      name: 'Student',
      id: 2,
    }),
  })

  const mehSeatGroup = SeatGroup({ name: 'The Meh Seats', id: 2 })

  bookingdata.performance.ticketOptions = [
    PerformanceSeatGroup({
      concessionTypes: [adult, student],
    }),
    PerformanceSeatGroup({
      seatGroup: mehSeatGroup,
      concessionTypes: [adult, student],
    }),
  ]

  bookingdata.tickets = [
    Ticket(),
    Ticket({
      id: 2,
    }),
    Ticket({
      id: 3,
      concessionType: student,
    }),
    Ticket({
      id: 4,
      seatGroup: mehSeatGroup,
      concessionType: student,
    }),
  ]
  return {
    bookingdata,
  }
}

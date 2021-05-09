import Booking from '@/classes/Booking'

import jsonBooking from './jsonBooking'
import FullBooking from './FullBooking'

describe('booking models', function () {
  let bookingJSON
  let bookingModel

  beforeAll(() => {
    bookingJSON = Booking.fromAPIData(jsonBooking())

    bookingModel = Booking.fromAPIData(FullBooking())
  })

  it.skip('matching', () => {
    expect(true).toBe(false)
  })

  it('matching', () => {
    // expect(bookingJSON.performance).toMatchObject(bookingModel.performance)
    expect(bookingJSON.ticketOverview()).toMatchObject(
      bookingModel.ticketOverview()
    )
  })
})

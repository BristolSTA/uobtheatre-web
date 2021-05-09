import bookingJSON from './bookingJSON'
import ticketMatrixJSON from './ticketMatrixJSON'

export default () => {
  const bookingdata = bookingJSON

  const ticketMatrixData = ticketMatrixJSON

  bookingdata.performance.ticketOptions = ticketMatrixData.raw_ticket_options
  bookingdata.performance.capacityRemaining =
    ticketMatrixData._performanceCapacityRemaining
  bookingdata.performance.discounts = ticketMatrixData.raw_discounts

  return bookingdata
}

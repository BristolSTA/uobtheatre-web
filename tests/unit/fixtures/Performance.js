import Discount from './Discount'
import PerformanceSeatGroup from './PerformanceSeatGroup'
import Production from './Production'
import GenericNodeConnection from './support/GenericNodeConnection'
import Venue from './Venue'

export default (overrides = {}) => {
  return Object.assign(
    {
      createdAt: '2020-05-08T14:00:00.000',
      updatedAt: '2020-05-08T14:00:00.000',
      id: 1,
      production: Production(),
      venue: Venue(),
      doorsOpen: '2020-03-09T16:00:00',
      start: '2020-03-09T15:00:00',
      end: '2020-03-09T18:00:00',
      description: 'the performance description',
      extraInformation: null,
      disabled: false,
      seatGroups: null,
      capacity: 207,
      discounts: [Discount()],
      bookings: GenericNodeConnection(),
      capacityRemaining: 69,
      ticketOptions: [PerformanceSeatGroup()],
      minSeatPrice: 250,
      durationMins() {
        return Math.round((this.end - this.start) / (1000 * 60))
      },
      isInperson: true,

      isOnline: false,
      soldOut: false,
    },
    overrides
  )
}

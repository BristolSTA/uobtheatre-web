import ConcessionTypeBookingType from './ConcessionTypeBookingType'
import SeatGroup from './SeatGroup'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      seatGroup: SeatGroup(),
      capacity: 100,
      capacityRemaining: 30,
      concessionTypes: [ConcessionTypeBookingType()]
    },
    overrides
  )
}

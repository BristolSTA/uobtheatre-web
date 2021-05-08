import ConcessionType from './ConcessionType'
import SeatGroup from './SeatGroup'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      seatGroup: SeatGroup(),
      capacity: 100,
      capacityRemaining: 30,
      concessionTypes: [
        {
          concessionType: ConcessionType(),
          price: 1000,
          pricePounds: '10.00',
        },
      ],
    },
    overrides
  )
}

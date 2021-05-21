import GenericConnection from './support/GenericNodeConnection'
import DiscountRequirement from './DiscountRequirement'
import SeatGroup from './SeatGroup'
export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Family Discount',
      percentage: 0.1,
      performances: GenericConnection(),
      seatGroup: SeatGroup(),
      requirements: [DiscountRequirement()],
    },
    overrides
  )
}

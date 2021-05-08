import GenericConnection from './support/GenericNodeConnection'
import DiscountRequirement from './DiscountRequirement'
export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Family Discount',
      percentage: 0.1,
      performances: GenericConnection(),
      seatGroup: null, // TODO: Seat group node,
      requirements: [DiscountRequirement()],
    },
    overrides
  )
}

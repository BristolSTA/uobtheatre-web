import MiscCost from './MiscCost'
import PriceBreakdownTicket from './PriceBreakdownTicket'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      tickets: [PriceBreakdownTicket()],
      ticketsPrice: 500,
      discountsValue: 10,
      miscCosts: [MiscCost()],
      subtotalPrice: 490,
      miscCostsValue: 5,
      totalPrice: 495,
      ticketsDiscountedPrice: 490
    },
    overrides
  )
}

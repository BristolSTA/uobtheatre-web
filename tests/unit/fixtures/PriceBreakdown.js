import ConcessionType from './ConcessionType'
import MiscCost from './MiscCost'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      tickets: [
        {
          ticketPrice: 250,
          number: 2,
          seatGroup: SeatGroup(),
          concessionType: ConcessionType(),
          totalPrice: 500,
        },
      ],
      ticketsPrice: 500,
      discountsValue: 10,
      miscCosts: [MiscCost()],
      subtotalPrice: 490,
      miscCostsValue: 5,
      totalPrice: 485,
      ticketsDiscountedPrice: 490,
    },
    overrides
  )
}

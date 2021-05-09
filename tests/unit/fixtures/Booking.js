import Payment from './Payment.js'
import PerformanceNode from './Performance.js'
import PriceBreakdown from './PriceBreakdown.js'
import GenericNodeConnection from './support/GenericNodeConnection.js'
import Ticket from './Ticket.js'
import UserNode from './User.js'
export default (overrides = {}) => {
  return Object.assign(
    {
      id: '1',
      createdAt: '2021-05-08T14:00:00.000',
      updatedAt: '2021-05-08T16:00:00.000',
      reference: 'yOIYg6Co8vGR',
      user: UserNode(),
      performance: PerformanceNode(),
      status: {
        value: 'PAID',
        description: 'Paid',
      },
      tickets: [Ticket()],
      priceBreakdown: PriceBreakdown(),
      payments: GenericNodeConnection([Payment()]),
    },
    overrides
  )
}

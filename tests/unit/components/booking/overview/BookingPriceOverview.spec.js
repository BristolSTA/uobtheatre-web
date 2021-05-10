import { expect } from 'chai'

import Booking from '@/classes/Booking'
import BookingPriceOverview from '@/components/booking/overview/BookingPriceOverview.vue'
import OverviewBox from '@/components/booking/overview/OverviewBox.vue'

import FakeBooking from '../../../fixtures/FakeBooking'
import {
  executeWithServer,
  fixTextSpacing,
  mountWithRouterMock,
  runApolloQuery,
} from '../../../helpers'

describe('Booking Price Overview', function () {
  let bookingPriceOverviewComponent
  const booking = new Booking()

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      const bookingModel = FakeBooking(server)

      const { data } = await runApolloQuery({
        query: require('@/graphql/queries/BookingInformation.gql'),
        variables: {
          bookingId: bookingModel.id,
        },
      })
      booking.updateFromAPIData(data.booking)
    })
    bookingPriceOverviewComponent = await mountWithRouterMock(
      BookingPriceOverview,
      {
        propsData: {
          booking,
        },
      }
    )
  })

  it('has overview box component', () => {
    expect(bookingPriceOverviewComponent.findComponent(OverviewBox).exists()).to
      .be.true
  })

  it('has correct costs info', () => {
    const costRows = bookingPriceOverviewComponent.findAll('tr')

    expect(costRows.length).to.eq(2)
    expect(fixTextSpacing(costRows.at(0).text())).to.eq(
      'Tickets Including any discounts : £35.50'
    )
    expect(fixTextSpacing(costRows.at(1).text())).to.eq('Booking Fee : £1.78')
    expect(
      fixTextSpacing(
        bookingPriceOverviewComponent.findComponent({ ref: 'total' }).text()
      )
    ).to.eq('Order Total: £37.28')
  })
})

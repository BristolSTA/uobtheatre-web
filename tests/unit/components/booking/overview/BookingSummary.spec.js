import { RouterLinkStub } from '@vue/test-utils'
import { expect } from 'chai'

import Booking from '@/classes/Booking'
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue'
import OverviewBox from '@/components/booking/overview/OverviewBox.vue'

import FakeBooking from '../../../fixtures/FakeBooking'
import {
  executeWithServer,
  mountWithRouterMock,
  runApolloQuery,
} from '../../../helpers'

describe('Booking Summary Overview', function () {
  let bookingSummaryOverviewComponent
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
      const bookingData = Object.assign({}, data.booking, {
        status: 'PAID',
        reference: 'ABS1352EBV54',
        performance: {
          production: { name: 'Legally Ginger', slug: 'legally-ginger' },
          start: '2019-10-07T18:00:00',
        },
      })
      booking.updateFromAPIData(bookingData)
    })
    bookingSummaryOverviewComponent = await mountWithRouterMock(
      BookingSummaryOverview,
      {
        propsData: {
          booking,
        },
      }
    )
  })

  it('has overview box component', () => {
    expect(bookingSummaryOverviewComponent.findComponent(OverviewBox).exists())
      .to.be.true
  })

  it('has correct booking summary info', async () => {
    await bookingSummaryOverviewComponent.vm

    expect(bookingSummaryOverviewComponent.text()).to.contain('Legally Ginger')
    expect(bookingSummaryOverviewComponent.text()).to.contain(
      'Monday 7 October 2019'
    )
    expect(bookingSummaryOverviewComponent.text()).to.contain(
      'Booking Ref: ABS1352EBV54'
    )
  })
  it('has working links', async () => {
    await bookingSummaryOverviewComponent.vm
    expect(
      bookingSummaryOverviewComponent.findAllComponents(RouterLinkStub).length
    ).to.equal(2)

    expect(
      bookingSummaryOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(0)
        .props('to')
    ).to.equal('/production/legally-ginger')

    expect(
      bookingSummaryOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(1)
        .props('to')
    ).to.equal('/user/booking/ABS1352EBV54')
  })
})

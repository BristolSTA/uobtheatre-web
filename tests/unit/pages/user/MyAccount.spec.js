import { expect } from 'chai'

import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue'
import BookingsTable from '@/components/user/BookingsTable.vue'
import UserDetails from '@/components/user/UserDetails.vue'
import MyAccount from '@/pages/user/index'
import {
  generateMountOptions,
  mountWithRouterMock,
  RouterLinkStub,
} from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import User from '../../fixtures/User'

describe('My Account', () => {
  let myAccountComponent

  beforeEach(async () => {
    myAccountComponent = await mountWithRouterMock(
      MyAccount,
      generateMountOptions(['apollo'], {
        apollo: {
          queryCallstack: [GenericApolloResponse('me', User())],
        },
      })
    )
  })

  it('contains user details', () => {
    expect(myAccountComponent.findComponent(UserDetails).exists()).to.be.true
    expect(
      myAccountComponent.findComponent(UserDetails).props('user').firstName
    ).to.eq('Michael')
  })

  it('contains bookings table', () => {
    expect(myAccountComponent.findComponent(BookingsTable).exists()).to.be.true
    expect(myAccountComponent.findComponent(BookingsTable).props('canLoadMore'))
      .to.be.false
    expect(myAccountComponent.findComponent(BookingsTable).props('bookings')).to
      .be.empty
  })

  describe('with no future bookings', () => {
    it('shows link to see upcoming shows', () => {
      expect(
        myAccountComponent.findAllComponents(BookingSummaryOverview)
      ).length(0)
      expect(myAccountComponent.findComponent(RouterLinkStub).exists()).to.be
        .true
      expect(
        myAccountComponent.findComponent(RouterLinkStub).props('to')
      ).to.eq('/productions')
      expect(myAccountComponent.findComponent(RouterLinkStub).text()).to.eq(
        "View What's On"
      )
      expect(myAccountComponent.text()).to.contain('No Upcoming Bookings')
    })
  })
})

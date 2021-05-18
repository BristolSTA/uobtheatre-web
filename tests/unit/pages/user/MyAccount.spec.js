import { expect } from 'chai'

import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue'
import BookingsTable from '@/components/user/BookingsTable.vue'
import UserDetails from '@/components/user/UserDetails.vue'
import MyAccount from '@/pages/user/index'
import { DateTime } from 'luxon'
import {
  generateMountOptions,
  mountWithRouterMock,
  RouterLinkStub,
  waitFor,
} from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import User from '../../fixtures/User'
import GenericNodeConnection from '../../fixtures/support/GenericNodeConnection'
import Booking from '../../fixtures/Booking'
import Performance from '../../fixtures/Performance'

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

  describe('with future bookings', () => {
    beforeEach(async () => {
      myAccountComponent = await mountWithRouterMock(
        MyAccount,
        generateMountOptions(['apollo'], {
          apollo: {
            queryCallstack: [
              GenericApolloResponse(
                'me',
                User({
                  bookings: GenericNodeConnection([
                    Booking({
                      performance: Performance({
                        end: '3000-05-17T10:00:00',
                      }),
                    }),
                    Booking({
                      performance: Performance({
                        end: '3000-05-17T10:00:00',
                      }),
                    }),
                  ]),
                })
              ),
            ],
          },
        })
      )
    })
    it('shows bookings', () => {
      expect(
        myAccountComponent.findAllComponents(BookingSummaryOverview)
      ).length(2)
    })
  })

  describe('with previous bookings', () => {
    beforeEach(async () => {
      myAccountComponent = await mountWithRouterMock(
        MyAccount,
        generateMountOptions(['apollo'], {
          apollo: {
            queryCallstack: [
              GenericApolloResponse(
                'me',
                User({
                  bookings: GenericNodeConnection(Array(10).fill(Booking()), {
                    hasNextPage: true,
                  }),
                })
              ),
              GenericApolloResponse(
                'me',
                User({
                  bookings: GenericNodeConnection(Array(2).fill(Booking())),
                })
              ),
            ],
          },
        })
      )
      await myAccountComponent.vm.$nextTick()
    })

    it('shows first 10 previous bookings', () => {
      expect(
        myAccountComponent.findComponent(BookingsTable).props('bookings')
      ).length(10)
      expect(
        myAccountComponent.findComponent(BookingsTable).props('canLoadMore')
      ).to.be.true
    })

    it('can request next page', async () => {
      myAccountComponent.findComponent(BookingsTable).vm.$emit('load-more')
      await waitFor(() => !myAccountComponent.vm.loadingMore)
      expect(
        myAccountComponent.findComponent(BookingsTable).props('bookings')
      ).length(12)
      expect(
        myAccountComponent.findComponent(BookingsTable).props('canLoadMore')
      ).to.be.false
    })
  })
})

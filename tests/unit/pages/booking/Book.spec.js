import { expect } from 'chai'

import stages from '@/pages/production/_slug/book/-bookingStages'
import BookingNavigation from '@/components/booking/BookingNavigation.vue'
import ProductionBanner from '@/components/production/ProductionBanner.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { swal } from '@/utils'
import Book from '@/pages/production/_slug/book.vue'

import {
  assertNoVisualDifference,
  generateMountOptions,
  mountWithRouterMock,
  waitFor,
} from '../../helpers'
import GenericApolloResponse from '../../fixtures/support/GenericApolloResponse'
import Production from '../../fixtures/Production'
import GenericNodeConnection from '../../fixtures/support/GenericNodeConnection'
import Performance from '../../fixtures/Performance'
import Booking from '../../fixtures/Booking'

describe('Create Booking Page', () => {
  let bookingComponent, routerPushFake
  const fakeNuxtChild = {
    template: '<div />',
    stageInfo: stages[0].stageInfo,
    props: ['production', 'ticketMatrix', 'booking'],
  }

  beforeEach(async () => {
    bookingComponent = await mountWithRouterMock(
      Book,
      generateMountOptions(['apollo'], {
        mocks: {
          $router: {
            push: (routerPushFake = jest.fn()),
          },
          $route: {
            params: {},
          },
        },
        apollo: {
          queryCallstack: [
            GenericApolloResponse('production', Production({}, true)),
          ],
        },
        stubs: { NuxtChild: fakeNuxtChild },
      }),
      {
        params: {
          slug: 'legally-ginger',
        },
      }
    )
  })

  it('has a production banner', () => {
    const banner = bookingComponent.findComponent(ProductionBanner)
    expect(banner.exists()).to.be.true
    expect(banner.props('production').name).to.eq('Legally Ginger')
    expect(banner.props('showBuyTicketsButton')).to.eq(false)
    expect(banner.props('showDetailedInfo')).to.eq(false)
  })

  it('has correct breadcrumbs', () => {
    const breadcrumbs = bookingComponent.findComponent(Breadcrumbs)
    expect(breadcrumbs.exists()).to.be.true
    assertNoVisualDifference(breadcrumbs.props('crumbs'), [
      { text: 'Whats On', route: '/productions' },
      {
        text: 'Legally Ginger',
        route: '/production/legally-ginger',
      },
      { text: 'Book' },
    ])
  })

  it('has booking navigation', () => {
    const bookingNavigation = bookingComponent.findComponent(BookingNavigation)
    expect(bookingNavigation.exists()).to.be.true
    expect(bookingNavigation.props('currentStageIndex')).to.eq(0)
    expect(bookingNavigation.props('production').name).to.eq('Legally Ginger')
    expect(bookingNavigation.props('booking')).to.eq(
      bookingComponent.vm.booking
    )
  })

  it('has a nuxt child', async () => {
    await bookingComponent.setData({
      ticketMatrix: 'fakeMatrix',
    })
    const nuxtChild = bookingComponent.findComponent(fakeNuxtChild)
    expect(nuxtChild.exists()).to.be.true
    expect(nuxtChild.props('production').name).to.eq('Legally Ginger')
    expect(nuxtChild.props('booking')).to.eq(bookingComponent.vm.booking)
    expect(nuxtChild.props('ticketMatrix')).to.eq('fakeMatrix')
  })

  it('reacts to the child emitting select performance event', async () => {
    const childComponent = bookingComponent.findComponent(fakeNuxtChild)

    await childComponent.vm.$emit('select-performance', {
      id: 1,
    })

    expect(bookingComponent.vm.booking.performance.id).to.eq(1)
    expect(routerPushFake.mock.calls).length(1)
    expect(routerPushFake.mock.calls[0][0].name).to.eq(
      'production-slug-book-performanceId-warnings'
    )
  })

  it('reacts to the child emitting next stage event', async () => {
    const childComponent = bookingComponent.findComponent(fakeNuxtChild)

    bookingComponent.vm.currentStage = stages[1].stageInfo

    await childComponent.vm.$emit('next-stage')

    expect(routerPushFake.mock.calls[0][0].name).to.eq(
      'production-slug-book-performanceId-tickets'
    )
  })

  describe('with performannce id', () => {
    beforeEach(async () => {
      bookingComponent = await mountWithRouterMock(
        Book,
        generateMountOptions(['apollo'], {
          mocks: {
            $router: {
              push: (routerPushFake = jest.fn()),
            },
            $route: {
              params: {
                performanceId: 1,
              },
            },
          },
          apollo: {
            queryCallstack: [
              ...bookingComponent.vm.$apollo.queryCallstack,
              GenericApolloResponse('me', {
                bookings: GenericNodeConnection(),
              }),
              GenericApolloResponse('performance', Performance()),
            ],
          },
          stubs: { NuxtChild: fakeNuxtChild },
        }),
        {
          params: {
            slug: 'legally-ginger',
          },
        }
      )

      await waitFor(() => bookingComponent.vm.ticketMatrix)
    })

    it('loads required data on mount if has a performance id', () => {
      expect(bookingComponent.vm.booking.performance.id).to.eq(1)
      expect(bookingComponent.vm.ticketMatrix).not.to.be.null
    })

    it('reacts to booking navigation goto stage event', async () => {
      const bookingNavigation =
        bookingComponent.findComponent(BookingNavigation)

      await bookingNavigation.vm.$emit('goto-stage', stages[1])

      expect(routerPushFake.mock.calls).length(1)
      expect(routerPushFake.mock.calls[0][0].name).to.eq(
        'production-slug-book-performanceId-warnings'
      )
      expect(routerPushFake.mock.calls[0][0].params.performanceId).to.eq(1)
      expect(routerPushFake.mock.calls[0][0].params.slug).to.eq(
        'legally-ginger'
      )
    })
  })

  describe('with exisiting draft booking', () => {
    let stub, mount
    beforeAll(() => {
      stub = jest.spyOn(swal, 'fire')

      mount = async () => {
        bookingComponent = await mountWithRouterMock(
          Book,
          generateMountOptions(['apollo'], {
            mocks: {
              $router: {
                push: (routerPushFake = jest.fn()),
              },
              $route: {
                params: {
                  performanceId: 1,
                },
              },
            },

            apollo: {
              queryCallstack: [
                ...bookingComponent.vm.$apollo.queryCallstack,
                GenericApolloResponse('me', {
                  bookings: GenericNodeConnection([Booking()]),
                }),
                GenericApolloResponse('performance', Performance()),
              ],
            },
            stubs: { NuxtChild: fakeNuxtChild },
          }),
          {
            params: {
              slug: 'legally-ginger',
            },
          }
        )
      }
    })

    afterEach(() => {
      stub.mockClear()
    })

    it('can resume booking', async () => {
      stub.mockResolvedValue({ isConfirmed: true })
      await mount()

      await waitFor(() => stub.mock.calls.length)

      expect(stub.mock.calls).length(1)
      expect(bookingComponent.vm.booking.id).to.eq(1)
    })
    it('can decline to resume booking', async () => {
      stub.mockResolvedValue({ isConfirmed: false })
      await mount()
      const updateStub = jest
        .spyOn(bookingComponent.vm.booking, 'updateFromAPIData')
        .mockImplementation()

      await waitFor(() => stub.mock.calls.length)

      expect(stub.mock.calls).length(1)
      expect(updateStub.mock.calls).length(0)
    })
  })

  describe('mounted middleware', () => {
    const mount = async (stage = stages[0]) => {
      const fakeChild = JSON.parse(JSON.stringify(fakeNuxtChild))
      fakeChild.stageInfo = stage.stageInfo

      bookingComponent = await mountWithRouterMock(
        Book,
        generateMountOptions(['apollo'], {
          mocks: {
            $router: {
              push: (routerPushFake = jest.fn()),
            },
            $route: {
              params: {
                performanceId: 1,
              },
            },
          },
          apollo: {
            queryCallstack: [
              ...bookingComponent.vm.$apollo.queryCallstack,
              GenericApolloResponse('me', {
                bookings: GenericNodeConnection(),
              }),
              GenericApolloResponse('performance', Performance()),
            ],
          },
          stubs: {
            NuxtChild: fakeChild,
          },
        }),
        {
          params: {
            slug: 'legally-ginger',
          },
        }
      )
    }
    afterEach(() => {
      routerPushFake.mockClear()
    })
    it('it changes stage if stage should not be used', async () => {
      const stage = stages[1]
      const mock = jest
        .spyOn(stage.stageInfo, 'shouldBeUsed')
        .mockImplementation(() => false)
      await mount(stage)

      expect(routerPushFake.mock.calls).length(1)
      expect(routerPushFake.mock.calls[0][0].name).to.eq(
        'production-slug-book-performanceId-tickets'
      )
      mock.mockReset()
    })
    it('it changes stage if not eligable for stage', async () => {
      const stage = stages[1]
      const shouldBeUsedMock = jest
        .spyOn(stage.stageInfo, 'shouldBeUsed')
        .mockImplementation(() => true)
      const eligableMock = jest
        .spyOn(stage.stageInfo, 'eligable')
        .mockImplementation(() => false)
      await mount(stage)

      expect(routerPushFake.mock.calls).length(1)
      expect(routerPushFake.mock.calls[0][0].name).to.eq('production-slug-book')
      shouldBeUsedMock.mockReset()
      eligableMock.mockReset()
    })
  })
})

import { expect } from 'chai'

import Venue from '../fixtures/Venue'
import { generateMountOptions, mountWithRouterMock } from '../helpers'
import GenericNodeConnection from '../fixtures/support/GenericNodeConnection'
import GenericApolloResponse from '../fixtures/support/GenericApolloResponse'
import Production from '../fixtures/Production'
import Performance from '../fixtures/Performance'
import PublicityScreenPage from '@/pages/publicity-screen/_venueSlugs/index.vue'
import HaveTicketsReadyScreen from '@/components/publicity-screens/HaveTicketsReadyScreen.vue'

const prod1 = Production({ id: 1, name: 'My Production 1' })
const prod2 = Production({ id: 2, name: 'My Production 2' })
const prod3 = Production({
  id: 3,
  name: 'My Production 3',
  performances: GenericNodeConnection([
    Performance({
      doorsOpen: '2020-01-01T10:30:00',
      start: '2020-01-01T10:40:00'
    })
  ])
})
const prod4 = Production({
  id: 4,
  name: 'My Production 4',
  isBookable: false,
  performances: GenericNodeConnection([
    Performance({
      doorsOpen: '2020-01-01T10:30:00',
      start: '2020-01-01T10:40:00'
    })
  ])
})

describe('Publicity Screen', function () {
  let pageComponent
  beforeEach(() => {
    jest.useFakeTimers('modern')
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  async function makeComponent (callstack, onlyTheseVenues = false) {
    pageComponent = await mountWithRouterMock(
      PublicityScreenPage,
      generateMountOptions(['apollo'], {
        apollo: {
          queryCallstack: callstack
        },
        mocks: {
          $route: {
            params: {
              venueSlugs: 'my-venue1,my-venue2'
            },
            query: {
              onlyTheseVenues
            }
          },
          $router: {
            resolve: () => 'http://my.url/'
          }
        }
      })
    )
    await pageComponent.vm.$nextTick()
  }

  it('handles no available productions', async () => {
    await makeComponent([
      GenericApolloResponse(
        'venue',
        Venue({ name: 'My Venue 1', productions: GenericNodeConnection() })
      ),
      GenericApolloResponse(
        'venue',
        Venue({ name: 'My Venue 2', productions: GenericNodeConnection() })
      ),
      GenericApolloResponse('productions', GenericNodeConnection())
    ])
    expect(pageComponent.text()).to.contain(
      'Welcome to My Venue 1 & My Venue 2'
    )
  })

  describe('with some upcoming productions', () => {
    const genComponent = async (onlyTheseVenues) => {
      await makeComponent(
        [
          GenericApolloResponse(
            'venue',
            Venue({
              name: 'My Venue 1',
              productions: GenericNodeConnection()
            })
          ),
          GenericApolloResponse(
            'venue',
            Venue({
              name: 'My Venue 2',
              productions: GenericNodeConnection([prod1, prod4])
            })
          ),
          GenericApolloResponse(
            'productions',
            GenericNodeConnection([prod1, prod2])
          )
        ],
        onlyTheseVenues
      )
    }

    it('can show all bookable upcoming productions', async () => {
      await genComponent()
      // First slide is the first production
      expect(pageComponent.vm.marketableProductions.length).to.eq(2)
      expect(pageComponent.text()).to.contain('My Production 1')
      expect(pageComponent.text()).not.to.contain('My Production 2')

      jest.advanceTimersByTime(10001)
      // Second slide is the second production
      await pageComponent.vm.$nextTick()
      expect(pageComponent.text()).not.to.contain('My Production 1')
      expect(pageComponent.text()).to.contain('My Production 2')

      jest.advanceTimersByTime(10001)
      // Third slide is the first production (loops back...)
      await pageComponent.vm.$nextTick()
      expect(pageComponent.text()).to.contain('My Production 1')
      expect(pageComponent.text()).not.to.contain('My Production 2')
    })

    it('can show upcoming productions for given venues only', async () => {
      await genComponent(true)

      // First slide is the first, and only, production
      expect(pageComponent.vm.marketableProductions.length).to.eq(1)
      expect(pageComponent.text()).to.contain('My Production 1')
    })
  })

  describe('with an active performance', () => {
    it.each([
      [prod3, 'My Production 3', 2],
      [prod4, 'My Production 4', 1]
    ])(
      'shows box office screens (%#)',
      async (
        activePerformanceProduction,
        productionName,
        numExpectedMarketable
      ) => {
        await makeComponent(
          [
            GenericApolloResponse(
              'venue',
              Venue({
                id: 1,
                name: 'My Venue 1',
                productions: GenericNodeConnection([prod1])
              })
            ),
            GenericApolloResponse(
              'venue',
              Venue({
                id: 2,
                name: 'My Venue 2',
                productions: GenericNodeConnection([
                  activePerformanceProduction
                ])
              })
            )
          ],
          true
        )
        jest.setSystemTime(new Date('2020-01-01T10:00:00'))

        // Currently 10:00:00, doors open at 10:30:00 (over 20 mins away, so we expect to be in general upcoming productions state)
        expect(pageComponent.vm.productionsOnNow.length).to.be.eq(0)
        expect(pageComponent.vm.marketableProductions.length).to.be.eq(
          numExpectedMarketable
        )
        expect(pageComponent.text()).to.contain('Book now at')
        expect(
          pageComponent
            .findComponent({ ref: 'activeBoxOfficeComponent' })
            .exists()
        ).to.be.false

        jest.setSystemTime(new Date('2020-01-01T10:11:00'))
        jest.advanceTimersByTime(10000)
        await pageComponent.vm.$nextTick()
        expect(pageComponent.vm.productionsOnNow.length).to.be.eq(1)
        expect(
          pageComponent
            .findComponent({ ref: 'activeBoxOfficeComponent' })
            .exists()
        ).to.be.true
        expect(pageComponent.text()).to.contain(
          `Welcome to this performance of ${productionName}`
        )

        jest.setSystemTime(new Date('2020-01-01T10:31:00'))
        jest.advanceTimersByTime(10000)
        await pageComponent.vm.$nextTick()
        expect(pageComponent.findComponent(HaveTicketsReadyScreen).exists()).to
          .be.true

        jest.setSystemTime(new Date('2020-01-01T11:00:00'))
        jest.advanceTimersByTime(10000)
        await pageComponent.vm.$nextTick()
        expect(pageComponent.text()).to.contain('Book now at')
        expect(
          pageComponent
            .findComponent({ ref: 'activeBoxOfficeComponent' })
            .exists()
        ).to.be.false
      }
    )
  })
})

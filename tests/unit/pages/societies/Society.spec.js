import { RouterLinkStub } from '@vue/test-utils'
import { expect } from 'chai'
import { DateTime } from 'luxon'

import Society from '@/pages/society/_slug/index'
import { executeWithServer, mountWithRouterMock, waitFor } from '../../helpers'

describe('Society page', function () {
  let societyPageComponent
  let server

  beforeEach(async () => {
    server = await executeWithServer((server) => {
      // Create a society
      const testSociety = server.create('SocietyNode', {
        name: 'Drama Society',
        slug: 'drama-soc',
        description: 'not a musical theatre society',
        logo: server.create('ImageNode', {
          url: 'http://pathto.example/society-logo.png',
        }),
        banner: server.create('ImageNode', {
          url: 'http://pathto.example/society-banner.png',
        }),
      })

      server.create('ProductionNode', {
        name: 'Bins',
        slug: 'bins',
        isBookable: true,
        end: DateTime.fromISO('2020-10-18'),
        society: testSociety,
      })
      server.create('ProductionNode', {
        name: 'Centuary',
        slug: 'centuary',
        isBookable: false,
        end: DateTime.fromISO('2019-10-19'),
        society: testSociety,
      })
    }, false)

    societyPageComponent = await mountWithRouterMock(
      Society,
      {},
      {
        params: {
          slug: 'drama-soc',
        },
      }
    )
  })

  afterEach(() => {
    server.shutdown()
  })

  it('fetches the society', async () => {
    await waitFor(() => societyPageComponent.vm.society)
    expect(societyPageComponent.vm.society.name).to.eq('Drama Society')

    expect(societyPageComponent.text()).to.contain('Drama Society')

    expect(societyPageComponent.text()).to.contain(
      'not a musical theatre society'
    )

    expect(
      societyPageComponent
        .findComponent({
          ref: 'society-logo',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/society-logo.png')
  })

  it('shows society splashscreen', async () => {
    await waitFor(() => societyPageComponent.vm.society)
    const splashscreenContainer = societyPageComponent.find('#splashscreen')

    expect(splashscreenContainer.text()).to.contain('Drama Society')

    expect(splashscreenContainer.attributes('style')).to.contain(
      'background-image: url(http://pathto.example/society-banner.png)'
    )
  })

  describe('society production list', () => {
    let links
    let tableRows
    beforeEach(() => {
      tableRows = societyPageComponent.findAll('tr')
      links = societyPageComponent.findAllComponents(RouterLinkStub)
    })

    it('correct number of productions', () => {
      expect(tableRows.length).to.equal(2)
      expect(links.length).to.equal(3)
    })

    it('table rows have correct text', () => {
      expect(tableRows.at(0).text()).to.contain('Bins')
      expect(tableRows.at(0).text()).to.contain('Book Now')

      expect(tableRows.at(1).text()).to.contain('Centuary')
      expect(tableRows.at(1).text()).to.contain('October 2019')
    })

    it('has correct links', () => {
      expect(links.at(0).props('to')).to.equal('/production/bins')
      expect(links.at(1).props('to')).to.equal('/production/bins/book')
      expect(links.at(2).props('to')).to.equal('/production/centuary')
    })
  })

  it('handles invalid society', async () => {
    const errorFn = jest.fn()
    societyPageComponent = await mountWithRouterMock(
      Society,
      {},
      {
        error: errorFn,
        params: {
          slug: 'not-drama-soc',
        },
      }
    )
    await waitFor(() => errorFn.mock.calls.length)
    expect(errorFn.mock.calls.length).to.eq(1)
    expect(errorFn.mock.calls[0][0]).to.include({ statusCode: 404 })
  })
})

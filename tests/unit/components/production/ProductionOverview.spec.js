import { mount, RouterLinkStub } from '@vue/test-utils'
import ProductionOverview from '@/components/production/ProductionOverview'
import { expect } from 'chai'
import { DateTime } from 'luxon'
import Production from '../../fixtures/Production.js'
import Performance from '../../fixtures/Performance.js'
import GenericNodeConnection from '../../fixtures/support/GenericNodeConnection.js'
import { fixTextSpacing, generateMountOptions } from '../../helpers.js'

describe('Production Overview', function () {
  let overviewContainer
  it('shows the correct overview', async () => {
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        isInperson: true,
        isOnline: false,
      },
    ])

    // correct descriprion
    expect(overviewContainer.text()).to.contain('The description of the show.')

    // correct poster image
    expect(
      overviewContainer
        .findComponent({
          ref: 'poster-image',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/poster-image.png')
  })

  it('shows the correct show information', async () => {
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        isInperson: true,
        isOnline: false,
      },
    ])

    // correct warnings
    const warnings = overviewContainer.findComponent({ ref: 'warnings' })
    expect(warnings.exists()).to.be.true

    // correct medium for in person
    expect(overviewContainer.text()).to.contain('Medium: In Person Only')

    // correct age rating
    expect(overviewContainer.findComponent({ ref: 'age-rating' }).exists()).to
      .be.true
    expect(overviewContainer.text()).to.contain('Ages 18+')

    // correct description
    expect(fixTextSpacing(overviewContainer.text())).to.contain(
      'A production by STA'
    )

    expect(
      overviewContainer.findAllComponents(RouterLinkStub).at(0).props('to')
    ).to.equal('/society/sta')

    // correct facebook link
    const link = overviewContainer.findComponent({ ref: 'facebook-link' })
    expect(link.exists()).to.be.true
    expect(link.attributes('href')).to.eq('https://facebook.com/legally-ginger')
  })

  it('shows the correct medium for online and no show warnings', async () => {
    await createWithPerformances(
      [
        {
          start: DateTime.fromISO('2020-11-14'),
          isInperson: false,
          isOnline: true,
        },
      ],
      {
        __dont_factory: ['contentWarnings'],
        contentWarnings: [],
        ageRating: null,
        facebookEvent: null,
      }
    )

    // no warnings
    expect(overviewContainer.findComponent({ ref: 'warnings' }).exists()).to.be
      .false

    // no age rating
    expect(overviewContainer.findComponent({ ref: 'age-rating' }).exists()).to
      .be.false

    // no facebook link
    expect(overviewContainer.findComponent({ ref: 'facebook-link' }).exists())
      .to.be.false

    // online only medium
    expect(overviewContainer.text()).to.contain('Medium: Online Only')
  })

  it('shows the correct medium for online and in person', async () => {
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        isInperson: true,
        isOnline: true,
      },
    ])

    // medium is online and in person
    expect(overviewContainer.text()).to.contain('Medium: In Person + Online')
  })

  it('handles having no performances', async () => {
    await createWithPerformances([])
    expect(overviewContainer.text()).not.to.contain('Medium')
  })

  const createWithPerformances = (performances, productionOverrides) => {
    const production = Production(productionOverrides)
    production.performances = GenericNodeConnection(
      performances.map((performance) => Performance(performance))
    )

    overviewContainer = mount(
      ProductionOverview,
      generateMountOptions(['router'], {
        propsData: {
          production,
        },
      })
    )
  }
})

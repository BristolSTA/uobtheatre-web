import { mount, RouterLinkStub } from '@vue/test-utils'
import { expect } from 'chai'
import { DateTime } from 'luxon'

import ProductionHeader from '@/components/production/ProductionBanner.vue'

import {
  assertNoVisualDifference,
  fixTextSpacing,
  generateMountOptions,
} from '../../helpers.js'
import Production from '../../fixtures/Production.js'
import Performance from '../../fixtures/Performance.js'
import GenericNodeConnection from '../../fixtures/support/GenericNodeConnection.js'

describe('ProductionBanner', function () {
  let headerContainer

  it('shows production details correctly', async () => {
    const venue1 = {
      name: 'The New Vic',
      slug: 'the-new-vic',
      publiclyListed: false,
    }
    const venue2 = {
      name: 'The Newer Vic',
      slug: 'the-newer-vic',
      publiclyListed: true,
    }
    await createWithPerformances([
      {
        start: DateTime.fromISO('2020-11-14'),
        venue: venue1,
        isInperson: true,
        isOnline: false,
        durationMins: 102,
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: venue2,
        isInperson: true,
        isOnline: false,
        durationMins: 112,
      },
    ])

    expect(headerContainer.text()).to.contain('Legally Ginger')
    expect(fixTextSpacing(headerContainer.text())).to.contain('by STA')

    expect(
      headerContainer.findAllComponents(RouterLinkStub).at(0).props('to')
    ).to.equal('/society/sta')

    // test combination of two venues
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at The New Vic and The Newer Vic'
    )

    expect(
      headerContainer.findAllComponents(RouterLinkStub).at(1).props('to')
    ).to.equal('/venue/the-newer-vic')
    expect(headerContainer.findAllComponents(RouterLinkStub).length).to.equal(2)

    expect(headerContainer.text()).to.contain('14 Nov - 18 Nov 2020')
    expect(headerContainer.text()).to.contain('1 hour, 42 minutes')
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Tickets available from £1.20'
    )

    // correct feature image
    expect(
      headerContainer
        .findComponent({
          ref: 'featured-image',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/featured-image.png')

    // correct society image
    expect(
      headerContainer
        .findComponent({
          ref: 'society-image',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/logo-image.png')
  })

  it('shows no society image when none is given', async () => {
    await createWithPerformances([])
    headerContainer.vm.production.society.logo = null
    await headerContainer.vm.$forceUpdate()
    expect(
      headerContainer
        .findComponent({
          ref: 'society-image',
        })
        .exists()
    ).to.be.false
  })

  it('shows online only performances', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The New Vic',
          slug: 'the-new-vic',
          publiclyListed: false,
        },
        isInperson: false,
        isOnline: true,
      },
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
          publiclyListed: true,
        },
        isInperson: false,
        isOnline: true,
      },
    ])
    assertNoVisualDifference(headerContainer.vm.venues, [])
    expect(fixTextSpacing(headerContainer.text())).to.contain('View Online')
    expect(headerContainer.findAllComponents(RouterLinkStub).length).to.equal(1)
  })

  it('shows online and in person performances', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
          publiclyListed: true,
        },
        isInperson: true,
        isOnline: true,
      },
    ])

    // test online and live
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at The Newer Vic and Online '
    )
    expect(headerContainer.findAllComponents(RouterLinkStub).length).to.equal(2)
  })

  it('shows venue overflow', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
        },
        isInperson: true,
        isOnline: true,
      },
      {
        start: DateTime.fromISO('2020-11-14'),
        venue: {
          name: 'The New Vic',
          slug: 'the-new-vic',
        },
        isInperson: true,
        isOnline: false,
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: {
          name: 'Anson Theatre',
          slug: 'anson-theatre',
        },
        isInperson: true,
        isOnline: false,
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: {
          name: 'Pegg Rooms',
          slug: 'pegg-rooms',
        },
        isInperson: true,
        isOnline: false,
      },
      {
        start: DateTime.fromISO('2020-11-15'),
        venue: {
          name: 'Winston Rooms',
          slug: 'winston-rooms',
        },
        isInperson: true,
        isOnline: false,
      },
    ])

    // test venue overflow
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at The Newer Vic and The New Vic and Anson Theatre and others and Online'
    )
  })

  it('has tickets button that emits event', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
          publiclyListed: true,
        },
        isInperson: true,
        isOnline: true,
      },
    ])
    await headerContainer.find('button').trigger('click')
    expect(headerContainer.emitted('on-buy-tickets-click').length).to.eq(1)
  })

  // no buy tickets when not bookable
  it('doesnt show buy tickets button when not bookable', async () => {
    await createWithPerformances([{}], {
      isBookable: false,
    })
    expect(fixTextSpacing(headerContainer.text())).not.to.contain(
      'Tickets available from £1.20'
    )
    expect(headerContainer.find('button').exists()).to.be.false
  })

  it('doesnt show buy tickets button when told to not be present', async () => {
    await createWithPerformances([{}], {}, false)
    expect(headerContainer.find('button').exists()).to.be.false
  })

  it('doesnt show detailed data when told to not show', async () => {
    await createWithPerformances([{}], {}, false, false)

    expect(headerContainer.text()).to.contain('Legally Ginger')
    expect(fixTextSpacing(headerContainer.text())).to.contain('by STA')
    expect(headerContainer.text()).to.not.contain('14 Nov - 18 Nov 2020')
    expect(headerContainer.text()).to.not.contain('1 hour, 42 minutes')
    expect(headerContainer.text()).to.not.contain(
      'Tickets available from £1.20'
    )
  })

  const createWithPerformances = (
    performances,
    productionOverrides,
    showBuyTicketsButton = true,
    showDetailedInfo = true
  ) => {
    const production = Production(productionOverrides)
    production.performances = GenericNodeConnection(
      performances.map((performance) => Performance(performance))
    )

    headerContainer = mount(
      ProductionHeader,
      generateMountOptions(['router'], {
        propsData: {
          production,
          showBuyTicketsButton,
          showDetailedInfo,
        },
      })
    )
  }
})

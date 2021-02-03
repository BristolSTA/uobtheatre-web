import { mount, RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';
import FakePerformance from 'tests/unit/fixtures/FakePerformance.js';
import FakeProduction from 'tests/unit/fixtures/FakeProduction.js';

import ProductionHeader from '@/components/production/ProductionBanner.vue';

import { fixTextSpacing, generateMountOptions } from '../../helpers.js';

describe('ProductionBanner', function () {
  let headerContainer;

  it('shows production details correctly', async () => {
    await createWithPerformances([
      {
        start: Date('2020-11-14'),
        venue: {
          name: 'The New Vic',
          slug: 'the-new-vic',
          publiclyListed: false,
        },
        isInperson: true,
        isOnline: false,
        durationMins: 102,
      },
      {
        start: Date('2020-11-15'),
        venue: {
          name: 'The Newer Vic',
          slug: 'the-newer-vic',
          publiclyListed: true,
        },
        isInperson: true,
        isOnline: false,
        durationMins: 112,
      },
    ]);

    // test correct show title
    expect(headerContainer.text()).to.contain('Legally Ginger');

    // test correct society performing show
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'by Joe Bloggs Productions'
    );
    expect(
      headerContainer.findAllComponents(RouterLinkStub).at(0).props('to').name
    ).to.equal('society');
    expect(
      headerContainer.findAllComponents(RouterLinkStub).at(0).props('to').params
        .societySlug
    ).to.equal('joe-bloggs-productions');

    // test combination of two venues
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at the The New Vic and The Newer Vic'
    );
    expect(
      headerContainer.findAllComponents(RouterLinkStub).at(1).props('to').name
    ).to.equal('venue');
    expect(
      headerContainer.findAllComponents(RouterLinkStub).at(1).props('to').params
        .venueSlug
    ).to.equal('the-newer-vic');
    expect(headerContainer.findAllComponents(RouterLinkStub).length).to.equal(
      2
    );

    // test production start and end dates
    expect(headerContainer.text()).to.contain('14 Nov - 18 Nov 2020');

    // test for performance time to be the minimum length, in human format
    expect(headerContainer.text()).to.contain('1 hour, 42 minutes');

    // test for correct ticket price
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Tickets available from £4.24'
    );

    // correct feature image
    expect(
      headerContainer
        .findComponent({
          ref: 'featured_image',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/featured-image.png');

    // correct society image
    expect(
      headerContainer
        .findComponent({
          ref: 'society_image',
        })
        .attributes('src')
    ).to.equal('http://pathto.example/logo-image.png');
  });

  it('shows no society image when none is given', async () => {
    await createWithPerformances([], {
      society: {
        name: 'Joe Bloggs Productions',
        logo: null,
      },
    });

    expect(
      headerContainer
        .findComponent({
          ref: 'society_image',
        })
        .exists()
    ).to.be.false;
  });

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
    ]);
    expect(fixTextSpacing(headerContainer.text())).to.contain('Watch Online');
    expect(headerContainer.findAllComponents(RouterLinkStub).length).to.equal(
      1
    );
  });

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
    ]);

    // test online and live
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at the The Newer Vic and Online '
    );
    expect(headerContainer.findAllComponents(RouterLinkStub).length).to.equal(
      2
    );
  });

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
        start: Date('2020-11-14'),
        venue: {
          name: 'The New Vic',
          slug: 'the-new-vic',
        },
        isInperson: true,
        isOnline: false,
      },
      {
        start: Date('2020-11-15'),
        venue: {
          name: 'Anson Theatre',
          slug: 'anson-theatre',
        },
        isInperson: true,
        isOnline: false,
      },
      {
        start: Date('2020-11-15'),
        venue: {
          name: 'Pegg Rooms',
          slug: 'pegg-rooms',
        },
        isInperson: true,
        isOnline: false,
      },
      {
        start: Date('2020-11-15'),
        venue: {
          name: 'Winston Rooms',
          slug: 'winston-rooms',
        },
        isInperson: true,
        isOnline: false,
      },
    ]);

    // test venue overflow
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at the The Newer Vic and The New Vic and Anson Theatre and others and Online'
    );
  });

  it('has tickets button that emits event', async () => {
    let button = headerContainer.find('button');
    await button.trigger('click');
    expect(headerContainer.emitted('on-buy-tickets-click').length).to.eq(1);
  });

  // no buy tickets when not bookable
  it('doesnt show buy tickets button when not bookable', async () => {
    await createWithPerformances([{}], {
      isBookable: false,
    });

    expect(headerContainer.find('button').exists()).to.be.false;
  });

  let createWithPerformances = (performances, productionOverrides) => {
    let perfs = [];
    performances.forEach((perf) => {
      perfs.push({
        node: Object.assign(FakePerformance(), perf),
      });
    });

    let production = Object.assign(FakeProduction(), productionOverrides);
    production.performances.edges = perfs;

    headerContainer = mount(
      ProductionHeader,
      generateMountOptions(['router'], {
        propsData: {
          production: production,
        },
      })
    );
  };
});

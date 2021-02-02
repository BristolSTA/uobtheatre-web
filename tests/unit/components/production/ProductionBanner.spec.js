import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import ProductionHeader from '@/components/production/ProductionBanner.vue';
import { productionService } from '@/services';

import { fixTextSpacing } from '../../helpers.js';

describe('ProductionBanner', function () {
  let headerContainer;

  it('shows production details correctly', async () => {
    await createWithPerformances([
      {
        start: Date('2020-11-14'),
        venue: {
          name: 'The New Vic',
        },
        isInperson: true,
        isOnline: false,
        durationMins: 102,
      },
      {
        start: Date('2020-11-15'),
        venue: {
          name: 'The Newer Vic',
        },
        isInperson: true,
        isOnline: false,
        durationMins: 112,
      },
    ]);

    // test correct show title
    expect(headerContainer.text()).to.contain('Legally Ginger');

    // test correct society performing show
    expect(headerContainer.text()).to.contain('by Joe Bloggs Productions');

    // test combination of two venues
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'The New Vic and The Newer Vic'
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
        },
        isInperson: false,
        isOnline: true,
      },
      {
        venue: {
          name: 'The Newer Vic',
        },
        isInperson: false,
        isOnline: true,
      },
    ]);
    expect(fixTextSpacing(headerContainer.text())).to.contain('Watch Online');
  });

  it('shows online and in person performances', async () => {
    await createWithPerformances([
      {
        venue: {
          name: 'New Vic',
        },
        isInperson: false,
        isOnline: true,
      },
      {
        venue: {
          name: 'New Vic',
        },
        isInperson: true,
        isOnline: false,
      },
    ]);
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at the New Vic and Online '
    );
  });

  it('has tickets button that emits event', async () => {
    let button = headerContainer.find('button');
    await button.trigger('click');
    expect(headerContainer.emitted('on-buy-tickets-click').length).to.eq(1);
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

    headerContainer = mount(ProductionHeader, {
      propsData: {
        production: production,
      },
    });
  };
});

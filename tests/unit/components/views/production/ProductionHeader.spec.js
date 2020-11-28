import { makeServer } from '@/fakeApi';
import { expect } from 'chai';
import ProductionHeader from '@/views/production/ProductionHeader.vue';

import { mount } from '@vue/test-utils';
import { productionService } from '@/services';
import { fixTextSpacing } from '../../../helpers.js';

describe('ProductionHeader', function () {
  let headerContainer;
  let server;
  beforeEach(async () => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('shows production details correctly', async () => {
    await createWithPerformances([
      {
        start: Date('2020-11-14'),
        venue: server.create('venue', {
          name: 'The New Vic',
        }),
        is_inperson: true,
        is_online: false,
        duration_mins: 102,
      },
      {
        start: Date('2020-11-15'),
        venue: server.create('venue', {
          name: 'The Newer Vic',
        }),
        is_inperson: true,
        is_online: false,
        duration_mins: 112,
      },
    ]);

    // test correct show title
    expect(headerContainer.text()).to.contain('Legally Ginger');

    // test correct society perfomring show
    expect(headerContainer.text()).to.contain('by Joe Bloggs Productions');

    // test combine of two venues
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'The New Vic and The Newer Vic'
    );

    // test production start and end dates
    expect(headerContainer.text()).to.contain('14 Nov - 18 Nov 2020');

    // test for performance time to be the minimum length, in nice format
    expect(headerContainer.text()).to.contain('1 hour, 42 minutes');

    // test for correct ticket price
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Tickets available from £4.34'
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
      society: server.create('society', {
        name: 'Joe Bloggs Productions',
        logo_image: null,
      }),
    });

    expect(
      headerContainer
        .findComponent({
          ref: 'society_image',
        })
        .exists()
    ).to.be.false;
  });

  it('shows online online only performances', async () => {
    await createWithPerformances([
      {
        venue: server.create('venue', {
          name: 'The New Vic',
        }),
        is_inperson: false,
        is_online: true,
      },
      {
        venue: server.create('venue', {
          name: 'The Newer Vic',
        }),
        is_inperson: false,
        is_online: true,
      },
    ]);

    // test online only
    expect(fixTextSpacing(headerContainer.text())).to.contain('View Online');
  });

  it('shows online and in person performances', async () => {
    await createWithPerformances([
      {
        venue: server.create('venue', {
          name: 'New Vic',
        }),
        is_inperson: false,
        is_online: true,
      },
      {
        venue: server.create('venue', {
          name: 'New Vic',
        }),
        is_inperson: true,
        is_online: false,
      },
    ]);

    // test online and live
    expect(fixTextSpacing(headerContainer.text())).to.contain(
      'Live at the New Vic and Online '
    );
  });

  let createWithPerformances = (performances, productionOverrides) => {
    let perfs = [];
    performances.forEach((perf) => {
      perfs.push(server.create('performance', perf));
    });

    server.create(
      'production',
      Object.assign(
        {
          name: 'Legally Ginger',
          slug: 'legally-ginger',
          cover_image: 'http://pathto.example/cover-image.png',
          poster_image: 'https://pathto.example/poster-image.png',
          featured_image: 'http://pathto.example/featured-image.png',
          society: server.create('society', {
            name: 'Joe Bloggs Productions',
            logo_image: 'http://pathto.example/logo-image.png',
          }),
          start_date: new Date('2020-11-14'),
          end_date: new Date('2020-11-18'),
          min_ticket_price: '4.34',
          performances: perfs,
        },
        productionOverrides
      )
    );

    return productionService
      .fetchProductionBySlug('legally-ginger')
      .then((production) => {
        headerContainer = mount(ProductionHeader, {
          propsData: {
            production: production,
          },
        });
      });
  };
});

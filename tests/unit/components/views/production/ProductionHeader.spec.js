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

    // let venue = server.create('venue', {
    //   name: 'The New Vic',
    // });

    server.create('production', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
      cover_image: 'http://pathto.example/my-image.png',
      society: server.create('society', {
        name: 'Joe Bloggs Productions',
        logo_image: 'http://pathto.example/logo-image.png',
      }),
      start_date: new Date('2020-11-14'),
      end_date: new Date('2020-11-18'),
      min_ticket_price: '4.34',
      performances: [
        server.create('performance', {
          start: Date('2020-11-14'),
          venue: server.create('venue', {
            name: 'The New Vic',
          }),
          is_inperson: true,
          is_online: false,
          duration_mins: 102,
        }),
        server.create('performance', {
          start: Date('2020-11-15'),
          venue: server.create('venue', {
            name: 'The Newer Vic',
          }),
          is_inperson: true,
          is_online: false,
          duration_mins: 112,
        }),
      ],
    });

    return productionService
      .fetchProductionBySlug('legally-ginger')
      .then((production) => {
        headerContainer = mount(ProductionHeader, {
          propsData: {
            production: production,
          },
        });
      });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('fall back while production is loading', async () => {
    await headerContainer.setProps({ production: null });
    expect(headerContainer.text()).to.contain('Loading Production...');
  });

  it('Testing text elecemts', () => {
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
      'Tickets avaliable from £4.34'
    );
  });

  it('Testing text for online only production', () => {});

  it('Testing text for online and in person production', () => {});
});

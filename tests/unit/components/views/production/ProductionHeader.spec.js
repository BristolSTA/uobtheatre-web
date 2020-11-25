import { makeServer } from '@/fakeApi';
import { expect } from 'chai';
import ProductionHeader from '@/views/production/ProductionHeader.vue';

import { mount } from '@vue/test-utils';
// import { waitFor } from '../../../helpers';

describe('ProductionHeader', function () {
  let headerContainer;
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    server.create('production', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
      cover_image: 'http://pathto.example/my-image.png',
      society: server.create('society', {
        name: 'Joe Bloggs Productions',
        logo_image: 'http://pathto.example/my-image.png',
      }),
      start_date: new Date('2020-11-14'),
      end_date: new Date('2020-11-18'),
      performances: server.createList('performance', 3),
    });

    headerContainer = mount(ProductionHeader, {
      mocks: {
        $route: {
          params: {
            productionSlug: 'legally-ginger',
          },
        },
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('fall back while producion is loading', () => {
    expect(headerContainer.text()).to.contain('Loading Production...');
  });
});

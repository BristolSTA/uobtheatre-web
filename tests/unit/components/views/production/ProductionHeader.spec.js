import { makeServer } from '@/server';
import { expect } from 'chai';
import ProductionHeader from '@/views/production/ProductionHeader.vue';

import { mount } from '@vue/test-utils';
import { waitFor } from '../../../helpers';

describe('ProductionHeader', function () {
  let headerContainer;
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    server.create('production', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
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

  it('fall back while producion is loading', () => {
    expect(headerContainer.text()).to.contain('Loading Production...');
  });

  let seedProductions = () => {
    // Seed a production that can be featured
    server.create('production', {
      name: 'Upside Down Cake',
      cover_image: 'http://pathto.example/my-image.png',
      society: server.create('society', { name: 'Joe Bloggs Productions' }),
      start_date: new Date('2020-11-14'),
      end_date: new Date('2020-11-18'),
      performances: server.createList('performance', 3),
    });
  };
});

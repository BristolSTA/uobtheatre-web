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

    let production = server.create('production', {
      name: 'Legally Ginger',
      slug: 'legally-ginger',
      cover_image: 'http://pathto.example/my-image.png',
      society: server.create('society', {
        name: 'Joe Bloggs Productions',
        logo_image: 'http://pathto.example/logo-image.png',
      }),
      start_date: new Date('2020-11-14'),
      end_date: new Date('2020-11-18'),
      performances: server.create('performance', {
        start: Date('2020-11-14'),
        venue: server.create('venue', {
          name: 'The New Vic',
        }),
      }),
    });

    headerContainer = mount(ProductionHeader, {
      propsData: {
        production: production,
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('fall back while production is loading', async () => {
    await headerContainer.setProps({ production: null });
    expect(headerContainer.text()).to.contain('Loading Production...');
  });

  it('correct production by correct society', () => {
    expect(headerContainer.text()).to.contain('Legally Ginger');

    expect(headerContainer.text()).to.contain('by Joe Bloggs Productions');

    expect(headerContainer.text()).to.contain('The New Vic');
  });
});

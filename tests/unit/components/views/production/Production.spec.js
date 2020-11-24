import { makeServer } from '@/server';
import { expect } from 'chai';
import Producion from '@/views/producion/Producion.vue';
import { mountWithRouterMock } from '../../helpers';
import { waitFor } from '../../../helpers';

describe('Production Page', function () {
  let productionComponent;
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    productionComponent = mountWithRouterMock(Producion);
  });

  afterEach(() => {
    server.shutdown();
  });
  
  describe('ProductionHeader', () => {
    let productionHeaderContainer;

    beforeEach(() => {
      productionHeaderContainer = productionComponent.findComponent({ ref: 'header'});
    });

    it('fall back while producion is loading', () => {
      expect(productionHeaderContainer.text()).to.contain(
        'Loading Production...'
      );
    });

    it('shows production with all details in header', async () => {
      seedProductions();

      productionComponent = mountWithRouterMock(Producion);
      productionHeaderContainer = productionComponent.findComponent({ ref: 'header'});
      await waitFor(() => productionComponent.vm.production);

    });
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
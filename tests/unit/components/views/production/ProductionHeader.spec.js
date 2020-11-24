import { makeServer } from '@/server';
import { expect } from 'chai';
import ProductionPage from '@/views/production/Production.vue';
import ProductionHeader from '@/views/production/ProductionHeader.vue';
import ProductionCastCredits from '@/views/production/ProductionCastCredits.vue';
import ProductionPerformances from '@/views/production/ProductionPerformances.vue';


import { mount } from '@vue/test-utils';
import { waitFor } from '../../../helpers';



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
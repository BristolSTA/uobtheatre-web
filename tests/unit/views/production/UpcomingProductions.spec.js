import { expect } from 'chai';

import ProductionTile from '@/components/production/ProductionTile';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import UpcomingProductions from '@/views/production/UpcomingProductions';

import {
  executeWithServer,
  generateMountOptions,
  mountWithRouterMock,
  waitFor,
} from '../../helpers';

describe('Upcoming Productions', () => {
  let component, server;
  beforeAll(async () => {
    server = await executeWithServer(() => {}, false);
  });
  afterAll(() => {
    server.shutdown();
  });
  beforeEach(async () => {
    component = await mountWithRouterMock(
      UpcomingProductions,
      generateMountOptions(['apollo'])
    );
  });

  it('contains an infinite scroll instance', () => {
    expect(component.findComponent(InfiniteScroll).exists()).to.be.true;
  });

  describe('with no productions', () => {
    it('displays no productions notice', async () => {
      await waitFor(() => !component.findComponent(InfiniteScroll).vm.loading);
      expect(component.text()).to.contain(
        'There are currently no upcoming productions'
      );
    });
  });

  describe('with many productions', () => {
    beforeAll(async () => {
      // Seed 3 x 9 performances
      server.create('productionNode', {
        name: 'Legally Ginger',
      });
      server.createList('productionNode', 9);
    });

    afterAll(() => {
      server.db.emptyData();
    });

    beforeEach(async () => {
      component = await mountWithRouterMock(
        UpcomingProductions,
        generateMountOptions(['apollo'])
      );
    });

    it('fetches first 9 performances and displays loader', async () => {
      await waitFor(() => !component.findComponent(InfiniteScroll).vm.loading);
      expect(component.findAllComponents(ProductionTile)).length(9);
      expect(
        component.findComponent(ProductionTile).props('production').name
      ).to.eq('Legally Ginger');

      expect(
        component
          .findComponent(InfiniteScroll)
          .findComponent({ ref: 'bottom-loader' })
          .exists()
      ).to.be.true;
      expect(component.text()).not.to.contain('Once upon a time');
    });
  });

  describe('with some productions', () => {
    beforeAll(async () => {
      server.create('productionNode', {
        name: 'Legally Ginger',
      });
      server.createList('productionNode', 2);
    });

    afterAll(() => {
      server.db.emptyData();
    });

    beforeEach(async () => {
      component = await mountWithRouterMock(
        UpcomingProductions,
        generateMountOptions(['apollo'])
      );
    });

    it('fetches all the productions and doesnt display loader', async () => {
      await waitFor(() => !component.findComponent(InfiniteScroll).vm.loading);
      expect(component.findAllComponents(ProductionTile)).length(3);
      expect(
        component.findComponent(ProductionTile).props('production').name
      ).to.eq('Legally Ginger');

      expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
        .false;
    });
  });
});

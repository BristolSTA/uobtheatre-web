import { expect } from 'chai';

import SocietyTile from '@/components/society/SocietyTile';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import AllSocieties from '@/views/societies/AllSocieties';

import {
  executeWithServer,
  generateMountOptions,
  mountWithRouterMock,
  waitFor,
} from '../../helpers';

describe('All Societies', () => {
  let allSocietiesComponent, server;
  beforeAll(async () => {
    server = await executeWithServer(() => {}, false);
  });
  afterAll(() => {
    server.shutdown();
  });
  beforeEach(async () => {
    allSocietiesComponent = await mountWithRouterMock(
      AllSocieties,
      generateMountOptions(['apollo'])
    );
  });

  it('contains an infinite scroll instance', () => {
    expect(allSocietiesComponent.findComponent(InfiniteScroll).exists()).to.be
      .true;
  });

  describe('with no productions', () => {
    it('displays no productions notice', async () => {
      await waitFor(
        () => !allSocietiesComponent.findComponent(InfiniteScroll).vm.loading
      );
      expect(allSocietiesComponent.text()).to.contain('Loading Societies');
    });
  });

  describe('with many productions', () => {
    beforeAll(async () => {
      server.create('societyNode', {
        name: 'Dramsoc',
      });
      server.createList('societyNode', 9);
    });

    afterAll(() => {
      server.db.emptyData();
    });

    beforeEach(async () => {
      allSocietiesComponent = await mountWithRouterMock(
        AllSocieties,
        generateMountOptions(['apollo'])
      );
    });

    it('fetches first 9 societies and displays loader', async () => {
      await waitFor(
        () => !allSocietiesComponent.findComponent(InfiniteScroll).vm.loading
      );
      expect(allSocietiesComponent.findAllComponents(SocietyTile)).length(9);
      expect(
        allSocietiesComponent.findComponent(SocietyTile).props('society').name
      ).to.eq('Dramsoc');

      expect(
        allSocietiesComponent
          .findComponent(InfiniteScroll)
          .findComponent({ ref: 'bottom-loader' })
          .exists()
      ).to.be.true;
      expect(allSocietiesComponent.text()).not.to.contain('MTB');
    });
  });

  describe('with some societies', () => {
    beforeAll(async () => {
      server.create('societyNode', {
        name: 'Dramsoc',
      });
      server.createList('societyNode', 2);
    });

    afterAll(() => {
      server.db.emptyData();
    });

    beforeEach(async () => {
      allSocietiesComponent = await mountWithRouterMock(
        AllSocieties,
        generateMountOptions(['apollo'])
      );
    });

    it('fetches all the productions and doesnt display loader', async () => {
      await waitFor(
        () => !allSocietiesComponent.findComponent(InfiniteScroll).vm.loading
      );
      expect(allSocietiesComponent.findAllComponents(SocietyTile)).length(3);
      expect(
        allSocietiesComponent.findComponent(SocietyTile).props('society').name
      ).to.eq('Dramsoc');

      expect(
        allSocietiesComponent.findComponent({ ref: 'bottom-loader' }).exists()
      ).to.be.false;
    });
  });
});

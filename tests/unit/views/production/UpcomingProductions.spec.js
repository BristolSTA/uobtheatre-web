import { expect } from 'chai';

import ProductionTile from '@/components/production/ProductionTile';
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

  it('registers scroll callback on mount', async () => {
    let addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    let component = await mountWithRouterMock(
      UpcomingProductions,
      generateMountOptions(['apollo'])
    );
    expect(addEventListenerSpy.mock.calls[0][0]).to.eq('scroll');
    expect(addEventListenerSpy.mock.calls[0][1]).to.eq(
      component.vm.handleScroll
    );
  });

  it('removes scroll callback on destory', async () => {
    let removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    let component = await mountWithRouterMock(
      UpcomingProductions,
      generateMountOptions(['apollo'])
    );
    component.destroy();
    expect(removeEventListenerSpy.mock.calls[0][0]).to.eq('scroll');
    expect(removeEventListenerSpy.mock.calls[0][1]).to.eq(
      component.vm.handleScroll
    );
  });

  describe('with no productions', () => {
    beforeEach(async () => {
      component = await mountWithRouterMock(
        UpcomingProductions,
        generateMountOptions(['apollo'])
      );
    });
    it('displays no productions notice', async () => {
      await waitFor(() => !component.vm.$apollo.queries.productions.loading);
      expect(component.text()).to.contain(
        'There are currently no upcoming productions'
      );
    });
  });

  describe('with lots of productions', () => {
    beforeAll(async () => {
      // Seed 3 x 9 performances
      server.create('productionNode', {
        name: 'Legally Ginger',
      });
      server.createList('productionNode', 8);
      server.create('productionNode', {
        name: 'Once upon a time',
      });
      server.createList('productionNode', 18);
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
      await waitFor(() => component.vm.productions.length);
      expect(component.findAllComponents(ProductionTile)).length(9);
      expect(
        component.findComponent(ProductionTile).props('production').name
      ).to.eq('Legally Ginger');

      expect(component.findComponent({ ref: 'bottom-loader' }).exists());
      expect(component.text()).not.to.contain('Once upon a time');
    });

    it('loads next chunk when loader scrolled into view', async () => {
      let fetchMoreSpy = jest.spyOn(
        component.vm.$apollo.queries.productions,
        'fetchMore'
      );
      // Set the bottom loader to have a mock pixel height of 800
      Object.defineProperty(component.vm.$refs['bottom-loader'], 'offsetTop', {
        writable: false,
        value: 800,
      });
      await waitFor(() => component.vm.productions.length);

      // Expecting not to trigger the fetch routine (loader @ 800px, bottom of browser @ 768px)
      component.vm.handleScroll();
      expect(fetchMoreSpy.mock.calls).length(0);

      // Should trigger fetch (loader @ 800px, bottom of browser @ 1000px)
      window.scrollY = 1000 - 768;
      component.vm.handleScroll();
      expect(fetchMoreSpy.mock.calls).length(1);

      return waitFor(() => component.vm.productions.length == 18).then(() => {
        expect(
          component.findAllComponents(ProductionTile).at(9).props('production')
            .name
        ).to.eq('Once upon a time');
        expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
          .true;
      });
    });
  });

  describe('with enough productions for one more page', () => {
    beforeAll(async () => {
      // Seed 2 x 9 performances
      server.create('productionNode', {
        name: 'Legally Ginger',
      });
      server.createList('productionNode', 17);
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

    it('can load one more page, and then no more', async () => {
      let fetchMoreSpy = jest.spyOn(
        component.vm.$apollo.queries.productions,
        'fetchMore'
      );
      // Set the bottom loader to have a mock pixel height of 800
      Object.defineProperty(component.vm.$refs['bottom-loader'], 'offsetTop', {
        writable: false,
        value: 800,
      });
      await waitFor(() => component.vm.productions.length);

      // Should trigger fetch (loader @ 800px, bottom of browser @ 1000px)
      window.scrollY = 1000 - 768;
      component.vm.handleScroll();
      expect(fetchMoreSpy.mock.calls).length(1);

      return waitFor(() => component.vm.productions.length == 18).then(() => {
        expect(component.findComponent({ ref: 'bottom-loader' }).exists()).to.be
          .false;

        // Check it doesn't trigger again
        component.vm.handleScroll();
        expect(fetchMoreSpy.mock.calls).length(1);
      });
    });
  });
});

import { expect } from 'chai';

import OverviewBox from '@/components/overview/OverviewBox.vue';
import PerformanceOverview from '@/components/overview/PerformanceOverview.vue';

import { mountWithRouterMock } from '../../helpers';
import {
  createFromFactoryAndSerialize,
  executeWithServer,
} from '../../helpers';

describe('performance overview box', function () {
  let performanceOverviewComponent;
  let production;
  let performance;

  beforeAll(async () => {
    executeWithServer((server) => {
      production = createFromFactoryAndSerialize(
        'production',
        1,
        {
          name: 'Legally Ginger',
        },
        server
      );
    });
    executeWithServer((server) => {
      performance = createFromFactoryAndSerialize(
        'performance',
        1,
        {
          doors_open: '2020-12-25T09:00:00',
          start: '2020-12-25T10:00:00',
          end: '2020-12-25T12:00:00',
          sold_out: false,
        },
        server
      );
    });
    performanceOverviewComponent = await mountWithRouterMock(
      PerformanceOverview,
      {
        propsData: {
          production: production,
          performance: performance,
        },
      }
    );
  });

  it('has overview box component', async () => {
    expect(performanceOverviewComponent.findComponent(OverviewBox).exists()).to
      .be.true;
  });

  describe('overview box component', () => {
    let infoBox;
    beforeEach(() => {
      infoBox = performanceOverviewComponent.findComponent(OverviewBox);
    });

    it('has the correct performance information', async () => {
      expect(infoBox.text()).to.contain('Legally Ginger');
      expect(infoBox.text()).to.contain('Friday 25 December 2020');
      expect(infoBox.text()).to.contain('Doors Open: 09:00');
      expect(infoBox.text()).to.contain('Performance Starts: 10:00');
    });
  });
});

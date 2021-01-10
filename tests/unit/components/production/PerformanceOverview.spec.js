import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import PerformanceOverview from '@/components/production/PerformanceOverview.vue';

import { mountWithRouterMock } from '../../helpers';
import {
  createFromFactoryAndSerialize,
  executeWithServer,
} from '../../helpers';
import { fixTextSpacing } from '../../helpers.js';

describe('Pick Performance Stage', () => {
  let performanceOverviewComponent;
  let performance;

  beforeAll(async () => {
    executeWithServer((server) => {
      performance = createFromFactoryAndSerialize(
        'performance',
        1,
        {
          start: new Date('28 November 2020 16:00:00 GMT').toISOString(),
          end: new Date('28 November 2020 18:00:00 GMT').toISOString(),
          sold_out: false,
          disabled: false,
          is_online: true,
          is_inperson: true,
          venue: server.create('venue', {
            name: 'Winston Theatre',
            slug: 'winston-theatre',
          }),
        },
        server
      );
    });
    performanceOverviewComponent = await mountWithRouterMock(
      PerformanceOverview,
      {
        propsData: {
          performance: performance,
        },
      }
    );
  });

  it('An available in-person & online performance', async () => {
    expect(performanceOverviewComponent.text()).to.contain('Saturday 28 Nov');
    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .true;
    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      'Winston Theatre and Online'
    );
    expect(performanceOverviewComponent.find('a').text()).to.eq(
      'Winston Theatre'
    );
    expect(performanceOverviewComponent.text()).to.contain('Starting at 16:00');
    expect(performanceOverviewComponent.text()).to.contain('Tickets Available');
    expect(performanceOverviewComponent.find('button').text()).to.eq('Book');
  });

  it('has working venue link', async () => {
    expect(
      performanceOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(0)
        .props('to').name
    ).to.equal('venue');
    expect(
      performanceOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(0)
        .props('to').params.venueSlug
    ).to.equal('winston-theatre');
  });

  //TODO: Test for link to booking page

  // it('has correct booking link', async () => {
  //   await performanceOverviewComponent.find('button').trigger('click');
  //   await performanceOverviewComponent.vm.$nextTick();
  //   expect(performanceOverviewComponent.emitted().performance).to.be.true;
  // });

  it('A disabled, in-person performance', async () => {
    await performanceOverviewComponent.setProps({
      performance: Object.assign({}, performance, {
        disabled: true,
        is_online: false,
        is_inperson: true,
      }),
    });

    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .false;
    expect(performanceOverviewComponent.find('div.bg-sta-gray-dark').exists())
      .to.be.true;
    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      'Winston Theatre'
    );
    expect(performanceOverviewComponent.text()).to.contain(
      'No Tickets Available'
    );
    expect(performanceOverviewComponent.find('button').text()).to.eq(
      'Unavailable'
    );
  });

  it('A disabled, in-person performance', async () => {
    await performanceOverviewComponent.setProps({
      performance: Object.assign({}, performance, {
        sold_out: true,
        disabled: false,
        is_online: true,
        is_inperson: false,
      }),
    });

    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .false;
    expect(performanceOverviewComponent.find('div.bg-sta-gray-dark').exists())
      .to.be.true;
    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      'Online'
    );
    expect(performanceOverviewComponent.text()).to.contain(
      'No Tickets Available'
    );
    expect(performanceOverviewComponent.find('button').text()).to.eq(
      'SOLD OUT'
    );
  });
});

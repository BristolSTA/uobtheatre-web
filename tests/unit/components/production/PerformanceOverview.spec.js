import { RouterLinkStub } from '@vue/test-utils';
import { expect } from 'chai';

import { mountWithRouterMock, fixTextSpacing } from '../../helpers';
import Performance from '../../fixtures/Performance';
import PerformanceOverview from '@/components/performance/PerformanceOverview.vue';

describe('Performance Overview', () => {
  let performanceOverviewComponent;

  beforeEach(async () => {
    performanceOverviewComponent = await mountWithRouterMock(
      PerformanceOverview,
      {
        propsData: {
          performance: Performance({
            isOnline: true,
          }),
        },
      }
    );
  });

  it('An available in-person & online performance', () => {
    expect(performanceOverviewComponent.text()).to.contain('Monday 9 Mar');
    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .true;
    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      'Anson Theatre and Online'
    );
    expect(performanceOverviewComponent.find('a').text()).to.eq(
      'Anson Theatre'
    );
    expect(performanceOverviewComponent.text()).to.contain(
      'Doors open at 15:00'
    );
    expect(performanceOverviewComponent.text()).to.contain('2 hours');
    expect(performanceOverviewComponent.text()).to.contain('Tickets Available');
    expect(performanceOverviewComponent.find('button').text()).to.eq('Book');
  });

  it('has working venue link', () => {
    expect(
      performanceOverviewComponent
        .findAllComponents(RouterLinkStub)
        .at(0)
        .props('to')
    ).to.equal('/venue/anson-theatre');
  });

  it('has correct booking link', async () => {
    await performanceOverviewComponent.find('button').trigger('click');

    expect(performanceOverviewComponent.emitted('select').length).to.eq(1);
  });

  it('A disabled, in-person performance', async () => {
    await performanceOverviewComponent.setProps({
      performance: Object.assign({}, Performance(), {
        disabled: true,
        isBookable: false,
        isOnline: false,
        isInperson: true,
      }),
    });
    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .false;
    expect(performanceOverviewComponent.find('div.bg-sta-gray-dark').exists())
      .to.be.true;
    expect(performanceOverviewComponent.find('a').text()).to.eq(
      'Anson Theatre'
    );
    expect(performanceOverviewComponent.text()).to.contain(
      'No Tickets Available'
    );
    expect(performanceOverviewComponent.find('button').text()).to.eq(
      'Unavailable'
    );
    expect(
      performanceOverviewComponent.find('button').attributes('disabled')
    ).to.eq('disabled');
  });

  it('A disabled, soldout, in-person performance', async () => {
    await performanceOverviewComponent.setProps({
      performance: Object.assign({}, Performance(), {
        soldOut: true,
        disabled: false,
        isBookable: false,
        isOnline: true,
        isInperson: false,
      }),
    });

    expect(performanceOverviewComponent.find('div.bg-sta-green').exists()).to.be
      .false;
    expect(performanceOverviewComponent.find('div.bg-sta-gray-dark').exists())
      .to.be.true;
    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      'Online'
    );
    expect(
      performanceOverviewComponent.findAllComponents(RouterLinkStub).length
    ).to.eq(0);
    expect(performanceOverviewComponent.text()).to.contain(
      'No Tickets Available'
    );
    expect(performanceOverviewComponent.find('button').text()).to.eq(
      'SOLD OUT'
    );
    expect(
      performanceOverviewComponent.find('button').attributes('disabled')
    ).to.eq('disabled');
  });

  it.each([null, 10])('shows interval length when able', async (duration) => {
    await performanceOverviewComponent.setProps({
      performance: Performance({ intervalDurationMins: duration }),
    });

    expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
      duration ? '2 hours inc. interval' : '2 hours'
    );
  });
});

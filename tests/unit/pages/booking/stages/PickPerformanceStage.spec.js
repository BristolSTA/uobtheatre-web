import { expect } from 'chai';

import { mountWithRouterMock } from '../../../helpers';
import PerformanceOverview from '@/components/performance/PerformanceOverview.vue';

import PickPerformanceStage from '@/pages/production/_slug/book/index.vue';
import Production from '@/tests/unit/fixtures/Production';
import Performance from '@/tests/unit/fixtures/Performance';
import GenericNodeConnection from '@/tests/unit/fixtures/support/GenericNodeConnection';

describe('Pick Performance Stage', () => {
  let stageComponent;
  let production;

  beforeAll(async () => {
    production = Production({
      performances: GenericNodeConnection([
        Performance({
          start: '2020-12-25T10:00:00',
          end: '2020-12-25T12:00:00',
          soldOut: false,
        }),
        Performance({
          start: '2020-12-26T14:00:00',
          end: '2020-12-26T16:00:00',
          soldOut: false,
        }),
        Performance({
          start: '2020-12-27T18:00:00',
          end: '2020-12-27T20:00:00',
          soldOut: false,
        }),
      ]),
    });
    stageComponent = await mountWithRouterMock(PickPerformanceStage, {
      propsData: {
        production,
      },
    });
  });

  it('displays the correct number of performance overviews', () => {
    const overviews = stageComponent.findAllComponents(PerformanceOverview);
    expect(overviews.length).to.eq(3);
    expect(overviews.at(0).props('performance')).to.eq(
      production.performances.edges[0].node
    );
    expect(overviews.at(1).props('performance')).to.eq(
      production.performances.edges[1].node
    );
    expect(overviews.at(2).props('performance')).to.eq(
      production.performances.edges[2].node
    );
  });

  // TODO: Fix
  // it('groups the performances into their times of day', () => {
  //   const overview = stageComponent.findAllComponents({
  //     ref: 'performance-group',
  //   })

  //   expect(overview.at(0).find('h2').text()).to.eq('Morning')
  //   expect(overview.at(0).findAll('.mb-4 > div').length).to.eq(1)

  //   expect(overview.at(1).find('h2').text()).to.eq('Afternoon')
  //   expect(overview.at(1).findAll('.mb-4 > div').length).to.eq(1)

  //   expect(overview.at(2).find('h2').text()).to.eq('Evening')
  //   expect(overview.at(2).findAll('.mb-4 > div').length).to.eq(1)
  // })

  it('emits select-performance event', () => {
    stageComponent.findComponent(PerformanceOverview).vm.$emit('select');
    expect(stageComponent.emitted('select-performance').length).to.eq(1);
    expect(stageComponent.emitted('select-performance')[0][0]).to.eq(
      production.performances.edges[0].node
    );
  });
});

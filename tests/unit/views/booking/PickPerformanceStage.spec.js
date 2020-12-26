import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import PerformanceOverview from '@/components/production/PerformanceOverview.vue';
import PickPerformanceStage from '@/views/booking/stages/PickPerformanceStage.vue';

import {
  createFromFactoryAndSerialize,
  executeWithServer,
} from '../../helpers';

describe('Pick Performance Stage', () => {
  let stageComponent;
  let production;

  beforeAll(() => {
    executeWithServer((server) => {
      production = createFromFactoryAndSerialize(
        'production',
        1,
        {
          performances: [
            server.create('performance', {
              start: '2020-12-25T10:00:00',
              end: '2020-12-25T12:00:00',
              sold_out: false,
            }),
            server.create('performance', {
              start: '2020-12-26T14:00:00',
              end: '2020-12-26T16:00:00',
              sold_out: false,
            }),
            server.create('performance', {
              start: '2020-12-27T18:00:00',
              end: '2020-12-27T20:00:00',
              sold_out: false,
            }),
          ],
        },
        server
      );
    });
    stageComponent = mount(PickPerformanceStage, {
      propsData: {
        production: production,
      },
    });
  });

  it('displays the correct number of performance overviews', () => {
    let overviews = stageComponent.findAllComponents(PerformanceOverview);
    expect(overviews.length).to.eq(3);
    expect(overviews.at(0).props('performance')).to.eq(
      production.performances[0]
    );
    expect(overviews.at(1).props('performance')).to.eq(
      production.performances[1]
    );
    expect(overviews.at(2).props('performance')).to.eq(
      production.performances[2]
    );
  });

  it('groups the performances into their times of day', () => {
    let overview = stageComponent.findAllComponents({
      ref: 'performanceGroup',
    });

    expect(overview.at(0).find('h2').text()).to.eq('Morning');
    expect(overview.at(0).findAll('.mb-4 > div').length).to.eq(1);

    expect(overview.at(1).find('h2').text()).to.eq('Afternoon');
    expect(overview.at(1).findAll('.mb-4 > div').length).to.eq(1);

    expect(overview.at(2).find('h2').text()).to.eq('Evening');
    expect(overview.at(2).findAll('.mb-4 > div').length).to.eq(1);
  });

  it('emits select-performance event', () => {
    stageComponent.findComponent(PerformanceOverview).vm.$emit('select');
    expect(stageComponent.emitted('select-performance').length).to.eq(1);
    expect(stageComponent.emitted('select-performance')[0][0]).to.eq(
      production.performances[0]
    );
  });
});

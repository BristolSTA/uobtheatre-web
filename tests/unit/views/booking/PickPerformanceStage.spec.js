import { expect } from 'chai';
import gql from 'graphql-tag';
import { DateTime } from 'luxon';

import PerformanceOverview from '@/components/production/PerformanceOverview.vue';
import ProductionFragment from '@/graphql/fragments/ProductionFragment.gql';
import PickPerformanceStage from '@/views/booking/stages/PickPerformanceStage.vue';

import FakeProduction from '../../fixtures/FakeProduction';
import {
  executeWithServer,
  mountWithRouterMock,
  runApolloQuery,
} from '../../helpers';

describe('Pick Performance Stage', () => {
  let stageComponent;
  let production;

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      production = server.create(
        'productionNode',
        Object.assign({}, FakeProduction(server), {
          performances: [
            server.create('performanceNode', {
              start: DateTime.fromISO('2020-12-25T10:00:00'),
              end: DateTime.fromISO('2020-12-25T12:00:00'),
              soldOut: false,
            }),
            server.create('performanceNode', {
              start: DateTime.fromISO('2020-12-26T14:00:00'),
              end: DateTime.fromISO('2020-12-26T16:00:00'),
              soldOut: false,
            }),
            server.create('performanceNode', {
              start: DateTime.fromISO('2020-12-27T18:00:00'),
              end: DateTime.fromISO('2020-12-27T20:00:00'),
              soldOut: false,
            }),
          ],
        })
      );
      let gqlResult = await runApolloQuery({
        query: gql`
          query {
            production(slug: "${production.slug}") {
              ...ProductionBasicInfo
            }
          }
          ${ProductionFragment}
        `,
      });
      production = gqlResult.data.production;

      stageComponent = await mountWithRouterMock(PickPerformanceStage, {
        propsData: {
          production: production,
        },
      });
    });
  });

  it('displays the correct number of performance overviews', () => {
    let overviews = stageComponent.findAllComponents(PerformanceOverview);
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
      production.performances.edges[0].node
    );
  });
});

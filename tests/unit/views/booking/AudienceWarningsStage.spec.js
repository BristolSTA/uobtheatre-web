import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import gql from 'graphql-tag';

import AudienceWarningsStage from '@/views/booking/stages/AudienceWarningsStage.vue';

import FakeProduction from '../../fixtures/FakeProduction';
import { executeWithServer, runApolloQuery } from '../../helpers';

describe('Pick Performance Stage', () => {
  let stageComponent;

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      let production = server.create('productionNode');

      let { data } = await runApolloQuery({
        query: gql`
          query production {
            production(slug: "${production.slug}") {
              warnings {
                warning
              }
            }
          }
        `,
      });

      stageComponent = mount(AudienceWarningsStage, {
        propsData: {
          production: data.production,
        },
      });
    });
  });

  it('displays the warnings', () => {
    expect(stageComponent.text()).to.contain('Strobe Lighting');
    expect(stageComponent.text()).to.contain('Nudity');
  });

  it('emits event on understood', () => {
    stageComponent.find('button').trigger('click');
    expect(stageComponent.emitted('next-stage').length).to.eq(1);
  });
});

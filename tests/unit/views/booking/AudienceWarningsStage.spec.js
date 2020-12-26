import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import AudienceWarningsStage from '@/views/booking/stages/AudienceWarningsStage.vue';

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
          warnings: ['Strobe lighting is in use', 'Something else'],
        },
        server
      );
    });
    stageComponent = mount(AudienceWarningsStage, {
      propsData: {
        production: production,
      },
    });
  });

  it('displays the warnings', () => {
    expect(stageComponent.text()).to.contain('Strobe lighting is in use');
    expect(stageComponent.text()).to.contain('Something else');
  });

  it('emits event on understood', () => {
    stageComponent.find('button').trigger('click');
    expect(stageComponent.emitted('understood')).to.be.ok;
  });
});

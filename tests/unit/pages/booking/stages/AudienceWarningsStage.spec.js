import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import gql from 'graphql-tag'

import AudienceWarningsStage from '@/pages/production/_slug/book/_performanceId/warnings.vue'
import Production from '@/tests/unit/fixtures/Production'

describe('Audience Warnings Stage', () => {
  let stageComponent

  beforeAll(async () => {
    stageComponent = mount(AudienceWarningsStage, {
      propsData: {
        production: Production(),
      },
    })
  })

  it('displays the warnings', () => {
    expect(stageComponent.text()).to.contain('Strobe Lighting')
    expect(stageComponent.text()).to.contain('Nudity')
  })

  it('emits event on understood', () => {
    stageComponent.find('button').trigger('click')
    expect(stageComponent.emitted('next-stage').length).to.eq(1)
  })
})

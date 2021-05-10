import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import gql from 'graphql-tag'

import AudienceWarningsStage from '@/pages/production/_slug/book/_performanceId/warnings.vue'

import { executeWithServer, runApolloQuery } from '../../../helpers'

describe('Audience Warnings Stage', () => {
  let stageComponent

  beforeAll(async () => {
    await executeWithServer(async (server) => {
      const production = server.create('productionNode')

      const { data } = await runApolloQuery({
        query: gql`
          query production {
            production(slug: "${production.slug}") {
              warnings {
                warning
              }
            }
          }
        `,
      })

      stageComponent = mount(AudienceWarningsStage, {
        propsData: {
          production: data.production,
        },
      })
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

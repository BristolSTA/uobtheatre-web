import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import BookingCls from '@/classes/Booking'

import AudienceWarningsStage from '@/pages/production/_slug/book/_performanceId/warnings.vue'
import Production from '@/tests/unit/fixtures/Production'
import Booking from '@/tests/unit/fixtures/Booking'

describe('Audience Warnings Stage', () => {
  let warningComponent

  describe('with warnings, and no performance description', () => {
    beforeAll(() => {
      warningComponent = mount(AudienceWarningsStage, {
        propsData: {
          production: Production(),
          booking: BookingCls.fromAPIData(
            Booking({ performance: { descrption: null } })
          ),
        },
      })
    })

    it('doesnt display any production description', () => {
      expect(warningComponent.text()).to.not.contain('Performance Information')
      expect(warningComponent.text()).to.not.contain(
        'the performance description'
      )
    })

    it('displays the warnings', () => {
      expect(warningComponent.text()).to.contain('Strobe Lighting')
      expect(warningComponent.text()).to.contain('Nudity')
    })

    it('emits event on understood', () => {
      warningComponent.find('button').trigger('click')
      expect(warningComponent.emitted('next-stage').length).to.eq(1)
    })
  })

  describe('with performance description and no warnings', () => {
    beforeAll(() => {
      warningComponent = mount(AudienceWarningsStage, {
        propsData: {
          production: Production({ contentWarnings: [] }),
          booking: BookingCls.fromAPIData(Booking()),
        },
      })
    })

    it('displays the production description', () => {
      expect(warningComponent.text()).to.contain('Performance Information')
      expect(warningComponent.text()).to.contain('the performance description')
    })

    it('doesnt display any warnings', () => {
      expect(warningComponent.text()).to.not.contain('Strobe Lighting')
      expect(warningComponent.text()).to.not.contain('Nudity')
    })

    it('emits event on understood', () => {
      warningComponent.find('button').trigger('click')
      expect(warningComponent.emitted('next-stage').length).to.eq(1)
    })
  })
})

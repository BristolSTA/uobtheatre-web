import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import { fixTextSpacing } from '@/tests/unit/helpers'

import OverviewBox from '@/components/ui/Card.vue'
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue'

import Performance from '@/tests/unit/fixtures/Performance'
import Production from '@/tests/unit/fixtures/Production'

describe('Performance Overview', function () {
  let performanceOverviewComponent

  beforeAll(() => {
    performanceOverviewComponent = mount(PerformanceOverview, {
      propsData: {
        production: Production(),
        performance: Performance()
      }
    })
  })

  it('has overview box component', () => {
    expect(performanceOverviewComponent.findComponent(OverviewBox).exists()).to
      .be.true
  })

  describe('performance overview component', () => {
    it('has the correct performance information', () => {
      expect(performanceOverviewComponent.text()).to.contain('Performance')
      expect(performanceOverviewComponent.text()).to.contain(
        'Monday 9 March 2020'
      )
      expect(performanceOverviewComponent.text()).to.contain(
        'Doors Open: 15:00'
      )
      expect(performanceOverviewComponent.text()).to.contain(
        'Performance Starts: 16:00'
      )
    })
    it.each([null, 10])('shows interval length when able', async (duration) => {
      await performanceOverviewComponent.setProps({
        performance: Performance({ intervalDurationMins: duration })
      })

      expect(fixTextSpacing(performanceOverviewComponent.text())).to.contain(
        duration ? `2 hours inc. ${duration} min interval` : '2 hours'
      )
    })
  })
})

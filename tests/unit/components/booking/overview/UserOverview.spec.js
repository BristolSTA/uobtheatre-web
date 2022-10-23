import { createLocalVue, mount } from '@vue/test-utils'
import { expect } from 'chai'
import Vuex from 'vuex'

import { fixTextSpacing } from '../../../helpers'
import UserOverview from '@/components/booking/overview/UserOverview.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store({
  state: {
    auth: {
      user: {
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joe.bloggs@example.org'
      }
    }
  }
})

describe('User Overview', () => {
  let userOverviewComponent
  beforeEach(() => {
    userOverviewComponent = mount(UserOverview, {
      store,
      localVue
    })
  })

  it('shows users details from veux', () => {
    expect(fixTextSpacing(userOverviewComponent.text())).to.contain(
      'Joe Bloggs'
    )
    expect(fixTextSpacing(userOverviewComponent.text())).to.contain(
      'joe.bloggs@example.org'
    )
  })
})

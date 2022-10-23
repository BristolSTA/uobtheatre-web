import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import { fixTextSpacing } from '../../helpers'
import Performance from '../../fixtures/Performance'
import Ticket from '@/classes/Ticket'
import ConcessionType from '@/components/booking/ConcessionType.vue'
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue'
import SeatGroup from '@/components/booking/SeatGroup.vue'

describe('Seat Location Component', () => {
  let seatGroupComponent
  let ticketOption
  let discounts
  beforeEach(() => {
    const performance = Performance()

    const student = {
      name: 'Student',
      id: 2
    }
    performance.ticketOptions[0].concessionTypes.push({
      concessionType: student,
      price: 800,
      pricePounds: '8.00'
    })

    discounts = performance.discounts.edges.map(edge => edge.node)

    discounts[0].requirements.push({
      id: 1,
      number: 2,
      discount: null,
      concessionType: student
    })

    seatGroupComponent = mount(SeatGroup, {
      propsData: {
        expanded: false,
        ticketOption: (ticketOption = performance.ticketOptions[0]),
        groupCapacityRemaining: 100,
        currentTickets: [],
        discounts
      }
    })
  })

  it('emits even on header click', async () => {
    await seatGroupComponent.findComponent({ ref: 'header' }).trigger('click')
    expect(seatGroupComponent.emitted()['select-location'].length).to.eq(1)
  })

  it('displays seat group name', () => {
    expect(
      seatGroupComponent.findComponent({ ref: 'header' }).text()
    ).to.contain('Best seats in the house')
  })

  it('doesnt display concession types + ticket warnings if not exapnded', () => {
    expect(seatGroupComponent.findAllComponents(ConcessionType).length).to.eq(0)

    expect(seatGroupComponent.findComponent({ ref: 'ticket-warning' }).exists())
      .to.be.false
  })

  it('displays seat group description if expanded', async () => {
    const header = seatGroupComponent.findComponent({ ref: 'header' })
    expect(header.text()).not.to.contain('The best seats obviously')
    await seatGroupComponent.setProps({
      expanded: true
    })
    expect(header.text()).to.contain('The best seats obviously')
  })

  it('displays correct ticket warnings', async () => {
    await seatGroupComponent.setProps({
      expanded: true,
      groupCapacityRemaining: 9
    })
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'Hurry! Only 9 tickets remaining in this location'
    )

    // check for upper limit
    await seatGroupComponent.setProps({ groupCapacityRemaining: 10 })
    expect(seatGroupComponent.text()).not.to.contain('Hurry!')

    // check for lower limit
    await seatGroupComponent.setProps({ groupCapacityRemaining: 1 })
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'Hurry! Only 1 ticket remaining in this location'
    )

    await seatGroupComponent.setProps({ groupCapacityRemaining: 0 })
    expect(fixTextSpacing(seatGroupComponent.text())).to.contain(
      'No more tickets available at this location'
    )
  })

  it('contains the correct amount of concession type components', async () => {
    const tickets = [new Ticket(1, 1), new Ticket(1, 1), new Ticket(1, 2)]
    await seatGroupComponent.setProps({
      expanded: true,
      currentTickets: tickets
    })

    expect(seatGroupComponent.findComponent({ ref: 'ticket-warning' }).exists())
      .to.be.false

    const concessionTypeComponents =
      seatGroupComponent.findAllComponents(ConcessionType)
    expect(concessionTypeComponents.length).to.eq(2)

    expect(
      concessionTypeComponents.at(0).props('concessionTypeEdge').concessionType
        .name
    ).to.eq('Adult')

    expect(concessionTypeComponents.at(0).props('maxAddAllowed')).to.eq(100)
    expect(concessionTypeComponents.at(0).props('currentTickets').length).to.eq(
      3
    )

    expect(
      concessionTypeComponents.at(1).props('concessionTypeEdge').concessionType
        .name
    ).to.eq('Student')
    expect(concessionTypeComponents.at(1).props('currentTickets').length).to.eq(
      3
    )
  })

  it('contains the correct amount of group ticket buttons', async () => {
    await seatGroupComponent.setProps({
      expanded: true
    })
    const discountComponents =
      seatGroupComponent.findAllComponents(GroupTicketButton)
    expect(discountComponents.length).to.eq(1)
    expect(discountComponents.at(0).props('discount').name).to.eq(
      'Family Discount'
    )
  })

  it('handles add discount tickets event and emits add ticket(s) event', async () => {
    await seatGroupComponent.setProps({
      expanded: true
    })
    await seatGroupComponent
      .findAllComponents(GroupTicketButton)
      .at(0)
      .vm.$emit('add-discount-tickets')
    expect(seatGroupComponent.emitted()['add-ticket'].length).to.eq(2)
    expect(JSON.stringify(seatGroupComponent.emitted()['add-ticket'][0])).to.eq(
      JSON.stringify([
        ticketOption.seatGroup,
        discounts[0].requirements[0].concessionType,
        discounts[0].requirements[0].number
      ])
    )
    expect(JSON.stringify(seatGroupComponent.emitted()['add-ticket'][1])).to.eq(
      JSON.stringify([
        ticketOption.seatGroup,
        discounts[0].requirements[1].concessionType,
        discounts[0].requirements[1].number
      ])
    )
  })
  it('doesnt display group ticket buttons if the remaining capacity doesnt allow for it', async () => {
    await seatGroupComponent.setProps({
      groupCapacityRemaining: 2
    })
    expect(
      seatGroupComponent.findAllComponents(GroupTicketButton).length
    ).to.eq(0)
  })
  describe('sold out group', () => {
    beforeEach(() => {
      seatGroupComponent.setProps({
        groupCapacityRemaining: 0
      })
    })

    it('doesnt emit on header click', async () => {
      await seatGroupComponent.findComponent({ ref: 'header' }).trigger('click')
      expect(seatGroupComponent.emitted()['select-location']).to.not.be.ok
    })
    it('shows sold out', () => {
      expect(
        seatGroupComponent.findComponent({ ref: 'header' }).text()
      ).to.contain('Sold Out')
    })

    describe('with tickets from group', () => {
      beforeEach(async () => {
        await seatGroupComponent.setProps({
          currentTickets: [
            new Ticket(
              ticketOption.seatGroup.id,
              ticketOption.concessionTypes[0].concessionType.id
            )
          ]
        })
      })

      it('allows header click', async () => {
        await seatGroupComponent
          .findComponent({ ref: 'header' })
          .trigger('click')
        expect(seatGroupComponent.emitted()['select-location'].length).to.eq(1)
      })
      it('doesnt show sold out', () => {
        expect(
          seatGroupComponent.findComponent({ ref: 'header' }).text()
        ).not.to.contain('Sold Out')
      })
    })
  })
})

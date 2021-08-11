import { mount } from '@vue/test-utils'
import { expect } from 'chai'

import Booking from '@/classes/Booking'
import { swal } from '@/utils'
import PagementStage from '@/pages/production/_slug/book/_performanceId/pay.vue'

import GenericApolloResponse from '@/tests/unit/fixtures/support/GenericApolloResponse'
import GenericMutationResponse from '@/tests/unit/fixtures/support/GenericMutationResponse'
import Payment from '@/tests/unit/fixtures/Payment'
import FakeBooking from '@/tests/unit/fixtures/Booking'
import GenericErrorsResponse from '@/tests/unit/fixtures/support/GenericErrorsResponse'
import GenericError from '@/tests/unit/fixtures/support/GenericError'
import CardPayment from '@/components/square/CardPayment.vue'
import { generateMountOptions } from '../../../helpers'

describe('Payment Stage', () => {
  let paymentStageComponent, routerPushMock

  jest.spyOn(swal, 'fire').mockImplementation(() => {
    return Promise.resolve()
  })

  beforeEach(() => {
    const booking = new Booking()
    booking.updateFromAPIData({
      id: 123,
      performance: {
        start: '2020-03-22T14:00:00',
        end: '2020-03-22T16:00:00',
        production: {
          name: 'Legally Ginger',
        },
      },
      tickets: [
        {
          id: 456,
          seatGroup: { id: 1 },
          concessionType: { id: 1 },
        },
      ],
      priceBreakdown: {
        tickets: [],
        totalPrice: 1050,
      },
    })
    paymentStageComponent = mount(
      PagementStage,
      generateMountOptions(['apollo', 'config'], {
        propsData: {
          booking,
        },
        mocks: {
          $router: {
            push: (routerPushMock = jest.fn()),
          },
        },
        stubs: ['card-payment'],
      })
    )
  })

  it('handles enabling other methods', async () => {
    expect(
      paymentStageComponent.find('#sq-google-pay').attributes('style')
    ).to.contain('display: none')
    expect(
      paymentStageComponent.find('#sq-apple-pay').attributes('style')
    ).to.contain('display: none')

    await paymentStageComponent
      .findComponent(CardPayment)
      .vm.$emit('enableGPay')

    expect(
      paymentStageComponent.find('#sq-google-pay').attributes('style')
    ).not.to.contain('display: none')
    expect(
      paymentStageComponent.find('#sq-apple-pay').attributes('style')
    ).to.contain('display: none')

    await paymentStageComponent
      .findComponent(CardPayment)
      .vm.$emit('enableApplePay')

    expect(
      paymentStageComponent.find('#sq-google-pay').attributes('style')
    ).not.to.contain('display: none')
    expect(
      paymentStageComponent.find('#sq-apple-pay').attributes('style')
    ).not.to.contain('display: none')
  })

  it('handles card nonce recieved (with square errors)', async () => {
    let popupClose
    await paymentStageComponent.setData({
      progressPopup: {
        close: (popupClose = jest.fn()),
      },
    })
    await paymentStageComponent
      .findComponent(CardPayment)
      .vm.$emit('nonceError')
    expect(popupClose.mock.calls).length(1)
  })

  describe('with valid card / nonce input', () => {
    let popupClose

    beforeEach(async () => {
      paymentStageComponent.vm.booking.id = 1
      await paymentStageComponent.setData({
        progressPopup: {
          close: (popupClose = jest.fn()),
        },
      })
    })

    it('pays for booking', async () => {
      paymentStageComponent.vm.$apollo.mock.mutationCallstack.push(
        GenericApolloResponse(
          'payBooking',
          GenericMutationResponse({
            payment: Payment(),
            booking: FakeBooking(),
          })
        )
      )
      await paymentStageComponent
        .findComponent(CardPayment)
        .vm.$emit('nonceRecieved', 'cnon:card-nonce-ok')

      await paymentStageComponent.vm.$nextTick()

      // Redirects to booking page - instantly pushed due to mock above of swal.fire
      expect(routerPushMock.mock.calls).length(1)
      expect(routerPushMock.mock.calls[0][0]).to.eq(
        '/user/booking/yOIYg6Co8vGR'
      )

      // Loading popup should close
      expect(popupClose.mock.calls).length(1)
    })

    it('shows any mutation errors', async () => {
      paymentStageComponent.vm.$apollo.mock.mutationCallstack.push(
        GenericApolloResponse(
          'payBooking',
          GenericErrorsResponse(
            GenericError(
              'There was a price difference between the booking and the requested price'
            )
          )
        )
      )
      paymentStageComponent.vm.booking.priceBreakdown.totalPrice = 1000
      await paymentStageComponent.vm.onNonceRecieved(null, 'cnon:card-nonce-ok')
      expect(paymentStageComponent.text()).to.contain(
        'There was a price difference between the booking and the requested price'
      )
    })
  })
})

import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import CardPayment from '@/components/square/CardPayment.vue'
import { generateMountOptions } from '../../helpers'

describe('Card Payment', () => {
  let paymentFormFuncMock, component
  beforeEach(() => {
    window.SqPaymentForm = jest.fn().mockImplementation(() => {
      return (paymentFormFuncMock = {
        build: jest.fn(),
        requestCardNonce: jest.fn(),
        destroy: jest.fn(),
      })
    })

    component = mount(
      CardPayment,
      generateMountOptions(['config'], {
        propsData: {
          price: '10.00',
        },
      })
    )
  })

  it('sets up payment form on load', () => {
    expect(window.SqPaymentForm.mock.calls).length(1)
    expect(paymentFormFuncMock.build.mock.calls).length(1)
    expect(window.SqPaymentForm.mock.calls[0][0].applicationId).to.eq(
      'square_app_id'
    )
    expect(window.SqPaymentForm.mock.calls[0][0].locationId).to.eq(
      'square_loc_id'
    )
    expect(
      window.SqPaymentForm.mock.calls[0][0].callbacks.cardNonceResponseReceived
    ).to.eq(component.vm.onNonceRecieved)
    expect(
      window.SqPaymentForm.mock.calls[0][0].callbacks.methodsSupported
    ).to.eq(component.vm.onMethodsSupported)
    expect(
      window.SqPaymentForm.mock.calls[0][0].callbacks.createPaymentRequest
    ).to.eq(component.vm.onCreatePaymentRequest)
  })

  it('destroys payment form on destroy', () => {
    component.destroy()
    expect(paymentFormFuncMock.destroy.mock.calls).length(1)
  })

  it('requests card nonce on pay click', async () => {
    await component.setData({
      ready: true,
    })
    component.find('button#sq-creditcard').trigger('click')
    expect(paymentFormFuncMock.requestCardNonce.mock.calls).length(1)
  })

  it('handles card nonce recieved (with square errors)', async () => {
    component.vm.onNonceRecieved([
      { message: 'An issue with the CVV' },
      { message: 'An issue with the Expiry Date' },
    ])

    await component.vm.$nextTick()

    expect(component.emitted().nonceError.length).to.eq(1)
    expect(component.emitted().nonceError[0][0]).to.include(
      'An issue with the CVV'
    )
    expect(component.emitted().nonceError[0][0]).to.include(
      'An issue with the Expiry Date'
    )

    expect(component.text()).to.contain('An issue with the CVV')
    expect(component.text()).to.contain('An issue with the Expiry Date')
  })
})

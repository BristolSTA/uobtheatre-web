import { mount } from '@vue/test-utils';
import { expect } from 'chai';

import Booking from '@/classes/Booking';
import { swal } from '@/utils';
import PagementStage from '@/views/booking/stages/PaymentStage.vue';

import { executeWithServer, generateMountOptions } from '../../../helpers';

describe('Payment Stage', () => {
  let component, paymentFormFuncMock, routerPushMock;

  jest.spyOn(swal, 'fire').mockImplementation(() => {
    return Promise.resolve();
  });

  beforeEach(() => {
    window.SqPaymentForm = jest.fn().mockImplementation(() => {
      return (paymentFormFuncMock = {
        build: jest.fn(),
        requestCardNonce: jest.fn(),
        destroy: jest.fn(),
      });
    });

    let booking = new Booking();
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
    });
    component = mount(
      PagementStage,
      generateMountOptions(['apollo'], {
        propsData: {
          booking: booking,
        },
        mocks: {
          $router: {
            push: (routerPushMock = jest.fn()),
          },
        },
      })
    );
  });

  it('sets up payment form on load', () => {
    expect(window.SqPaymentForm.mock.calls).length(1);
    expect(paymentFormFuncMock.build.mock.calls).length(1);
    expect(window.SqPaymentForm.mock.calls[0][0].applicationId).to.eq(
      'square_app_id'
    );
    expect(window.SqPaymentForm.mock.calls[0][0].locationId).to.eq(
      'square_loc_id'
    );
    expect(
      window.SqPaymentForm.mock.calls[0][0].callbacks.cardNonceResponseReceived
    ).to.eq(component.vm.onNonceRecieved);
    expect(
      window.SqPaymentForm.mock.calls[0][0].callbacks.methodsSupported
    ).to.eq(component.vm.onMethodsSupported);
    expect(
      window.SqPaymentForm.mock.calls[0][0].callbacks.createPaymentRequest
    ).to.eq(component.vm.onCreatePaymentRequest);
  });

  it('destroys payment form on destroy', () => {
    component.destroy();
    expect(paymentFormFuncMock.destroy.mock.calls).length(1);
  });

  it('handles methods supported callback', async () => {
    expect(component.find('#sq-google-pay').attributes('style')).to.contain(
      'display: none'
    );
    expect(component.find('#sq-apple-pay').attributes('style')).to.contain(
      'display: none'
    );

    component.vm.onMethodsSupported({ googlePay: false, applePay: false });
    await component.vm.$nextTick();

    expect(component.find('#sq-google-pay').attributes('style')).to.contain(
      'display: none'
    );
    expect(component.find('#sq-apple-pay').attributes('style')).to.contain(
      'display: none'
    );

    component.vm.onMethodsSupported({ googlePay: true, applePay: false });
    await component.vm.$nextTick();

    expect(component.find('#sq-google-pay').attributes('style')).not.to.contain(
      'display: none'
    );
    expect(component.find('#sq-apple-pay').attributes('style')).to.contain(
      'display: none'
    );

    component.vm.onMethodsSupported({ applePay: true });
    await component.vm.$nextTick();

    expect(component.find('#sq-google-pay').attributes('style')).not.to.contain(
      'display: none'
    );
    expect(component.find('#sq-apple-pay').attributes('style')).not.to.contain(
      'display: none'
    );
  });

  it('requests card nonce on pay click', () => {
    component.find('button#sq-creditcard').trigger('click');
    expect(paymentFormFuncMock.requestCardNonce.mock.calls).length(1);
  });

  it('handles card nonce recieved (with square errors)', async () => {
    let popupClose;
    component.setData({
      progressPopup: {
        close: (popupClose = jest.fn()),
      },
    });
    component.vm.onNonceRecieved([
      { message: 'An issue with the CVV' },
      { message: 'An issue with the Expiry Date' },
    ]);
    await component.vm.$nextTick();
    expect(popupClose.mock.calls).length(1);

    expect(component.text()).to.contain('An issue with the CVV');
    expect(component.text()).to.contain('An issue with the Expiry Date');
  });

  describe('with valid card / nonce input', () => {
    let server, booking, popupClose;
    beforeAll(async () => {
      server = await executeWithServer(async (server) => {
        booking = server.create('bookingNode', {
          reference: 'abcd1234',
        });
        booking.priceBreakdown.update({ totalPrice: 1050 });
      }, false);
    });

    beforeEach(() => {
      component.vm.booking.id = booking.id;
      component.setData({
        progressPopup: {
          close: (popupClose = jest.fn()),
        },
      });
    });

    afterAll(() => {
      server.shutdown();
    });

    it('pays for booking', async () => {
      await component.vm.onNonceRecieved(null, 'cnon:card-nonce-ok');

      // Loading popup should close
      expect(popupClose.mock.calls).length(1);

      // Redirects to booking page - instantly pushed due to mock above of swal.fire
      expect(routerPushMock.mock.calls).length(1);
      expect(routerPushMock.mock.calls[0][0].name).to.eq('user.booking');
      expect(routerPushMock.mock.calls[0][0].params.bookingRef).to.eq(
        'abcd1234'
      );
    });

    it('shows any mutation errors', async () => {
      component.vm.booking.price_breakdown.totalPrice = 1000;
      await component.vm.onNonceRecieved(null, 'cnon:card-nonce-ok');
      expect(component.text()).to.contain(
        'There was a price difference between the booking and the requested price'
      );
    });
  });
});

import { mount } from '@vue/test-utils';
import { expect } from 'chai';
import { generateMountOptions } from '../../helpers';
import SquarePayment from '@/components/square/SquarePayment.vue';

describe('Card Payment', () => {
  let squarePaymentsMock, component, cardMock, gpayMock, applePayMock;
  beforeEach(() => {
    window.Square = {
      payments: (squarePaymentsMock = jest.fn(() => {
        return {
          paymentRequest: jest.fn(),
          card: (cardMock = jest.fn(() => {
            return {
              tokenize: jest.fn(),
            };
          })),
          googlePay: (gpayMock = jest.fn(() => {
            return {
              tokenize: jest.fn(),
            };
          })),
          applePay: (applePayMock = jest.fn(() => {
            return {
              tokenize: jest.fn(),
            };
          })),
        };
      })),
    };

    component = mount(
      SquarePayment,
      generateMountOptions(['config'], {
        propsData: {
          price: '10.00',
        },
      })
    );
  });

  it('sets up payment form on load', () => {
    expect(squarePaymentsMock.mock.calls).length(1);
    expect(squarePaymentsMock.mock.calls).length(1);
    expect(squarePaymentsMock.mock.calls[0][0]).to.eq('square_app_id');
    expect(squarePaymentsMock.mock.calls[0][0]).to.eq('square_loc_id');

    // Check it tries to init card
    expect(cardMock.mock.calls).length(1);

    // Check it tries to init gpay & applepay
    expect(gpayMock.mock.calls).length(1);
    expect(applePayMock.mock.calls).length(1);
  });

  it('requests card nonce on pay click', async () => {
    await component.setData({
      ready: true,
    });
    component.find('button#card-button').trigger('click');
    expect(component.vm.square.card.tokenize.mock.calls).length(1);
  });
});

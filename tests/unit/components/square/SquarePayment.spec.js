import { mount } from '#testSupport/helpers';
import { SquareWebSDK } from '#testSupport/stubs';
import { expect } from 'vitest';
import SquarePayment from '@/components/square/SquarePayment.vue';

describe('Card Payment', () => {
  let component, squareSDKMock;
  beforeEach(() => {
    squareSDKMock = SquareWebSDK();
    vi.stubGlobal('Square', squareSDKMock);

    component = mount(SquarePayment, {
      shallow: false,
      props: {
        price: '10.00'
      }
    });
  });

  it('sets up payment form on load', async () => {
    expect(squareSDKMock.payments).toHaveBeenCalledWith(
      'square_app_id',
      'square_loc_id'
    );

    // Check it tries to init card
    expect(squareSDKMock.payments().card).toHaveBeenCalledOnce();

    // Check it tries to init gpay & applepay
    expect(squareSDKMock.payments().googlePay).toHaveBeenCalledOnce();
    expect(squareSDKMock.payments().applePay).toHaveBeenCalledOnce();
  });

  it('requests card nonce on pay click', async () => {
    await component.setData({
      ready: true
    });

    await component.find('button#card-button').trigger('click');
    expect(squareSDKMock.payments().card().tokenize).toHaveBeenCalledOnce();
  });
});

import { expect, vi } from 'vitest';
import { mount } from '#testSupport/helpers';
import {
  GenericApolloResponse,
  GenericMutationResponse,
  GenericErrorsResponse,
  GenericError
} from '#testSupport/helpers/api';

import Booking from '@/classes/Booking';
import PagementStage from '@/pages/production/[slug]/book/[performanceId]/pay.vue';

import Payment from '#testSupport/fixtures/Payment';
import FakeBooking from '#testSupport/fixtures/Booking';
import CardPayment from '@/components/square/SquarePayment.vue';
import { flushPromises } from '@vue/test-utils';

describe('Payment Stage', () => {
  let paymentStageComponent;
  const popupClose = vi.fn();

  vi.mock('@/utils/alerts', () => ({
    swal: {
      fire: vi.fn(() => {
        return new Promise((resolve) => resolve());
      })
    }
  }));

  async function mountComponent(mutations = []) {
    const booking = new Booking();
    booking.updateFromAPIData({
      id: 123,
      performance: {
        start: '2020-03-22T14:00:00',
        end: '2020-03-22T16:00:00',
        production: {
          name: 'Legally Ginger'
        }
      },
      tickets: [
        {
          id: 456,
          seatGroup: { id: 1 },
          concessionType: { id: 1 }
        }
      ],
      priceBreakdown: {
        tickets: [],
        totalPrice: 1050
      }
    });

    paymentStageComponent = await mount(PagementStage, {
      shallow: false,
      global: {
        stubs: ['card-payment']
      },
      propsData: {
        booking
      },
      data() {
        return {
          progressPopup: {
            close: popupClose
          }
        };
      },
      apollo: {
        mutationResponses: mutations
      }
    });
    popupClose.mockReset();
  }

  beforeEach(async () => {
    await mountComponent();
  });

  it('handles payment cancellation', async () => {
    await paymentStageComponent
      .findComponent(CardPayment)
      .vm.$emit('cancelled');
    expect(popupClose.mock.calls).length(1);
  });

  describe('with valid card / nonce input', () => {
    it('pays for booking', async () => {
      await mountComponent([
        GenericApolloResponse(
          'payBooking',
          GenericMutationResponse({
            payment: Payment(),
            booking: FakeBooking()
          })
        )
      ]);

      await paymentStageComponent
        .findComponent({ name: 'square-payment' })
        .vm.$emit('nonceRecieved', { nonce: 'cnon:card-nonce-ok' });

      await flushPromises();

      // Redirects to booking page - instantly pushed due to mock above of swal.fire
      const router = useRouter();

      expect(router.push).toHaveBeenCalledWith('/user/booking/yOIYg6Co8vGR');

      // Loading popup should close
      expect(popupClose.mock.calls).length(1);
    });

    it('shows any mutation errors', async () => {
      await mountComponent([
        GenericApolloResponse(
          'payBooking',
          GenericErrorsResponse(
            GenericError(
              'There was a price difference between the booking and the requested price'
            )
          )
        )
      ]);

      paymentStageComponent.vm.booking.priceBreakdown.totalPrice = 1000;
      await paymentStageComponent.vm.onNonceRecieved({
        nonce: 'cnon:card-nonce-ok'
      });

      await flushPromises();

      expect(paymentStageComponent.text()).to.contain(
        'There was a price difference between the booking and the requested price'
      );
    });
  });
});

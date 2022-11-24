import Cookie from 'js-cookie';
import { defineStore } from 'pinia';
import {
  useDeleteBookingMutation,
  BoxOfficePaymentDevicesQuery
} from '@/graphql/codegen/operations';
import { BoxOfficePaymentDevicesDocument } from '~~/graphql/codegen/operations';

const locationCookieKey = 'uobtheatre-boxoffice-location';

export default defineStore('box-office', {
  state: () => ({
    locationId: undefined as string | undefined,
    terminalDevice: undefined as string | undefined,
    inProgressBookingID: undefined as string | undefined
  }),
  actions: {
    /**
     * Remember the state of the store from cookie
     */
    rememberState() {
      this.locationId = Cookie.get(locationCookieKey);
    },

    /**
     * Cancels the booking that is currently in progress
     */
    async cancelInProgressBooking() {
      const { mutate } = useDeleteBookingMutation({
        variables: {
          bookingId: this.inProgressBookingID
        }
      });

      await mutate();
      this.locationId = undefined;
    },

    /**
     * Set the current device's location to the given location ID
     */
    setDeviceLocation(locationId: string | undefined, temporary = false) {
      if (!locationId) {
        Cookie.remove(locationCookieKey);
      } else {
        Cookie.set(locationCookieKey, locationId, {
          expires: temporary ? undefined : 365 * 1000
        });
      }
      this.locationId = locationId;
    },

    /**
     * Retrieves all available terminal payment devices
     */
    async retrieveAvailableTerminalDevices() {
      if (!this.locationId) {
        return [];
      }

      const { data } = await useAsyncQuery<BoxOfficePaymentDevicesQuery>(
        BoxOfficePaymentDevicesDocument
      );

      if (!data.value?.paymentDevices) return [];

      return data.value.paymentDevices.filter(
        (device) => device && device.locationId === this.locationId
      );
    }
  }
});

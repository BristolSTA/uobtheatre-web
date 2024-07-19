import Cookie from 'js-cookie';
import { defineStore } from 'pinia';
import {
  useDeleteBookingMutation,
  type BoxOfficePaymentDevicesQuery,
  type SquarePaymentDevice
} from '@/graphql/codegen/operations';
import { BoxOfficePaymentDevicesDocument } from '~~/graphql/codegen/operations';
import Booking from '~~/classes/Booking';

const locationCookieKey = 'uobtheatre-boxoffice-location';
const lockdownModeStorageKey = 'uobtheatre-boxoffice-lockdown-mode';

const useBoxOfficeStore = defineStore('box-office', {
  state: () => ({
    lockdownMode: false,
    locationId: undefined as string | undefined,
    terminalDevice: undefined as SquarePaymentDevice | undefined,
    inProgressBooking: new Booking() as Booking
  }),
  actions: {
    /**
     * Remember the state of the store from cookie
     */
    rememberState() {
      this.locationId = Cookie.get(locationCookieKey);
      this.lockdownMode =
        window.localStorage.getItem(lockdownModeStorageKey) === 'true';
    },

    /**
     * Save persistant state
     */
    saveState() {
      this.setDeviceLocation(this.locationId);
      window.localStorage.setItem(
        lockdownModeStorageKey,
        new Boolean(this.lockdownMode).toString()
      );
    },

    /**
     * Cancels the booking that is currently in progress
     */
    async cancelInProgressBooking() {
      if (this.inProgressBooking.id) {
        const { mutate } = useDeleteBookingMutation({
          variables: {
            bookingId: this.inProgressBooking.id
          }
        });
        await mutate();
      }

      this.inProgressBooking = new Booking();
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
      ) as NonNullable<(typeof data.value.paymentDevices)[number]>[];
    }
  }
});

export default useBoxOfficeStore;

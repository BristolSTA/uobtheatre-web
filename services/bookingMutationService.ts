import Booking from '~~/classes/Booking';
import Errors from '~~/classes/Errors';
import {
  BookingMutation,
  useBookingMutation
} from '~~/graphql/codegen/operations';

type IReturn = {
  result?: BookingMutation['booking'];
  errors?: Errors;
};

export async function upsertBooking(booking: Booking): Promise<IReturn> {
  const returnData: IReturn = {
    result: undefined,
    errors: undefined
  };

  try {
    returnData.result = await doMutation(
      useBookingMutation({
        variables: {
          input: {
            id: booking.id ?? undefined,
            performance: booking.performance?.id,
            tickets: booking.toAPIData().tickets
          }
        }
      }),
      'booking'
    );
  } catch (e) {
    returnData.errors = getValidationErrors(e);
  }

  return returnData;
}

import Booking from '~~/classes/Booking';
import Errors from '~~/classes/Errors';
import {
  type BookingMutation,
  useBookingMutation
} from '~~/graphql/codegen/operations';
import type { IdInput } from '~~/types/generic';

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
            tickets: booking
              .toAPIData()
              .tickets.filter(
                (ticket) =>
                  ticket.seatGroupId !== undefined &&
                  ticket.concessionTypeId !== undefined
              ) as (Pick<
              ReturnType<Booking['toAPIData']>['tickets'][number],
              'id'
            > & {
              seatGroupId: IdInput;
              concessionTypeId: IdInput;
            })[]
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

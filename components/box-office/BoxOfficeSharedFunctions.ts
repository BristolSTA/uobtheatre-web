import {
  useCheckInBookingMutation,
  Scalars,
  useUnCheckInBookingMutation,
  DetailedBookingDetailsFragment
} from '~~/graphql/codegen/operations';
import type { AtLeastOneIdInput } from '~~/types/generic';
import { IDetailedBookingTicket } from './BoxOfficeSharedTypes';

type IMutateTicketCheckInStateReturn = {
  ticket?: IDetailedBookingTicket;
  booking?: DetailedBookingDetailsFragment;
  error?: string;
  message?: string;
};

export async function mutateTicketCheckInState(
  performanceId: Scalars['IdInputField'],
  bookingReference: string,
  checkIn: boolean,
  ticketIds: AtLeastOneIdInput,
  withSounds = true
): Promise<IMutateTicketCheckInStateReturn> {
  const returnData: IMutateTicketCheckInStateReturn = {
    ticket: undefined,
    booking: undefined,
    error: undefined,
    message: undefined
  };

  try {
    let data = undefined;
    // Do the appropriate mutation
    if (checkIn) {
      data = await doMutation(
        useCheckInBookingMutation({
          variables: {
            performanceId: performanceId,
            reference: bookingReference,
            tickets: ticketIds.map((ticketId) => ({
              ticketId
            }))
          }
        }),
        'checkInBooking'
      );
    } else {
      // Deal with un check in case
      data = await doMutation(
        useUnCheckInBookingMutation({
          variables: {
            performanceId: performanceId,
            reference: bookingReference,
            tickets: ticketIds.map((ticketId) => ({
              ticketId
            }))
          }
        }),
        'uncheckInBooking'
      );
    }

    // Set the booking
    if (data.booking) returnData.booking = data.booking;

    // Set the ticket
    returnData.ticket = data.booking?.tickets?.find(
      (ticket) => ticket.id == ticketIds[0]
    );

    // Set the message
    returnData.message =
      ticketIds.length > 1
        ? checkIn
          ? 'Tickets checked in'
          : 'Tickets un-checked in'
        : checkIn
        ? `Checked In: 1x ${returnData.ticket?.concessionType.name}`
        : `Un-Checked In: 1x ${returnData.ticket?.concessionType.name}`;
  } catch (e) {
    const errors = getValidationErrors(e);
    returnData.error = errors
      ? errors.allErrors.map((error) => error.message).join(',')
      : 'Internal Error';
  }

  if (withSounds)
    new Audio(
      returnData.error ? '/audio/beep_negative.mp3' : '/audio/beep_positive.mp3'
    ).play();

  return returnData;
}

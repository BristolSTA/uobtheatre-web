import {
  useCheckInBookingMutation,
  useUnCheckInBookingMutation,
  useBoxOfficePerformanceBookingQuery
} from '~~/graphql/codegen/operations';
import type { IdInput } from '~~/types/generic';
import { IMutateTicketCheckInStateReturn } from './BoxOfficeSharedTypes';

export async function retrieveDetailsForTicket(
  performanceId: IdInput,
  bookingReference: string,
  ticketId: IdInput
): Promise<IMutateTicketCheckInStateReturn> {
  const result = await waitForQuery(
    useBoxOfficePerformanceBookingQuery({
      bookingReference,
      performanceId
    })
  );

  const booking = result.data.performance?.bookings.edges[0]?.node ?? undefined;
  const ticket = booking?.tickets?.find((ticket) => ticket.id == ticketId);
  return {
    booking,
    ticket,
    error: !booking
      ? 'Invalid booking reference'
      : !ticket
      ? 'Invalid ticket ID'
      : undefined,
    message: 'Ticket Found'
  };
}

export async function mutateTicketCheckInState(
  performanceId: IdInput,
  bookingReference: string,
  checkIn: boolean,
  ticketIds: IdInput[],
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

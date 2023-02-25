import {
  useCheckInBookingMutation,
  useUnCheckInBookingMutation,
  useBoxOfficePerformanceBookingQuery,
  useAdminBookingLookupQuery
} from '~~/graphql/codegen/operations';
import type { Ref } from 'vue';
import type { IdInput } from '~~/types/generic';
import { IMutateTicketCheckInStateReturn } from './BoxOfficeSharedTypes';

export async function retrieveDetailsForTicket(
  performanceId: IdInput | undefined,
  bookingReference: string,
  ticketId: IdInput
): Promise<IMutateTicketCheckInStateReturn> {
  let booking;

  if (performanceId) {
    const result = await waitForQuery(
      useBoxOfficePerformanceBookingQuery({
        bookingReference,
        performanceId
      })
    );

    booking = result.data.performance?.bookings.edges[0]?.node ?? undefined;
  } else {
    const result = await waitForQuery(
      useAdminBookingLookupQuery({ reference: bookingReference })
    );
    booking = result.data.bookings?.edges[0]?.node ?? undefined;
  }

  const ticket = booking?.tickets?.find((ticket) => ticket.id == ticketId);

  return {
    booking,
    ticket,
    error: !booking
      ? 'Booking does not exist for this performance'
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

export async function handleTicketScan(
  doCheckIn: boolean | Ref<boolean>,
  performanceId: IdInput | undefined,
  bookingReference: string,
  ticketIds: IdInput[] | IdInput,
  withSounds: boolean = true
): Promise<IMutateTicketCheckInStateReturn> {
  const shouldMutate = unref(doCheckIn);
  let response;

  if (!Array.isArray(ticketIds)) ticketIds = [ticketIds];

  if (shouldMutate && performanceId) {
    // Attempt to check in the ticket
    response = await mutateTicketCheckInState(
      performanceId,
      bookingReference,
      true,
      ticketIds,
      withSounds
    );
  } else {
    // Query the ticket/booking details
    response = await retrieveDetailsForTicket(
      performanceId,
      bookingReference,
      ticketIds[0]
    );
  }

  // If we got an don't have a booking, attempt to load the booking and ticket information from outside the specific performance to allow the user to interrogate
  if (!response.booking) {
    const result = await waitForQuery(
      useAdminBookingLookupQuery({
        reference: bookingReference
      })
    );

    if (result.data?.bookings?.edges.length) {
      response.booking = result.data?.bookings?.edges[0]?.node || undefined;
      response.ticket = response.booking?.tickets?.find(
        (ticket) => ticket.id === ticketIds[0]
      );
    }
  }

  return response;
}

import {
  BoxOfficePerformanceBookingQuery,
  BoxOfficePerformanceBookingsQuery,
  ConcessionTypeNode,
  SeatGroupNode,
  TicketNode
} from '~~/graphql/codegen/operations';

// The "booking" prop on BookingHeader component
export type IBookingHeaderProp = {
  reference: string;
  user?:
    | {
        firstName: string;
        lastName: string;
      }
    | null
    | undefined;
  tickets?: { checkedInAt?: any }[] | null;
};

export type IMutateTicketCheckInStateReturn = {
  ticket?: IDetailedBookingTicket;
  booking?: IDetailedBooking;
  error?: string;
  message?: string;
};

// The "tickets" prop on BookingTickets
export type IBookingTicketProp = Pick<TicketNode, 'id' | 'checkedInAt'> & {
  concessionType: Pick<ConcessionTypeNode, 'name'>;
  seatGroup: Pick<SeatGroupNode, 'name'>;
};

// The "state" prop on CheckIn Indicator
export type ICheckInState = {
  success: boolean | null;
  message: string | null;
};

export type ISimpleBooking = NonNullable<
  NonNullable<
    NonNullable<
      BoxOfficePerformanceBookingsQuery['performance']
    >['bookings']['edges'][number]
  >['node']
>;

export type IDetailedBooking = NonNullable<
  NonNullable<
    NonNullable<
      BoxOfficePerformanceBookingQuery['performance']
    >['bookings']['edges'][number]
  >['node']
>;

export type IDetailedBookingTicket = NonNullable<
  NonNullable<IDetailedBooking['tickets']>[number]
>;

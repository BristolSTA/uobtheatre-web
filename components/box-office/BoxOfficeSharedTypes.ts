import {
  ConcessionTypeNode,
  DetailedBookingDetailsFragment,
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

// The "tickets" prop on BookingTickets
export type IBookingTicketProp = Pick<TicketNode, 'id' | 'checkedInAt'> & {
  concessionType: Pick<ConcessionTypeNode, 'name'>;
  seatGroup: Pick<SeatGroupNode, 'name'>;
};

// The "state" prop on CheckIn Indicator
export type ICheckInIndicator = {
  success: boolean | null;
  message: string | null;
};

// The type of a booking retrieved using the detailed booking fragment
export type IDetailedBooking = DetailedBookingDetailsFragment;

// The type of a ticket retrieved using the detailed booking fragment
export type IDetailedBookingTicket = NonNullable<
  DetailedBookingDetailsFragment['tickets']
>[number];

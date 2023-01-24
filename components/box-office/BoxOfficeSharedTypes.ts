import {
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

// The "tickets" prop on BookingTickets
export type IBookingTicketsProp = Pick<TicketNode, 'id' | 'checkedInAt'> & {
  concessionType: Pick<ConcessionTypeNode, 'name'>;
  seatGroup: Pick<SeatGroupNode, 'name'>;
};

// The "state" prop on CheckIn Indicator
export type ICheckInIndicator = {
  success: boolean | null;
  message: string | null;
};

import ConcessionType from './ConcessionType';
import SeatGroup from './SeatGroup';

export default (overrides = {}) => {
  return Object.assign(
    {
      ticketPrice: 250,
      number: 1,
      seatGroup: SeatGroup(),
      concessionType: ConcessionType(),
      totalPrice: 250,
    },
    overrides
  );
};

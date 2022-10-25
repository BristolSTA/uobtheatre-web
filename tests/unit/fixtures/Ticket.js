import ConcessionType from "./ConcessionType";
import SeatGroup from "./SeatGroup";

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      seatGroup: SeatGroup(),
      booking: null,
      concessionType: ConcessionType(),
      seat: null,
      checkedIn: false,
    },
    overrides
  );
};

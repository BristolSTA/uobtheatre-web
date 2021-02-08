export default {
  tickets: [
    {
      seatGroup: {
        id: 1,
        name: 'SeatGroupObj1',
      },
      concessionType: {
        id: 2,
        name: 'ConcessionTypeObj2',
      },
      ticketPrice: 100,
      number: 2,
      totalPrice: 2000,
    },
    {
      seatGroup: {
        id: 5,
        name: 'SeatGroupObj5',
      },
      concessionType: {
        id: 6,
        name: 'ConcessionTypeObj6',
      },
      ticketPrice: 250,
      number: 1,
      totalPrice: 250,
    },
  ],
  ticketsPrice: 2250,
  discountsValue: 100,
  ticketsDiscountedPrice: 2150,
  subtotalPrice: 2150,
  miscCosts: [
    {
      name: 'Admin Charge',
      percentage: 0.05,
      value: 108,
    },
  ],
  totalPrice: 2258,
};

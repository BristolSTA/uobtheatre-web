export default {
  id: '4',
  reference: '6hyqt6sh6lwu',
  performance: {
    id: '1',
    production: {
      id: '1',
      name: 'Legally Blonde',
      slug: 'legally-blonde',
      __typename: 'ProductionNode',
    },
    start: '2020-12-19T10:00:00',
    end: '2020-12-19T11:30:00',
    doorsOpen: '2020-12-19T09:30:00',
    venue: {
      slug: 'pegg-theatre',
      __typename: 'VenueNode',
    },
    durationMins: 120,
    __typename: 'PerformanceNode',
  },
  payments: [],
  tickets: [
    {
      seatGroup: {
        id: '1',
        name: 'The best seats in the house',
        __typename: 'SeatGroupNode',
      },
      concessionType: {
        id: '1',
        name: 'Adult',
        __typename: 'ConcessionTypeNode',
      },
      id: '7',
    },
    {
      seatGroup: {
        id: '1',
        name: 'The best seats in the house',
        __typename: 'SeatGroupNode',
      },
      concessionType: {
        id: '1',
        name: 'Adult',
        __typename: 'ConcessionTypeNode',
      },
      id: '8',
    },
    {
      seatGroup: {
        id: '1',
        name: 'The best seats in the house',
        __typename: 'SeatGroupNode',
      },
      concessionType: {
        id: '3',
        name: 'Student',
        __typename: 'ConcessionTypeNode',
      },
      id: '9',
    },
    {
      seatGroup: {
        id: '2',
        name: 'Proj Seats',
        __typename: 'SeatGroupNode',
      },
      concessionType: {
        id: '3',
        name: 'Student',
        __typename: 'ConcessionTypeNode',
      },
      id: '10',
    },
  ],
  priceBreakdown: {
    tickets: [
      {
        number: 2,
        seatGroup: {
          id: '1',
          name: 'The best seats in the house',
          __typename: 'SeatGroupNode',
        },
        concessionType: {
          id: '1',
          name: 'Adult',
          __typename: 'ConcessionTypeNode',
        },
        totalPrice: 600,
        __typename: 'PriceBreakdownTicketNode',
        concession_type: {
          id: '1',
          name: 'Adult',
          __typename: 'ConcessionTypeNode',
        },
        seat_group: {
          id: '1',
          name: 'The best seats in the house',
          __typename: 'SeatGroupNode',
        },
      },
      {
        number: 1,
        seatGroup: {
          id: '1',
          name: 'The best seats in the house',
          __typename: 'SeatGroupNode',
        },
        concessionType: {
          id: '3',
          name: 'Student',
          __typename: 'ConcessionTypeNode',
        },
        totalPrice: 800,
        __typename: 'PriceBreakdownTicketNode',
        concession_type: {
          id: '3',
          name: 'Student',
          __typename: 'ConcessionTypeNode',
        },
        seat_group: {
          id: '1',
          name: 'The best seats in the house',
          __typename: 'SeatGroupNode',
        },
      },
      {
        number: 1,
        seatGroup: {
          id: '2',
          name: 'Proj Seats',
          __typename: 'SeatGroupNode',
        },
        concessionType: {
          id: '3',
          name: 'Student',
          __typename: 'ConcessionTypeNode',
        },
        totalPrice: 100,
        __typename: 'PriceBreakdownTicketNode',
        concession_type: {
          id: '3',
          name: 'Student',
          __typename: 'ConcessionTypeNode',
        },
        seat_group: {
          id: '2',
          name: 'Proj Seats',
          __typename: 'SeatGroupNode',
        },
      },
    ],
    miscCosts: [
      {
        name: 'Booking Fee',
        description: 'adipisci dolorum iusto error est',
        percentage: 0.05,
        value: 74,
        __typename: 'MiscCostNode',
        valuePounds: '0.74',
      },
    ],
    ticketsPrice: 1500,
    ticketsDiscountedPrice: 1479,
    discountsValue: 21,
    subtotalPrice: 1479,
    miscCostsValue: 74,
    totalPrice: 1553,
    __typename: 'PriceBreakdownNode',
  },
  dirty: false,
  raw: {
    id: '4',
    reference: '6hyqt6sh6lwu',
    status: 'IN_PROGRESS',
    priceBreakdown: {
      tickets: [
        {
          number: 2,
          seatGroup: {
            id: '1',
            name: 'The best seats in the house',
            __typename: 'SeatGroupNode',
          },
          concessionType: {
            id: '1',
            name: 'Adult',
            __typename: 'ConcessionTypeNode',
          },
          totalPrice: 600,
          __typename: 'PriceBreakdownTicketNode',
          concession_type: {
            id: '1',
            name: 'Adult',
            __typename: 'ConcessionTypeNode',
          },
          seat_group: {
            id: '1',
            name: 'The best seats in the house',
            __typename: 'SeatGroupNode',
          },
        },
        {
          number: 1,
          seatGroup: {
            id: '1',
            name: 'The best seats in the house',
            __typename: 'SeatGroupNode',
          },
          concessionType: {
            id: '3',
            name: 'Student',
            __typename: 'ConcessionTypeNode',
          },
          totalPrice: 800,
          __typename: 'PriceBreakdownTicketNode',
          concession_type: {
            id: '3',
            name: 'Student',
            __typename: 'ConcessionTypeNode',
          },
          seat_group: {
            id: '1',
            name: 'The best seats in the house',
            __typename: 'SeatGroupNode',
          },
        },
        {
          number: 1,
          seatGroup: {
            id: '2',
            name: 'Proj Seats',
            __typename: 'SeatGroupNode',
          },
          concessionType: {
            id: '3',
            name: 'Student',
            __typename: 'ConcessionTypeNode',
          },
          totalPrice: 100,
          __typename: 'PriceBreakdownTicketNode',
          concession_type: {
            id: '3',
            name: 'Student',
            __typename: 'ConcessionTypeNode',
          },
          seat_group: {
            id: '2',
            name: 'Proj Seats',
            __typename: 'SeatGroupNode',
          },
        },
      ],
      miscCosts: [
        {
          name: 'Booking Fee',
          description: 'adipisci dolorum iusto error est',
          percentage: 0.05,
          value: 74,
          __typename: 'MiscCostNode',
          valuePounds: '0.74',
        },
      ],
      ticketsPrice: 1500,
      ticketsDiscountedPrice: 1479,
      discountsValue: 21,
      subtotalPrice: 1479,
      miscCostsValue: 74,
      totalPrice: 1553,
      __typename: 'PriceBreakdownNode',
    },
    tickets: [
      {
        id: '7',
        seatGroup: {
          id: '1',
          name: 'The best seats in the house',
          __typename: 'SeatGroupNode',
        },
        concessionType: {
          id: '1',
          name: 'Adult',
          __typename: 'ConcessionTypeNode',
        },
        __typename: 'TicketNode',
      },
      {
        id: '8',
        seatGroup: {
          id: '1',
          name: 'The best seats in the house',
          __typename: 'SeatGroupNode',
        },
        concessionType: {
          id: '1',
          name: 'Adult',
          __typename: 'ConcessionTypeNode',
        },
        __typename: 'TicketNode',
      },
      {
        id: '9',
        seatGroup: {
          id: '1',
          name: 'The best seats in the house',
          __typename: 'SeatGroupNode',
        },
        concessionType: {
          id: '3',
          name: 'Student',
          __typename: 'ConcessionTypeNode',
        },
        __typename: 'TicketNode',
      },
      {
        id: '10',
        seatGroup: {
          id: '2',
          name: 'Proj Seats',
          __typename: 'SeatGroupNode',
        },
        concessionType: {
          id: '3',
          name: 'Student',
          __typename: 'ConcessionTypeNode',
        },
        __typename: 'TicketNode',
      },
    ],
    performance: {
      id: '1',
      production: {
        id: '1',
        name: 'Legally Blonde',
        slug: 'legally-blonde',
        __typename: 'ProductionNode',
      },
      start: '2020-12-19T10:00:00',
      end: '2020-12-19T11:30:00',
      doorsOpen: '2020-12-19T09:30:00',
      venue: {
        slug: 'pegg-theatre',
        __typename: 'VenueNode',
      },
      durationMins: 120,
      __typename: 'PerformanceNode',
    },
    __typename: 'BookingNode',
  },
}

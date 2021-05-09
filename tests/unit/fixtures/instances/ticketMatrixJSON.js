export default {
  raw_ticket_options: [
    {
      capacityRemaining: 10,
      seatGroup: {
        id: '1',
        name: 'Best seats in the house',
        description: 'The best seats obviously',
        __typename: 'SeatGroupNode',
      },
      concessionTypes: [
        {
          concessionType: {
            id: '1',
            name: 'Adult',
            description: null,
            __typename: 'ConcessionTypeNode',
          },
          price: 1000,
          __typename: 'ConcessionTypeBookingType',
        },
        {
          concessionType: {
            id: '3',
            name: 'Student',
            description: 'Valid ID NOT required',
            __typename: 'ConcessionTypeNode',
          },
          price: 800,
          __typename: 'ConcessionTypeBookingType',
        },
      ],
      __typename: 'PerformanceSeatGroupNode',
    },
    {
      capacityRemaining: 11,
      seatGroup: {
        id: '2',
        name: 'The Meh Seats',
        description: null,
        __typename: 'SeatGroupNode',
      },
      concessionTypes: [
        {
          concessionType: {
            id: '1',
            name: 'Adult',
            description: null,
            __typename: 'ConcessionTypeNode',
          },
          price: 1000,
          __typename: 'ConcessionTypeBookingType',
        },
        {
          concessionType: {
            id: '3',
            name: 'Student',
            description: 'Valid ID NOT required',
            __typename: 'ConcessionTypeNode',
          },
          price: 800,
          __typename: 'ConcessionTypeBookingType',
        },
      ],
      __typename: 'PerformanceSeatGroupNode',
    },
  ],
  _performanceCapacityRemaining: 65,
  raw_discounts: [
    {
      name: 'Family Discount',
      seatGroup: null,
      requirements: [
        {
          number: 2,
          concessionType: {
            id: '1',
            name: 'Adult',
            __typename: 'ConcessionTypeNode',
          },
          __typename: 'DiscountRequirementNode',
        },
        {
          number: 2,
          concessionType: {
            id: '2',
            name: 'Child',
            __typename: 'ConcessionTypeNode',
          },
          __typename: 'DiscountRequirementNode',
        },
      ],
      __typename: 'DiscountNode',
    },
  ],
}

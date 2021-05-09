export default {
  raw_ticket_options: [
    {
      capacityRemaining: 10,
      seatGroup: {
        id: '1',
        name: 'The best seats in the house',
        description: 'They are sooooo good',
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
          price: 300,
          __typename: 'ConcessionTypeBookingType',
        },
        {
          concessionType: {
            id: '2',
            name: 'Child',
            description: 'occaecati reiciendis dolor odit voluptas',
            __typename: 'ConcessionTypeNode',
          },
          price: 400,
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
        name: 'Proj Seats',
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
          price: 900,
          __typename: 'ConcessionTypeBookingType',
        },
        {
          concessionType: {
            id: '2',
            name: 'Child',
            description: 'occaecati reiciendis dolor odit voluptas',
            __typename: 'ConcessionTypeNode',
          },
          price: 400,
          __typename: 'ConcessionTypeBookingType',
        },
        {
          concessionType: {
            id: '3',
            name: 'Student',
            description: 'Valid ID NOT required',
            __typename: 'ConcessionTypeNode',
          },
          price: 100,
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

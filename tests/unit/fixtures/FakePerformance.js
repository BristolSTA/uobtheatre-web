import { generateConcessionTypeBookingTypes } from '@/fakeApi/utils';

export default (server) => {
  // Seed fake types
  let conc1 = server.create('concessionTypeNode', {
    name: 'Adult',
  });
  let conc2 = server.create('concessionTypeNode', {
    name: 'Student',
  });

  return {
    production: server.create('productionNode'),
    discounts: [
      server.create('discountNode', {
        percentage: 0.5,
        name: 'Family Discount',
        requirements: [
          server.create('discountRequirementNode', {
            number: 1,
            concessionTypeId: conc1.id,
          }),
          server.create('discountRequirementNode', {
            number: 2,
            concessionTypeId: conc2.id,
          }),
        ],
      }),
    ],
    ticketOptions: [
      server.create('PerformanceSeatGroupNode', {
        capacityRemaining: 10,
        seatGroup: server.create('seatGroupNode', {
          name: 'Best seats in the house',
          description: 'The best seats obviously',
        }),
        concessionTypes: generateConcessionTypeBookingTypes(
          [conc1, conc2],
          server,
          [{ price: 1000 }, { price: 800 }]
        ),
      }),
      server.create('PerformanceSeatGroupNode', {
        capacityRemaining: 10,
        seatGroup: server.create('seatGroupNode', {
          name: 'The Meh Seats',
        }),
        concessionTypes: generateConcessionTypeBookingTypes(
          [conc1, conc2],
          server,
          [{ price: 1000 }, { price: 800 }]
        ),
      }),
    ],
  };
};

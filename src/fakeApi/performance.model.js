import faker from 'faker';
import { DateTime } from 'luxon';
import { Factory } from 'miragejs';

import { updateIfDoesntHave } from './utils';

export default {
  registerFactories() {
    return {
      performanceNode: Factory.extend({
        start() {
          return DateTime.local().plus({
            days: faker.random.number({ min: 1, max: 3 }),
            hours: faker.random.number({ min: 1, max: 3 }),
          });
        },
        end() {
          return DateTime.fromISO(this.start).plus({
            hours: faker.random.number({ min: 1, max: 3 }),
          });
        },
        doorsOpen() {
          return DateTime.fromISO(this.start).minus({
            hours: faker.random.number({ min: 1, max: 2 }),
          });
        },
        description: faker.lorem.words(4),
        soldOut: () => faker.random.arrayElement([true, false]),
        disabled: () => false,
        isOnline: () => faker.random.arrayElement([true, false]),
        isInperson: () => faker.random.arrayElement([true, false]),
        durationMins() {
          return Math.round((this.end - this.start) / (1000 * 60));
        },
        minSeatPrice: () => faker.random.number({ min: 100, max: 1000 }),
        capacityRemaining: () => faker.random.number({ min: 40, max: 100 }),

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('VenueNode');
            },
            production: () => {
              return server.create('ProductionNode');
            },
            // breaks here
          });
        },
      }),
      performanceSeatGroupNode: Factory.extend({
        capacity: () => faker.random.number({ min: 50, max: 100 }),
        capacityRemaining: () => faker.random.number({ min: 0, max: 100 }),
      }),
    };
  },
  registerGQLTypes() {
    return `
      type PerformanceNode implements Node {
        id: ID!
        production: ProductionNode!
        venue: VenueNode
        doorsOpen: DateTime
        start: DateTime
        end: DateTime
        description: String
        extraInformation: String
        disabled: Boolean!
        seatGroups(offset: Int, before: String, after: String, first: Int, last: Int): SeatGroupNodeConnection!
        capacity: Int
        capacityRemaining: Int
        ticketOptions: [PerformanceSeatGroupNode]
        minSeatPrice: Int

        durationMins: Int
        isInperson: Boolean!
        isOnline: Boolean!
        soldOut: Boolean!
        discounts: [DiscountNode]
      }
    `;
  },
  registerGQLQueries() {
    return `
      performance(id: ID!): PerformanceNode
    `;
  },
};

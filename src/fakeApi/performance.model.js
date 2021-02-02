import faker from 'faker';
import { DateTime } from 'luxon';
import { Factory } from 'miragejs';

import { updateIfDoesntHave } from './utils';

export default {
  registerFactories() {
    return {
      performanceNode: Factory.extend({
        start: () => DateTime.local(),
        end: () =>
          DateTime.local().plus({
            hours: faker.random.number({ min: 1, max: 3 }),
          }),
        description: faker.lorem.words(4),
        soldOut: () => faker.random.arrayElement([true, false]),
        disabled: () => false,
        isOnline: () => faker.random.arrayElement([true, false]),
        isInperson: () => faker.random.arrayElement([true, false]),
        durationMins() {
          return Math.round(
            (DateTime.fromISO(this.end) - DateTime.fromISO(this.start)) /
              (1000 * 60)
          );
        },
        minSeatPrice: () => faker.random.number({ min: 100, max: 100 }),

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('VenueNode');
            },
          });
        },
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
        ticketOptions: [PerformanceSeatGroupNode]
      }
    `;
  },
};

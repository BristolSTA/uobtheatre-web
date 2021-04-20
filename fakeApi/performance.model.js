import faker from 'faker'
import { DateTime } from 'luxon'
import { Factory, trait } from 'miragejs'

import { updateIfDoesntHave } from './utils'

export default {
  registerFactories() {
    return {
      performanceNode: Factory.extend({
        start() {
          return DateTime.local().plus({
            days: faker.datatype.number({ min: 1, max: 3 }),
            hours: faker.datatype.number({ min: 1, max: 3 }),
          })
        },
        end() {
          return DateTime.fromISO(this.start).plus({
            hours: faker.datatype.number({ min: 1, max: 3 }),
          })
        },
        doorsOpen() {
          return DateTime.fromISO(this.start).minus({
            minutes: faker.datatype.number({ min: 1, max: 20 }),
          })
        },
        description: faker.lorem.words(4),
        soldOut: () => faker.random.arrayElement([true, false]),
        disabled: () => false,
        isOnline: () => faker.random.arrayElement([true, false]),
        isInperson: () => faker.random.arrayElement([true, false]),
        durationMins() {
          return Math.round((this.end - this.start) / (1000 * 60))
        },
        minSeatPrice: () => faker.datatype.number({ min: 100, max: 1000 }),
        capacityRemaining: () => faker.datatype.number({ min: 40, max: 100 }),

        past: trait({
          start() {
            return DateTime.local().minus({
              days: faker.datatype.number({ min: 1, max: 3 }),
              hours: faker.datatype.number({ min: 1, max: 3 }),
            })
          },
          end() {
            return DateTime.fromISO(this.start).minus({
              hours: faker.datatype.number({ min: 1, max: 3 }),
            })
          },
          doorsOpen() {
            return DateTime.fromISO(this.start).plus({
              minutes: faker.datatype.number({ min: 1, max: 20 }),
            })
          },
        }),

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('VenueNode')
            },
            production: () => {
              return server.create('ProductionNode')
            },
            // breaks here
          })
        },
      }),
      performanceSeatGroupNode: Factory.extend({
        capacity: () => faker.datatype.number({ min: 50, max: 100 }),
        capacityRemaining: () => faker.datatype.number({ min: 0, max: 100 }),
      }),
    }
  },
}

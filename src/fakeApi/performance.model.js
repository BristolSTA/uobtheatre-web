import faker from 'faker';
import { DateTime } from 'luxon';
import { belongsTo, Factory, hasMany, Model } from 'miragejs';

import {
  NotFoundResponse,
  RelationshipSerializer,
  updateIfDoesntHave,
} from './utils';

export default {
  registerModels() {
    return {
      performance: Model.extend({
        venue: belongsTo(),
        production: belongsTo('performance'),
        seatLocations: hasMany('seat_location'),
        ticketTypes: hasMany('ticket_type'),
      }),
    };
  },
  registerSerializers() {
    return {
      performance: RelationshipSerializer(['venue']),
    };
  },
  registerFactories() {
    return {
      performance: Factory.extend({
        start() {
          return DateTime.local().plus({
            days: faker.random.number({ min: 1, max: 3 }),
            hours: faker.random.number({ min: 1, max: 3 }),
          });
        },
        end() {
          return this.start.plus({
            hours: faker.random.number({ min: 1, max: 3 }),
          });
        },
        description: faker.lorem.words(4),
        sold_out: () => faker.random.arrayElement([true, false]),
        disabled: () => false,
        is_online: () => faker.random.arrayElement([true, false]),
        is_inperson: () => faker.random.arrayElement([true, false]),
        duration_mins() {
          return Math.round((this.end - this.start) / (1000 * 60));
        },

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('venue');
            },

            seatLocations: () => {
              return server.createList('seatLocation', 2);
            },

            ticketTypes: () => {
              return server.createList('ticketType', 2);
            },
          });
        },
      }),
    };
  },
  registerRoutes() {
    this.resource('performances');
    // Production by slug
    this.get(
      'productions/:slug/performances/:performance_id/ticket_types',
      function (schema, request) {
        let performance = schema.performances.find(
          request.params.performance_id
        );
        if (!performance) {
          return NotFoundResponse();
        }

        let seatLocations = this.serialize(performance.seatLocations)
          .seatLocations;

        let ticketTypes = this.serialize(performance.ticketTypes).ticketTypes;

        return seatLocations.map((seatLocation) => {
          return {
            seat_group: seatLocation,
            concession_types: ticketTypes,
          };
        });
      }
    );
  },
};

import faker from 'faker';
import { belongsTo, Factory, hasMany, Model } from 'miragejs';

import { DefaultSerializer, updateIfDoesntHave } from './utils';

export default {
  registerModels() {
    return {
      booking: Model.extend({
        performance: belongsTo('performance'),
        tickets: hasMany('ticket'),
      }),
      ticket: Model.extend({
        seatGroup: belongsTo('seatGroup'),
        concessionType: belongsTo('concessionType'),
      }),
    };
  },
  registerSerializers() {
    return {
      booking: DefaultSerializer.extend({
        include: ['tickets'],
        serialize(object) {
          let json = this.buildPayload(object);
          json.performance_id = object.performanceId;
          json.tickets = object.tickets.models.map((ticket) => {
            return {
              seat_group_id: ticket.seatGroupId,
              concession_type_id: ticket.concessionTypeId,
            };
          });
          return json;
        },
      }),
    };
  },
  registerFactories() {
    return {
      booking: Factory.extend({
        afterCreate(booking, server) {
          updateIfDoesntHave(booking, [
            {
              performance: () => {
                return server.create('performance');
              },
            },
            {
              tickets: () => {
                return server.createList('ticket', 2, {
                  seatGroup: () =>
                    faker.random.arrayElement(
                      booking.performance.seatGroups.models
                    ),
                  concessionType: () =>
                    faker.random.arrayElement(
                      booking.performance.concessionTypes.models
                    ),
                });
              },
            },
          ]);
        },
      }),
      ticket: Factory.extend({
        afterCreate(booking, server) {
          updateIfDoesntHave(booking, {
            seatGroup: () => {
              return server.create('seatGroup');
            },
            concessionType: () => {
              return server.create('concessionType');
            },
          });
        },
      }),
    };
  },
  registerRoutes() {
    this.get('/bookings/:id');
  },
};

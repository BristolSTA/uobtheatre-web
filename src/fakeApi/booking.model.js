import faker from 'faker';
import lo from 'lodash';
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

          let tickets_pricebreakdown = lo
            .chain(json.tickets)
            .groupBy((ticket) => [
              ticket.seat_group_id,
              ticket.concession_type_id,
            ])
            .values()
            .map((groupedTickets) => {
              let concessionType = this.schema.concessionTypes.find(
                groupedTickets[0].concession_type_id
              );
              return {
                number: groupedTickets.length,
                concession_type: concessionType,
                seat_group: this.schema.seatGroups.find(
                  groupedTickets[0].seat_group_id
                ),
                ticket_price: concessionType.price,
                total_price: concessionType.price * groupedTickets.length,
              };
            })
            .value();

          let ticket_price = tickets_pricebreakdown
            .map((tickets) => tickets.total_price)
            .reduce((a, b) => a + b, 0);

          // A bit of a bodge...
          let discounts_price = object.performance.discounts.models.length
            ? object.performance.discounts.models[0].discount * 100
            : 0;

          json.price_breakdown = {
            tickets: tickets_pricebreakdown,
            tickets_price: ticket_price,
            discounts_value: discounts_price,
            misc_costs: [],
            total_price: ticket_price - discounts_price,
          };

          return json;
        },
        normalize() {
          if (arguments[0].booking.tickets) {
            arguments[0].booking.tickets = arguments[0].booking.tickets.map(
              (ticket) => {
                let ticketModel = this.schema.tickets.create({
                  seatGroup: this.schema.seatGroups.find(ticket.seat_group_id),
                  concessionType: this.schema.concessionTypes.find(
                    ticket.concession_type_id
                  ),
                });
                return ticketModel.id;
              }
            );
          }
          return DefaultSerializer.prototype.normalize.apply(this, arguments);
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
    // Booking resource endpoints
    this.resource('bookings', { except: ['create', 'update'] });
    this.post('bookings', function (schema, request) {
      request.requestBody = JSON.stringify({
        booking: JSON.parse(request.requestBody),
      });
      let attrs = this.normalizedRequestAttrs('booking');
      return schema.bookings.create(attrs);
    });
    this.put('bookings/:id', function (schema, request) {
      request.requestBody = JSON.stringify({
        booking: JSON.parse(request.requestBody),
      });
      let attrs = this.normalizedRequestAttrs('booking');
      return schema.bookings.find(request.params.id).update(attrs);
    });
  },
};

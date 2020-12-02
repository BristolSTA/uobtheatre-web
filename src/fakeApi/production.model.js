import { DateTime } from 'luxon';
import { Model, Factory, belongsTo, hasMany } from 'miragejs';
import faker from 'faker';
import {
  RelationshipSerializer,
  updateIfDoesntHave,
  paginatedResponse,
  NotFoundResponse,
} from './utils';

export default {
  registerModels() {
    return {
      production: Model.extend({
        society: belongsTo('society'),
        performances: hasMany(),
        cast: hasMany('cast'),
        crew: hasMany('crew'),
        productionTeam: hasMany('production_team'),
      }),
    };
  },
  registerSerializers() {
    return {
      production: RelationshipSerializer([
        'society',
        'performances',
        'cast',
        'crew',
        'productionTeam',
      ]),
    };
  },
  registerFactories() {
    return {
      production: Factory.extend({
        name: () => faker.random.words(3),
        subtitle: null,
        slug() {
          return this.name.toLowerCase().replace(/ /g, '-');
        },
        poster_image: 'https://via.placeholder.com/400x566',
        featured_image: 'https://via.placeholder.com/1920x960',
        cover_image: 'https://via.placeholder.com/1800x1000',
        age_rating: null,
        facebook_event: 'https://facebook.com',
        description: () => faker.lorem.paragraphs(3),
        warnings: ['Strobe Lighting', 'Nudity'],
        start_date: () => DateTime.local(),
        end_date: () =>
          DateTime.local().plus({
            day: faker.random.number({ min: 1, max: 3 }),
          }),
        min_ticket_price: () =>
          faker.random.number({ min: 1, max: 10 }).toFixed(2),
        afterCreate(production, server) {
          updateIfDoesntHave(production, {
            cast: () => {
              return server.createList('cast', 30);
            },
            crew: () => {
              return server.createList('crew', 4);
            },
            productionTeam: () => {
              return server.createList('productionTeam', 3);
            },
            society: () => {
              return server.create('society');
            },
          });
        },
      }),
    };
  },
  registerRoutes() {
    this.resource('productions', { except: ['index', 'show'] });

    // Upcoming Productions
    this.get('productions/upcoming_productions', function (schema) {
      return paginatedResponse(this.serialize(schema.productions.all()));
    });

    // All productions paginated endpoint
    this.get('productions', function (schema) {
      return paginatedResponse(this.serialize(schema.productions.all()));
    });

    // Production by slug
    this.get('productions/:slug', function (schema, request) {
      return (
        schema.productions.findBy({ slug: request.params.slug }) ??
        NotFoundResponse()
      );
    });
  },
};

import {
  Factory,
  Model,
  Serializer,
  belongsTo,
  createServer,
  hasMany,
} from 'miragejs';

import faker from 'faker';

import { DateTime } from 'luxon';

let paginatedResponse = (data) => {
  return {
    count: 2,
    next: null,
    previous: null,
    results: data.models ? data.models : data,
  };
};

let updateIfDoesntHave = function (model, keyValues, value) {
  // By default, assume keyValues is a dictonary of key value pairs
  if (keyValues instanceof String) {
    keyValues = {
      [keyValues]: value,
    };
  }
  let updateObj = {};
  Object.keys(keyValues).forEach((key) => {
    if (!model[key]) {
      value = keyValues[key];
      if (typeof value === 'function') value = value();
      updateObj[key] = value;
    }
  });
  model.update(updateObj);
};

export function makeServer({ environment = 'development' } = {}) {
  let RelationshipSerializer = (relationships) =>
    Serializer.extend({
      embed: true,
      include: relationships,
    });

  return createServer({
    environment,

    models: {
      production: Model.extend({
        society: belongsTo('society'),
        performances: hasMany(),
        cast: hasMany('cast'),
        crew: hasMany('crew'),
        productionTeam: hasMany('production_team'),
      }),
      performance: Model.extend({
        venue: belongsTo(),
        production: belongsTo('performance'),
      }),
      society: Model,
      venue: Model,
      cast: Model.extend({
        production: belongsTo(),
      }),
      crew: Model.extend({
        production: belongsTo(),
      }),
      production_team: Model.extend({
        production: belongsTo(),
      }),
    },

    serializers: {
      production: RelationshipSerializer([
        'society',
        'performances',
        'cast',
        'crew',
        'productionTeam',
      ]),
      performance: RelationshipSerializer(['venue']),
    },

    factories: {
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
      performance: Factory.extend({
        start: () => DateTime.local(),
        end: () =>
          DateTime.local().plus({
            hours: faker.random.number({ min: 1, max: 3 }),
          }),
        description: faker.lorem.words(4),
        sold_out: () => faker.random.arrayElement([true, false]),
        is_online: () => faker.random.arrayElement([true, false]),
        is_inperson: () => faker.random.arrayElement([true, false]),
        duration_mins: 100,

        afterCreate(performance, server) {
          updateIfDoesntHave(performance, {
            venue: () => {
              return server.create('venue');
            },
          });
        },
      }),
      venue: Factory.extend({
        name: () => `${faker.random.arrayElement(['Winston', 'Pegg'])} Theatre`,
      }),
      society: Factory.extend({
        name: () => faker.name.findName(),
        logo_image: 'https://via.placeholder.com/500x500/0000FF',
      }),
      cast: Factory.extend({
        name: () => faker.name.findName(),
        profile_picture: () =>
          faker.random.arrayElement([
            'https://via.placeholder.com/100x100/FBD400',
            null,
          ]),
        role: () =>
          faker.random.arrayElement(['Peter Pan', 'The Wizard', 'Gary']),
      }),
      crew: Factory.extend({
        department: () =>
          faker.random.arrayElement(['Stage Management', 'Lighting', 'Sound']),
        name: () => faker.name.findName(),
      }),
      productionTeam: Factory.extend({
        role: () => faker.random.arrayElement(['Producer', 'Music Director']),
        name: () => faker.name.findName(),
      }),
    },

    seeds(server) {
      let dramsoc = server.create('society', {
        name: 'Dramsoc',
      });

      server.create('production', {
        name: 'Legally Blonde',
        society: server.create('society', {
          name: 'MTB',
        }),
        performances: server.createList('performance', 3),
      });

      server.create('production', {
        name: 'TRASh',
        subtitle: 'The Really Artsy Show',
        society: dramsoc,
        start_date: '2020-11-19',
        end_date: '2020-11-19',
        performances: server.createList('performance', 1),
      });

      server.create('production', {
        name: 'Present Laughter',
        society: dramsoc,
      });

      server.create('production', {
        name: 'A Default Production',
      });
    },

    routes() {
      this.namespace = 'api';

      this.resource('productions', { except: ['index', 'show'] });
      this.get('productions/upcoming_productions', function (schema) {
        return paginatedResponse(
          this.serialize(schema.productions.all()).productions
        );
      });
      this.get('productions', function (schema) {
        return paginatedResponse(
          this.serialize(schema.productions.all()).productions
        );
      });
      this.get('productions/:slug', function (schema, request) {
        return schema.productions.findBy({ slug: request.params.slug });
      });

      this.resource('performances');
      this.resource('venues');
      this.resource('societies');
    },
  });
}

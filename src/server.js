import {
  Server,
  Model,
  Factory,
  belongsTo,
  hasMany,
  Serializer,
} from 'miragejs';

import faker from 'faker';

let paginatedResponse = (data) => {
  return {
    count: 2,
    next: null,
    previous: null,
    results: data.models ?? data,
  };
};

export function makeServer({ environment = 'development' } = {}) {
  let RelationshipSerializer = (relationships) =>
    Serializer.extend({
      embed: true,
      include: relationships,
    });

  const server = new Server({
    environment,

    models: {
      production: Model.extend({
        society: belongsTo(),
        performances: hasMany(),
      }),
      performance: Model.extend({
        venue: belongsTo(),
        production: belongsTo(),
      }),
      society: Model,
      venue: Model,
    },

    serializers: {
      production: RelationshipSerializer(['society', 'performances']),
    },

    factories: {
      production: Factory.extend({
        name: () => faker.random.words(3),
        subtitle: () => faker.lorem.sentence(5),
        poster_image: null,
        feature_image: null,
        description: () => faker.lorem.paragraph(),
      }),
      performance: Factory.extend({
        start_time: '',
        end_time: '',
        description: '',

        afterCreate(performance, server) {
          performance.venue = server.create('venue');
        },
      }),
      venue: Factory.extend({
        name: () => `${faker.random.arrayElement(['Winston', 'Pegg'])} Theatre`,
      }),
      society: Factory.extend({
        name: () => faker.name.findName(),
      }),
    },

    seeds(server) {
      let dramsoc = server.create('society', {
        name: 'Dramsoc',
      });
      let mtbSociety = server.create('society', {
        name: 'MTB',
      });

      server.create('production');
      server.create('production', {
        name: 'Legally Blonde',
        society: mtbSociety,
      });
      server.create('production', {
        name: 'TRASh',
        subtitle: 'The Really Artsy Show',
        society: dramsoc,
      });
      server.create('production', {
        name: 'Present Laughter',
        society: dramsoc,
      });
    },

    routes() {
      this.namespace = 'api';

      this.resource('productions', { except: ['index'] });
      this.get('productions', function (schema) {
        return paginatedResponse(
          this.serialize(schema.productions.all()).productions
        );
      });

      this.resource('performances');
      this.resource('venues');
      this.resource('societies');
    },
  });

  return server;
}

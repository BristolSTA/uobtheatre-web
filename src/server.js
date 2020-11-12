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
        society: belongsTo('society'),
        performances: hasMany(),
        cast: hasMany('cast'),
        crew: hasMany('crew'),
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
    },

    serializers: {
      production: RelationshipSerializer([
        'society',
        'performances',
        'cast',
        'crew',
      ]),
    },

    factories: {
      production: Factory.extend({
        name: () => faker.random.words(3),
        subtitle: () => faker.lorem.sentence(5),
        poster_image: null,
        featured_image: null,
        age_rating: null,
        facebook_event: null,
        description: () => faker.lorem.paragraph(),
        warnings: ['Stobe Lighting', 'Nudity'],
        start_date () {
          return this.performances
        },
        afterCreate(production, server) {
          production.cast = server.createList('cast', 4, {
            production: production,
          });
          production.crew = server.createList('crew', 4, {
            production: production,
          });
          production.society = server.create('society');
        },
      }),
      performance: Factory.extend({
        start: () => faker.date.past(),
        end: () => faker.date.future(),
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
      cast: Factory.extend({
        name: () => faker.name.findName(),
        profile_picture: null,
        role: () =>
          faker.random.arrayElement(['Peter Pan', 'The Wizard', 'Gary']),
      }),
      crew: Factory.extend({
        role: () =>
          faker.random.arrayElement([
            'Stage Manager',
            'Chief Electrician',
            'Sound Engineer',
          ]),
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

      let legally = server.create('production', {
        name: 'Legally Blonde',
        society: mtbSociety,
      });
      legally.createPerformance();
      legally.createPerformance();

      let trash = server.create('production', {
        name: 'TRASh',
        subtitle: 'The Really Artsy Show',
        society: dramsoc,
      });
      trash.createPerformance();
      server.create('production', {
        name: 'Present Laughter',
        society: dramsoc,
      });
    },

    routes() {
      this.namespace = 'api';

      this.resource('productions', { except: ['index'] });
      this.get('productions/upcoming_productions',  function (schema) {
        return paginatedResponse(
          this.serialize(schema.productions.all()).productions
        );
      });
      
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

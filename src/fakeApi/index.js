import { createServer } from 'miragejs';

import CastInterface from './cast.model';
import CrewInterface from './crew.model';
import PerformanceInterface from './performance.model';
import ProductionInterface from './production.model';
import ProductionTeamInterface from './productionTeam.model';
import SocietyInterface from './society.model';
import UserInterface from './user.model';
import { DefaultSerializer } from './utils';
import VenueInterface from './venue.model';

let apiModels = [
  ProductionInterface,
  PerformanceInterface,
  SocietyInterface,
  CastInterface,
  CrewInterface,
  ProductionTeamInterface,
  VenueInterface,
  UserInterface,
];

let models = {};
let serializers = {};
let factories = {};

/**
 * Creates and installs the Mirage JS mock API server
 *
 * @param {string} environment The environment the server is being used in
 * @returns {createServer} MirageJS Server instance
 */
export function makeServer({ environment = 'development' } = {}) {
  apiModels.forEach((model) => {
    models = Object.assign(models, model.registerModels());
    serializers = Object.assign(serializers, model.registerSerializers());
    factories = Object.assign(factories, model.registerFactories());
  });

  return createServer({
    environment,

    models: Object.assign({}, models),

    serializers: Object.assign(
      {
        application: DefaultSerializer,
      }
      , serializers),

    factories: Object.assign({}, factories),

    seeds(server) {
      let dramsoc = server.create('society', {
        name: 'Dramsoc',
        logo_image: null,
      });

      let winston = server.create('venue', {
        name: 'Winston Theatre',
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
        performances: server.createList('performance', 1, {
          venue: winston,
        }),
      });

      server.create('production', {
        name: 'Present Laughter',
        society: dramsoc,
      });

      server.create('production', {
        name: 'A Default Production',
      });

      server.create('user', {
        password: 'admin',
        email: 'admin@bristolsta.com',
        token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
      });
    },

    routes() {
      this.namespace = 'api';

      apiModels.forEach((model) => {
        model.registerRoutes.bind(this)();
      });
    },
  });
}

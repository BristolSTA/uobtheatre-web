import { createServer } from 'miragejs';

import ProductionInterface from './production.model';
import PerformanceInterface from './performance.model';
import SocietyInterface from './society.model';
import CastInterface from './cast.model';
import CrewInterface from './crew.model';
import ProductionTeamInterface from './productionTeam.model';
import VenueInterface from './venue.model';

let apiModels = [
  new ProductionInterface(),
  new PerformanceInterface(),
  new SocietyInterface(),
  new CastInterface(),
  new CrewInterface(),
  new ProductionTeamInterface(),
  new VenueInterface(),
];

let models = {};
let serializers = {};
let factories = {};

export function makeServer({ environment = 'development' } = {}) {
  apiModels.forEach((model) => {
    models = Object.assign(models, model.registerModels());
    serializers = Object.assign(serializers, model.registerSerializers());
    factories = Object.assign(factories, model.registerFactories());
  });

  return createServer({
    environment,

    models: Object.assign({}, models),

    serializers: Object.assign({}, serializers),

    factories: Object.assign({}, factories),

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

      apiModels.forEach((model) => {
        model.registerRoutes.bind(this)();
      });
    },
  });
}

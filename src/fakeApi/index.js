import { createServer } from 'miragejs';

import BookingInterface from './booking.model';
import CastInterface from './cast.model';
import ConcessionTypeInterface from './concessionType.model';
import CrewInterface from './crew.model';
import DiscountInterface from './discount.model';
import PerformanceInterface from './performance.model';
import ProductionInterface from './production.model';
import ProductionTeamInterface from './productionTeam.model';
import SeatGroupInterface from './seatGroup.model';
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
  SeatGroupInterface,
  ConcessionTypeInterface,
  BookingInterface,
  DiscountInterface,
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
      },
      serializers
    ),

    factories: Object.assign({}, factories),

    seeds(server) {
      /**
       * Fake Performance 1 - Legally Blonde, MTB, with 3 performances (19th,20th,21st (sold out))
       */

      let performances = server.createList('performance', 3);
      performances[0].sold_out = false;
      performances[0].start = '2020-12-19T10:00:00';
      performances[0].end = '2020-12-19T11:30:00';
      performances[0].seatGroups = [
        server.create('seatGroup', {
          name: 'The best seats in the house',
          description: 'They are sooooo good',
        }),
        server.create('seatGroup', {
          name: 'Proj Seats',
          description: null,
        }),
      ];
      performances[0].concessionTypes = [
        server.create('concessionType', {
          name: 'Adult',
          description: null,
        }),
        server.create('concessionType', {
          name: 'Child',
          description: 'Under 17.5 years',
        }),
        server.create('concessionType', {
          name: 'Student',
          description: 'Valid ID not required',
        }),
      ];
      performances[0].discounts = server.createList('discount', 2, {
        performance: performances[0],
      });

      performances[1].sold_out = false;
      performances[1].start = '2020-12-20T14:15:00';
      performances[1].end = '2020-12-20T15:15:00';

      performances[2].sold_out = true;
      performances[2].start = '2020-12-21T18:00:00';
      performances[2].end = '2020-12-21T20:30:00';
      server.create('production', {
        name: 'Legally Blonde',
        society: server.create('society', {
          name: 'MTB',
        }),
        performances: performances,
      });

      /**
       * Fake Performance 2 - TRASh, Dramsoc, 1 performance, no warnings
       */

      let dramsoc = server.create('society', {
        name: 'Dramsoc',
        logo_image: null,
      });

      server.create('production', {
        name: 'TRASh',
        subtitle: 'The Really Artsy Show',
        society: dramsoc,
        start_date: '2020-11-19',
        end_date: '2020-11-19',
        warnings: [],
        performances: server.createList('performance', 1),
      });

      /**
       * Fake Performance 3 - Present laughter
       */

      server.create('production', {
        name: 'Present Laughter',
        society: dramsoc,
      });

      /**
       * Fake Performance 4 - A complete random production called A Default Production
       */
      server.create('production', {
        name: 'A Default Production',
      });

      /**
       * A user
       */

      server.create('user', {
        password: 'admin',
        email: 'admin@bristolsta.com',
        token: '36c86c19f8f8d73aa59c3a00814137bdee0ab8de',
      });
      console.log(server);
    },

    routes() {
      this.namespace = 'api';

      apiModels.forEach((model) => {
        model.registerRoutes.bind(this)();
      });
    },
  });
}

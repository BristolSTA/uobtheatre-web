import { mirageGraphQLFieldResolver } from '@miragejs/graphql';
import faker from 'faker';
import { Factory, Response } from 'miragejs';

import {
  authedUser,
  updateIfDoesntHave,
  ValidationErrorResponse,
} from './utils';

export default {
  registerFactories() {
    return {
      userNode: Factory.extend({
        firstName: () => faker.name.firstName(),
        lastName: () => faker.name.lastName(),
        email: () => faker.internet.email(),
        password: () => faker.internet.password(),
        token: () => faker.random.uuid(),
        afterCreate(userNode, server) {
          updateIfDoesntHave(userNode, {
            address: () => server.create('AddressNode'),
          });
        },
      }),
    };
  },
  registerRoutes() {
    this.post('api/v1/auth/login/', function (schema, request) {
      let user = schema.userNodes.findBy({
        email: JSON.parse(request.requestBody).email,
      });
      if (!user)
        return ValidationErrorResponse(null, [
          'Unable to log in with provided credentials.',
        ]);
      return new Response(
        200,
        {},
        {
          key: user.token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        }
      );
    });
  },
  registerGQLCustomResolvers() {
    return {
      UserNode: {
        bookings(obj, args, context, info) {
          args.performanceId = args.performance;
          delete args.performance;
          return mirageGraphQLFieldResolver(obj, args, context, info);
        },
      },
    };
  },
  registerGQLQueryResolvers() {
    return {
      authUser(obj, args, context) {
        return authedUser(context);
      },
    };
  },
  registerGQLQueries() {
    return `
      authUser: UserNode
    `;
  },
  registerGQLTypes() {
    return `
      type UserNode implements Node {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!

        bookings(offset: Int, before: String, after: String, first: Int, last: Int, bookingReference: UUID, user: ID, performance: ID, status: BookingStatus, id: ID): BookingNodeConnection!
        address: AddressNode
      }
    `;
  },
};

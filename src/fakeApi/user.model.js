import faker from 'faker';
import { Factory, Model, Response } from 'miragejs';

import { ValidationErrorResponse } from './utils';

export default {
  registerModels() {
    return {
      UserNode: Model,
    };
  },
  registerFactories() {
    return {
      userNode: Factory.extend({
        firstName: () => faker.name.firstName(),
        lastName: () => faker.name.lastName(),
        email: () => faker.email(),
        password: () => faker.password(),
        token: () => faker.token(),
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
  registerGQLQueryResolvers() {
    return {
      authUser(obj, args, context) {
        let authToken = context.request.requestHeaders.authorization;

        if (!authToken) return null;

        authToken = authToken.match(/Token (.+)$/)[1];

        if (!authToken) return null;

        return context.mirageSchema.userNodes.findBy({ token: authToken });
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
      }
    `;
  },
};

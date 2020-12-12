import faker from 'faker';
import { Factory, Model, Response } from 'miragejs';

import { ValidationErrorResponse } from './utils';

export default {
  registerModels() {
    return {
      user: Model,
    };
  },
  registerSerializers() {
    return {};
  },
  registerFactories() {
    return {
      user: Factory.extend({
        name: () => faker.name.findName(),
        email: () => faker.email(),
        password: () => faker.password(),
        token: () => faker.token(),
      }),
    };
  },
  registerRoutes() {
    this.post('api-token-auth', function (schema, request) {
      let user = schema.users.findBy({
        email: JSON.parse(request.requestBody).email,
      });
      if (!user)
        return ValidationErrorResponse(null, [
          'Unable to log in with provided credentials.',
        ]);
      return new Response(200, {}, { token: user.token });
    });
  },
};

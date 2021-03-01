import { mirageGraphQLFieldResolver } from '@miragejs/graphql';
import faker from 'faker';
import { Factory, Response } from 'miragejs';

import {
  authedUser,
  FieldError,
  mutationWithErrorsResolver,
  NonFieldError,
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
      me(obj, args, context) {
        return authedUser(context);
      },
    };
  },
  registerGQLMutationResolvers() {
    return {
      login: mutationWithErrorsResolver((obj, args, context) => {
        if (!args.email) {
          throw new FieldError('Please supply a valid email address', 'email');
        }
        if (!args.password) {
          throw new FieldError('Please supply a password address', 'password');
        }

        let user = context.mirageSchema.userNodes.findBy({
          email: args.email,
        });

        if (!user) {
          throw new NonFieldError(
            'Unable to log in with provided credentials.'
          );
        }

        return {
          user,
          token: user.token,
          unarchiving: false,
        };
      }),
      register: mutationWithErrorsResolver(
        (obj, args, context, info, addError) => {
          let errors = [];
          if (!args.firstName)
            errors.push(
              new FieldError('Please supply a first name', 'firstName')
            );
          if (!args.lastName)
            errors.push(
              new FieldError('Please supply a last name', 'lastName')
            );
          if (!args.email)
            errors.push(
              new FieldError('Please supply a valid email address', 'email')
            );
          if (!args.password1)
            errors.push(
              new FieldError('Please supply a password', 'password1')
            );
          if (!args.password2)
            errors.push(
              new FieldError('Please confirm your password', 'password2')
            );
          if (args.password1 !== args.password2) {
            errors.push(
              new FieldError(
                'Your confirmed password does not match!',
                'password2'
              )
            );
          }

          if (errors.length) {
            addError(errors);
            return;
          }

          context.mirageSchema.userNodes.create({
            email: args.email,
            password: args.password,
            token: faker.random.uuid(),
          });

          return null;
        }
      ),
      verifyAccount: mutationWithErrorsResolver((obj, args) => {
        if (args.token !== '1234abcd') throw new NonFieldError('Invalid Token');
      }),
      sendPasswordResetEmail: mutationWithErrorsResolver(() => {}),
      passwordReset: mutationWithErrorsResolver((obj, args) => {
        if (args.token !== '1234abcd')
          throw new NonFieldError('Invalid Password Reset Token');
        if (args.newPassword1 !== args.newPassword2) {
          throw new FieldError(
            'Your confirmed password does not match!',
            'newPassword2'
          );
        }
      }),
    };
  },
  registerGQLMutations() {
    return `
      login(password: String!, email: String): ObtainJSONWebToken
      register(email: String!, password1: String!, password2: String!, firstName: String!, lastName: String!): Register
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
      }
    `;
  },
};

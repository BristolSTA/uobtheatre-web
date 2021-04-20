import { mirageGraphQLFieldResolver } from '@miragejs/graphql'
import faker from 'faker'
import { Factory } from 'miragejs'

import {
  authedUser,
  FieldError,
  handleGraphQLOrderBy,
  mutationWithErrorsResolver,
  NonFieldError,
} from './utils'

export default {
  registerFactories() {
    return {
      userNode: Factory.extend({
        firstName: () => faker.name.firstName(),
        lastName: () => faker.name.lastName(),
        email: () => faker.internet.email(),
        password: () => faker.internet.password(),
        token: () => faker.datatype.uuid(),
      }),
    }
  },
  registerGQLCustomResolvers() {
    return {
      UserNode: {
        bookings(obj, args, context, info) {
          // Bodge to overcome weird named params
          if (args.performance) {
            args.performanceId = args.performance
            delete args.performance
          }

          return handleGraphQLOrderBy((args) => {
            return mirageGraphQLFieldResolver(obj, args, context, info)
          }, args)
        },
      },
    }
  },
  registerGQLQueryResolvers() {
    return {
      me(obj, args, context) {
        return authedUser(context)
      },
    }
  },
  registerGQLMutationResolvers() {
    return {
      login: mutationWithErrorsResolver((obj, args, context) => {
        if (!args.email) {
          throw new FieldError('Please supply a valid email address', 'email')
        }
        if (!args.password) {
          throw new FieldError('Please supply a password address', 'password')
        }

        const user = context.mirageSchema.userNodes.findBy({
          email: args.email,
        })

        if (!user) {
          throw new NonFieldError('Unable to log in with provided credentials.')
        }

        return {
          user,
          token: user.token,
          unarchiving: false,
        }
      }),
      register: mutationWithErrorsResolver(
        (obj, args, context, info, addError) => {
          const errors = []
          if (!args.firstName)
            errors.push(
              new FieldError('Please supply a first name', 'firstName')
            )
          if (!args.lastName)
            errors.push(new FieldError('Please supply a last name', 'lastName'))
          if (!args.email)
            errors.push(
              new FieldError('Please supply a valid email address', 'email')
            )
          if (!args.password1)
            errors.push(new FieldError('Please supply a password', 'password1'))
          if (!args.password2)
            errors.push(
              new FieldError('Please confirm your password', 'password2')
            )
          if (args.password1 !== args.password2) {
            errors.push(
              new FieldError(
                'Your confirmed password does not match!',
                'password2'
              )
            )
          }

          if (errors.length) {
            addError(errors)
            return
          }

          context.mirageSchema.userNodes.create({
            email: args.email,
            password: args.password,
            token: faker.datatype.uuid(),
          })

          return null
        }
      ),
      verifyAccount: mutationWithErrorsResolver((obj, args) => {
        if (args.token !== '1234abcd') throw new NonFieldError('Invalid Token')
      }),
      sendPasswordResetEmail: mutationWithErrorsResolver(() => {}),
      updateAccount: mutationWithErrorsResolver(() => {}),
      sendSecondaryEmailActivation: mutationWithErrorsResolver(() => {}),
      swapEmails: mutationWithErrorsResolver(() => {}),
      removeSecondaryEmail: mutationWithErrorsResolver(() => {}),
      verifySecondaryEmail: mutationWithErrorsResolver((obj, args) => {
        if (args.token !== '1234abcd') throw new NonFieldError('Invalid Token')
      }),
      passwordReset: mutationWithErrorsResolver((obj, args) => {
        if (args.token !== '1234abcd')
          throw new NonFieldError('Invalid Password Reset Token')
        if (args.newPassword1 !== args.newPassword2) {
          throw new FieldError(
            'Your confirmed password does not match!',
            'newPassword2'
          )
        }
      }),
      passwordChange: mutationWithErrorsResolver((obj, args) => {
        if (args.newPassword1 !== args.newPassword2)
          throw new FieldError('Passwords dont match', 'newPassword2')
      }),
    }
  },
}

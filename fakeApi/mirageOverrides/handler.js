import { ensureModels } from '@miragejs/graphql/dist/orm/models'
import { adaptRecords } from '@miragejs/graphql/dist/orm/records'
import mirageGraphQLFieldResolver from '@miragejs/graphql/dist/resolvers/mirage'
import {
  ensureExecutableGraphQLSchema,
  unwrapType,
} from '@miragejs/graphql/dist/utils'
import { graphql } from 'graphql'
import { Response } from 'miragejs'

/* eslint-disable */

function getOptionalResolver(info, optionalResolvers) {
  const { fieldName, parentType } = info;

  return (
    optionalResolvers &&
    optionalResolvers[parentType.name] &&
    optionalResolvers[parentType.name][fieldName]
  );
}

/**
 * The field resolver to be used for all GraphQL queries. It delegates to an
 * optional resolver passed into the GraphQL handler or the high-level Mirage
 * resolver.
 *
 * @callback fieldResolver
 * @param {Object} obj
 * @param {Object} args
 * @param {Object} context
 * @param {Object} info
 * @returns {*}
 */

/**
 * A higher order function that accepts a hash of optional resolvers passed into
 * the GraphQL handler and returns a field resolver function to be used for all
 * GraphQL queries.
 *
 * @function createFieldResolver
 * @param {Object} optionalResolvers
 * @return {fieldResolver}
 */
export default function createFieldResolver(optionalResolvers) {
  return function fieldResolver(_obj, _args, _context, info) {
    const optionalResolver = getOptionalResolver(info, optionalResolvers);

    if (optionalResolver) {
      return optionalResolver(...arguments);
    }

    // Resolve Error Unions by default (NOT as a relationship)
    let { isList, type } = unwrapType(info.returnType);
    if (isList && type.name == 'GQLErrorUnion') {
      return _obj[info.fieldName] ? adaptRecords(_obj[info.fieldName]) : null;
    }

    return mirageGraphQLFieldResolver(...arguments);
  };
}

export function createGraphQLHandler(
  graphQLSchema,
  mirageSchema,
  { context = {}, resolvers, root } = {}
) {
  const contextValue = { ...context, mirageSchema };
  const fieldResolver = createFieldResolver(resolvers);

  graphQLSchema = ensureExecutableGraphQLSchema(graphQLSchema);

  ensureModels({ graphQLSchema, mirageSchema });

  return function graphQLHandler(_mirageSchema, request) {
    try {
      const { query, variables } = JSON.parse(request.requestBody);

      return graphql({
        contextValue: { ...contextValue, request },
        fieldResolver,
        rootValue: root,
        schema: graphQLSchema,
        source: query,
        variableValues: variables,
      });
    } catch (ex) {
      return new Response(500, {}, { errors: [ex] });
    }
  };
}

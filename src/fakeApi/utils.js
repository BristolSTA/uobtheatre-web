import { Response } from 'miragejs';

/**
 * Updates a MirageJS model with factoried relationships if another value not already given
 *
 * @param {*} model MirageJS Model
 * @param {object|string} keyValues Key value pairs, where the key is the name of the relationship to populate, and the value is either a static constant or callable function to run
 * @param {?any} value If keyValues is a string, this value is set as the relationship's value
 */
let updateIfDoesntHave = function (model, keyValues, value) {
  // By default, assume keyValues is a dictonary of key value pairs
  if (keyValues instanceof String) {
    keyValues = {
      [keyValues]: value,
    };
  }

  if (keyValues.constructor == Object) {
    keyValues = [keyValues];
  }

  keyValues.forEach((keyValuesSet) => {
    let updateObj = {};
    Object.keys(keyValuesSet).forEach((key) => {
      let shouldGenerateIfCan =
        !model.__dont_factory || !model.__dont_factory.includes(key);
      let attributeIsNotFilled = !model[key] || model[key].length == 0;
      if (shouldGenerateIfCan && attributeIsNotFilled) {
        value = keyValuesSet[key];
        if (typeof value === 'function') value = value();
        updateObj[key] = value;
      }
    });
    model.update(updateObj);
  });
};

/**
 * A Django Rest Framework equivilent of a validation error response, used to send a validation error response via MirageJS
 *
 * @param {object} fieldErrors Set of field errors (i.e. for a specific field)
 * @param {Array<string>} nonFieldErrors List of non-field errors as strings
 * @param {?number} errorCode HTTP Error code to send with response. Defaults to 400
 * @returns {Response} MirageJS Reponse Object
 */
let ValidationErrorResponse = (
  fieldErrors,
  nonFieldErrors,
  errorCode = 400
) => {
  let data = {};
  if (fieldErrors) {
    data['field_errors'] = fieldErrors;
  }
  if (nonFieldErrors) {
    data['non_field_errors'] = nonFieldErrors;
  }
  return new Response(errorCode, {}, data);
};

/**
 * Performs a graphene-like order by on a set of records from a GraphQL query
 *
 * @param {any} records Records as returned from the mirageGraphQLFieldResolver
 * @param {object} args Args parameter from the GraphQL query
 * @returns {?Array} Sorted records
 */
let graphQLOrderBy = (records, args) => {
  const { orderBy } = args;

  if (orderBy) {
    const orderByProp = orderBy.substring(1);
    const orderType = orderBy.charAt(0);
    records.edges.sort((edge1, edge2) => {
      if (edge1.node[orderByProp] < edge2.node[orderByProp])
        return orderType == '-' ? 1 : -1;
      if (edge1.node[orderByProp] > edge2.node[orderByProp])
        return orderType == '-' ? -1 : 1;
      return 0;
    });
  }
  return records;
};

/**
 * Generates ConcessionTypeBookingType instances for use as part of a performance's ticket options relationship
 *
 * @param {Array} concessionTypes Array of MirageJS Concession Type nodes
 * @param {any} server MirageJS Server Instance
 * @param {?Array<object>} overrides An array of overrides for the ConcessionTypeBookingType, where by the object at each index will be merged into the options for the concessionType at that index
 * @returns {Array} Array of ConcessionTypeBookingType instances, ready to be inserted as ticketOptions
 */
let generateConcessionTypeBookingTypes = (
  concessionTypes,
  server,
  overrides = []
) => {
  return concessionTypes.map((concessionType, index) => {
    return server.create(
      'ConcessionTypeBookingType',
      Object.assign(
        {},
        {
          concessionType: concessionType,
        },
        overrides.length ? overrides[index] : null
      )
    );
  });
};

/**
 * Attempts to find the matching user based on GraphQL request authorization headers
 *
 * @param {any} context MirageJS / GraphQL Context Object
 * @returns {?object} The MirageJS User Node model or null if not found
 */
let authedUser = (context) => {
  let authToken =
    context.request.requestHeaders.authorization &&
    context.request.requestHeaders.authorization.match(/Token (.+)$/)[1];

  if (!authToken) return null;

  return context.mirageSchema.userNodes.findBy({ token: authToken });
};

let NonFieldError = class extends Error {
  constructor(message, code) {
    super(message);
    this.message = message;
    this.code = code;
  }
};
let FieldError = class extends Error {
  constructor(message, field, code) {
    super(message);
    this.message = message;
    this.field = field;
    this.code = code;
  }
};

let mutationWithErrorsResolver = (resolver) => {
  return (obj, args, context, info) => {
    let res = {
      success: true,
      errors: [],
    };

    let addError = (err) => {
      res.success = false;

      if (err instanceof NonFieldError) {
        res.errors.push(
          context.mirageSchema.create('NonFieldError', {
            message: err.message,
            code: err.code,
          })
        );
      } else if (err instanceof FieldError) {
        res.errors.push(
          context.mirageSchema.create('FieldError', {
            message: err.message,
            field: err.field,
            code: err.code,
          })
        );
      }
    };

    try {
      return Object.assign(res, resolver(obj, args, context, info, addError));
    } catch (err) {
      if (err instanceof NonFieldError || err instanceof FieldError) {
        addError(err);
      } else {
        throw err;
      }
      return res;
    }
  };
};

export {
  authedUser,
  FieldError,
  generateConcessionTypeBookingTypes,
  graphQLOrderBy,
  mutationWithErrorsResolver,
  NonFieldError,
  updateIfDoesntHave,
  ValidationErrorResponse,
};

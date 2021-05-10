/**
 * Updates a MirageJS model with factoried relationships if another value not already given
 *
 * @param {*} model MirageJS Model
 * @param {object|string} keyValues Key value pairs, where the key is the name of the relationship to populate, and the value is either a static constant or callable function to run
 * @param {?any} value If keyValues is a string, this value is set as the relationship's value
 */
const updateIfDoesntHave = function (model, keyValues, value) {
  // By default, assume keyValues is a dictonary of key value pairs
  if (keyValues instanceof String) {
    keyValues = {
      [keyValues]: value,
    }
  }

  if (keyValues.constructor === Object) {
    keyValues = [keyValues]
  }

  keyValues.forEach((keyValuesSet) => {
    const updateObj = {}
    Object.keys(keyValuesSet).forEach((key) => {
      const shouldGenerateIfCan =
        !model.__dont_factory || !model.__dont_factory.includes(key)
      const attributeIsNotFilled = !model[key] || model[key].length === 0
      if (shouldGenerateIfCan && attributeIsNotFilled) {
        value = keyValuesSet[key]
        if (typeof value === 'function') value = value()
        updateObj[key] = value
      }
    })
    model.update(updateObj)
  })
}

/**
 * Performs a graphene-like order by on a set of records from a GraphQL query
 *
 * @param {any} getRecordsFunction Function that returns records from the mirageGraphQLFieldResolver. Is supplied with the args
 * @param {object} args Args parameter from the GraphQL query
 * @returns {?Array} Sorted records
 */
const handleGraphQLOrderBy = (getRecordsFunction, args) => {
  const { orderBy } = args
  delete args.orderBy

  const records = getRecordsFunction(args)

  if (orderBy) {
    const orderByProp = orderBy.substring(1)
    const orderType = orderBy.charAt(0)
    records.edges.sort((edge1, edge2) => {
      if (edge1.node[orderByProp] < edge2.node[orderByProp])
        return orderType === '-' ? 1 : -1
      if (edge1.node[orderByProp] > edge2.node[orderByProp])
        return orderType === '-' ? -1 : 1
      return 0
    })
  }
  return records
}

/**
 * Generates ConcessionTypeBookingType instances for use as part of a performance's ticket options relationship
 *
 * @param {Array} concessionTypes Array of MirageJS Concession Type nodes
 * @param {any} server MirageJS Server Instance
 * @param {?Array<object>} overrides An array of overrides for the ConcessionTypeBookingType, where by the object at each index will be merged into the options for the concessionType at that index
 * @returns {Array} Array of ConcessionTypeBookingType instances, ready to be inserted as ticketOptions
 */
const generateConcessionTypeBookingTypes = (
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
          concessionType,
        },
        overrides.length ? overrides[index] : null
      )
    )
  })
}

/**
 * Attempts to find the matching user based on GraphQL request authorization headers
 *
 * @param {any} context MirageJS / GraphQL Context Object
 * @returns {?object} The MirageJS User Node model or null if not found
 */
const authedUser = (context) => {
  const authToken =
    context.request.requestHeaders.authorization &&
    context.request.requestHeaders.authorization.match(/JWT (.+)$/)[1]

  if (!authToken) return null

  return context.mirageSchema.userNodes.findBy({ token: authToken })
}

const NonFieldError = class extends Error {
  constructor(message, code) {
    super(message)
    this.message = message
    this.code = code
  }
}
const FieldError = class extends Error {
  constructor(message, field, code) {
    super(message)
    this.message = message
    this.field = field
    this.code = code
  }
}

const mutationWithErrorsResolver = (resolver) => {
  return (obj, args, context, info) => {
    const res = {
      success: true,
      errors: [],
    }

    const addError = (errs) => {
      if (!Array.isArray(errs)) errs = [errs]

      res.success = false

      errs.forEach((err) => {
        if (err instanceof NonFieldError) {
          res.errors.push(
            context.mirageSchema.create('NonFieldError', {
              message: err.message,
              code: err.code,
            })
          )
        } else if (err instanceof FieldError) {
          res.errors.push(
            context.mirageSchema.create('FieldError', {
              message: err.message,
              field: err.field,
              code: err.code,
            })
          )
        }
      })
    }

    try {
      return Object.assign(res, resolver(obj, args, context, info, addError))
    } catch (err) {
      if (err instanceof NonFieldError || err instanceof FieldError) {
        addError(err)
      } else {
        throw err
      }
      return res
    }
  }
}

export {
  authedUser,
  FieldError,
  generateConcessionTypeBookingTypes,
  handleGraphQLOrderBy,
  mutationWithErrorsResolver,
  NonFieldError,
  updateIfDoesntHave,
}

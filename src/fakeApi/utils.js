import { Response, Serializer } from 'miragejs';

let paginatedResponse = (data) => {
  return {
    count: 2,
    next: null,
    previous: null,
    results: data.models ? data.models : data,
  };
};

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

let RelationshipSerializer = (relationships) =>
  DefaultSerializer.extend({
    include:
      relationships === true
        ? function () {
            return this.primaryResource
              ? Object.keys(this.primaryResource.associations)
              : [];
          }
        : relationships,
  });

let DefaultSerializer = Serializer.extend({
  embed: true,
  root: false,
});

let NotFoundResponse = () => {
  return new Response(404);
};

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

export {
  DefaultSerializer,
  generateConcessionTypeBookingTypes,
  graphQLOrderBy,
  NotFoundResponse,
  paginatedResponse,
  RelationshipSerializer,
  updateIfDoesntHave,
  ValidationErrorResponse,
};

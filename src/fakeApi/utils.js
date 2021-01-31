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
  let updateObj = {};
  Object.keys(keyValues).forEach((key) => {
    let shouldGenerateIfCan =
      !model.__dont_factory || !model.__dont_factory.includes(key);
    let attributeIsNotFilled = !model[key] || model[key].length == 0;
    if (shouldGenerateIfCan && attributeIsNotFilled) {
      value = keyValues[key];
      if (typeof value === 'function') value = value();
      updateObj[key] = value;
    }
  });
  model.update(updateObj);
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

export {
  DefaultSerializer,
  NotFoundResponse,
  paginatedResponse,
  RelationshipSerializer,
  updateIfDoesntHave,
  ValidationErrorResponse,
};

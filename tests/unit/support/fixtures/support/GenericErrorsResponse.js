import GenericMutationResponse from './GenericMutationResponse';

export default (errors = [], overrides = {}) => {
  return Object.assign(
    GenericMutationResponse(),
    {
      success: false,
      errors: Array.isArray(errors) ? errors : [errors]
    },
    overrides
  );
};

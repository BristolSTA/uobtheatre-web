export default (message = 'An error message', field = null, overrides = {}) => {
  const baseObj = {
    __typename: field ? 'FieldError' : 'NonFieldError',
    message,
    field,
    code: 123,
  }
  return Object.assign(baseObj, overrides)
}

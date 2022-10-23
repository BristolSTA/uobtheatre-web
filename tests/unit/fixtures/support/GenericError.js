export default (
  message = 'An error message',
  field = null,
  overrides = {},
  code
) => {
  const baseObj = {
    __typename: field ? 'FieldError' : 'NonFieldError',
    message,
    field,
    code
  }
  return Object.assign(baseObj, overrides)
}

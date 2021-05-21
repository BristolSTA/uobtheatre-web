export default (overrides = {}) => {
  return Object.assign(
    {
      success: true,
      errors: null,
    },
    overrides
  )
}

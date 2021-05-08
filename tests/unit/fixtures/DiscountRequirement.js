export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      number: 2,
      discount: null,
      concessionType: null, // TODO
    },
    overrides
  )
}

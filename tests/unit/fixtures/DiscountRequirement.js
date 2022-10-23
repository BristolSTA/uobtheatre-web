import ConcessionType from './ConcessionType'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      number: 1,
      discount: null,
      concessionType: ConcessionType()
    },
    overrides
  )
}

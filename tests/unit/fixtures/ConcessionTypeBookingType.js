import ConcessionType from './ConcessionType'

export default (overrides = {}) => {
  return Object.assign(
    {
      concessionType: ConcessionType(),
      price: 1000,
      pricePounds: '10.00',
    },
    overrides
  )
}

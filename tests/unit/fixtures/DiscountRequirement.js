import ConcessionType from './ConcessionType'
import Discount from './Discount'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      number: 2,
      discount: Discount(),
      concessionType: ConcessionType(),
    },
    overrides
  )
}

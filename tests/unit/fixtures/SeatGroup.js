import GenericNodeConnection from './support/GenericNodeConnection'
import Venue from './Venue'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Best Seats in the House',
      description: 'They really are the best',
      venue: Venue(),
      capacity: 100,
      seats: null,
      isInternal: false,
      tickets: GenericNodeConnection(),
    },
    overrides
  )
}

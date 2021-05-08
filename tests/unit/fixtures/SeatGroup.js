import GenericNodeConnection from './support/GenericNodeConnection'
import Venue from './Venue'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Best seats in the house',
      description: 'The best seats obviously',
      venue: Venue(),
      capacity: 100,
      seats: null,
      isInternal: false,
      tickets: GenericNodeConnection(),
    },
    overrides
  )
}

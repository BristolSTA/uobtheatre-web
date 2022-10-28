import GenericNodeConnection from './support/GenericNodeConnection';
import Venue from './Venue';

export default (
  overrides = {},
  includeVenue = false,
  includeTickets = false
) => {
  return Object.assign(
    {
      id: 1,
      name: 'Best seats in the house',
      description: 'The best seats obviously',
      venue: includeVenue ? Venue() : null,
      capacity: 100,
      seats: null,
      isInternal: false,
      tickets: includeTickets ? GenericNodeConnection() : null,
    },
    overrides
  );
};

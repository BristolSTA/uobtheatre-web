import CastMember from './CastMember';
import CrewMember from './CrewMember';
import Performance from './Performance';
import ProductionTeamMember from './ProductionTeamMember';
import Society from './Society';
import GenericNodeConnection from './support/GenericNodeConnection';
import Venue from './Venue';

export default (overrides = {}, includePerformance = false) => {
  return Object.assign(
    {
      createdAt: '2020-05-08T14:00:00.000',
      updatedAt: '2020-05-08T14:00:00.000',
      id: 1,
      name: 'Legally Ginger',
      status: 'PUBLISHED',
      subtitle: 'A twist on a classic',
      slug: 'legally-ginger',
      ageRating: 18,
      facebookEvent: 'https://facebook.com/legally-ginger',
      description: 'The description of the show.',
      start: '2020-11-14T00:00:00.000',
      end: '2020-11-18T00:00:00.000',
      minSeatPrice: 120,
      isBookable: true,
      coverImage: {
        url: 'http://pathto.example/cover-image.png'
      },
      posterImage: {
        url: 'http://pathto.example/poster-image.png'
      },
      featuredImage: {
        url: 'http://pathto.example/featured-image.png'
      },
      cast: [CastMember()],
      crew: [CrewMember()],
      venues: [Venue({}, undefined, false)],
      productionTeam: [ProductionTeamMember()],
      society: Society(),
      contentWarnings: [
        { warning: { shortDescription: 'Strobe Lighting' } },
        { warning: { shortDescription: 'Nudity' } }
      ],
      productionAlert: 'This is a production alert.',
      performances: includePerformance
        ? GenericNodeConnection([Performance()])
        : GenericNodeConnection()
    },
    overrides
  );
};

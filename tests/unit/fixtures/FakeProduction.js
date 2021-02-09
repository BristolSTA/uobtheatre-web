import { DateTime } from 'luxon';

export default (server) => {
  return {
    name: 'Legally Ginger',
    subtitle: 'legally-ginger',
    description: 'The description of the show.',
    society: server.create('societyNode', {
      name: 'Joe Bloggs Productions',
      logo: server.create('GrapheneImageFieldNode', {
        url: 'http://pathto.example/logo-image.png',
      }),
      slug: 'joe-bloggs-productions',
    }),
    posterImage: server.create('GrapheneImageFieldNode', {
      url: 'http://pathto.example/poster-image.png',
    }),
    featuredImage: server.create('GrapheneImageFieldNode', {
      url: 'http://pathto.example/featured-image.png',
    }),
    coverImage: null,
    ageRating: 18,
    facebookEvent: 'https://facebook.com/legally-ginger',
    slug: 'trash',
    start: DateTime.fromISO('2020-11-14T00:00:00.000+00:00'),
    end: DateTime.fromISO('2020-11-18T00:00:00.000+00:00'),
    minSeatPrice: 424,
    isBookable: true,
    warnings: [
      server.create('warningNode', { warning: 'Strobe Lighting' }),
      server.create('warningNode', { warning: 'Nudity' }),
    ],
    performances: [
      server.create('performanceNode', {
        venue: server.create('venueNode', {
          name: 'Winston Theatre',
          slug: 'winston-theatre',
        }),
        doorsOpen: null,
        start: DateTime.fromISO('2021-01-14T17:55:27.554+00:00'),
        end: DateTime.fromISO('2021-01-14T20:55:27.554+00:00'),
        durationMins: 180,
        isOnline: true,
        isInperson: false,
      }),
    ],
    crew: [
      server.create('crewMemberNode', {
        name: 'Tom',
        role: server.create('crewRoleNode', { department: 'Sound' }),
      }),
      server.create('crewMemberNode', {
        name: 'Millie',
        role: server.create('crewRoleNode', { department: 'Lighting' }),
      }),
    ],
    cast: [
      server.create('castMemberNode', {
        name: 'Alex T',
        role: 'Good Guy',
        profilePicture: null,
        __dont_factory: ['profilePicture'],
      }),
      server.create('castMemberNode', {
        name: 'Kit',
        role: 'Crazy person',
        profilePicture: server.create('GrapheneImageFieldNode', {
          url: 'http://pathto.example/profile-pic.png',
        }),
      }),
    ],
    productionTeam: [
      server.create('productionTeamMemberNode', {
        name: 'James',
        role: 'Producer',
      }),
      server.create('productionTeamMemberNode', {
        name: 'Nicole',
        role: 'Musical Director',
      }),
    ],
  };
};

export default () => {
  return {
    name: 'Legally Ginger',
    subtitle: 'legally-ginger',
    description: 'The description of the show.',
    society: {
      name: 'Joe Bloggs Productions',
      logo: {
        url: 'http://pathto.example/logo-image.png',
      },
      slug: 'joe-bloggs-productions',
    },
    posterImage: {
      url: 'http://pathto.example/poster-image.png',
    },
    featuredImage: {
      url: 'http://pathto.example/featured-image.png',
    },
    coverImage: null,
    ageRating: 18,
    facebookEvent: 'https://facebook.com/legally-ginger',
    slug: 'trash',
    start: '2020-11-14T00:00:00.000+00:00',
    end: '2020-11-18T00:00:00.000+00:00',
    minSeatPrice: 424,
    warnings: [{ warning: 'Strobe Lighting' }, { warning: 'Nudity' }],
    performances: {
      edges: [
        {
          node: {
            venue: {
              name: 'Winston Theatre',
              slug: 'winston-theatre',
            },
            doorsOpen: null,
            start: '2021-01-14T17:55:27.554+00:00',
            end: '2021-01-14T20:55:27.554+00:00',
            durationMins: 180,
            isOnline: true,
            isInperson: false,
          },
        },
      ],
    },
    crew: [
      {
        name: 'Tom',
        role: { department: 'Sound' },
      },
      {
        name: 'Millie',
        role: { department: 'Lighting' },
      },
    ],
    cast: [
      {
        name: 'Alex T',
        role: 'Good Guy',
        profilePicture: null,
      },
      {
        name: 'Kit',
        role: 'Crazy person',
        profilePicture: {
          url: 'http://pathto.example/profile-pic.png',
        },
      },
    ],
    productionTeam: [
      {
        name: 'James',
        role: 'Producer',
      },
      {
        name: 'Nicole',
        role: 'Musical Director',
      },
    ],
  };
};

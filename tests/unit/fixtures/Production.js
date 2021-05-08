import CastMember from './CastMember'
import CrewMember from './CrewMember'
import Performance from './Peformance'
import GenericNodeConnection from './support/GenericNodeConnection'

export default (overrides = {}) => {
  return Object.assign(
    {
      createdAt: '2020-05-08T14:00:00.000',
      updatedAt: '2020-05-08T14:00:00.000',
      id: 1,
      name: 'Legally Ginger',
      subtitle: 'A twist on a classic',
      slug: 'legally-ginger',
      ageRating: 18,
      facebookEvent: 'https://facebook.com',
      description: 'The description of the show.',
      start: '2020-11-14T00:00:00.000',
      end: '2020-11-18T00:00:00.000',
      minSeatPrice: 120,
      isBookable: true,
      coverImage: {
        url: 'https://via.placeholder.com/1800x1000',
      },
      posterImage: {
        url: 'https://via.placeholder.com/400x566',
      },
      featuredImage: {
        url: 'https://via.placeholder.com/1920x960',
      },
      cast: [CrewMember()],
      crew: [CastMember()],
      productionTeam: [ProductionTeam()],
      society: Society(),
      warnings: [Warnings()],
      performances: GenericNodeConnection([Performance()]),
    },
    overrides
  )
}

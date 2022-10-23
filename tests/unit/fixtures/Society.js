import Production from './Production'
import GenericNodeConnection from './support/GenericNodeConnection'

export default (overrides = {}, includeProductions = false) => {
  return Object.assign(
    {
      id: 1,
      createdAt: '2021-05-08T14:00:00.000',
      updatedAt: '2021-05-08T16:00:00.000',
      name: 'STA',
      description: 'We do it in the dark',
      logo: {
        url: 'http://pathto.example/logo-image.png'
      },
      banner: {
        url: 'http://pathto.example/society-banner.png'
      },
      slug: 'sta',
      productions: includeProductions
        ? GenericNodeConnection([Production()])
        : GenericNodeConnection()
    },
    overrides
  )
}

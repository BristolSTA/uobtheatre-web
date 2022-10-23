import GenericConnection from './support/GenericNodeConnection'
export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'CLX',
      department: {
        value: 'LIGHTING',
        description: 'Lighting'
      },
      crewMembers: GenericConnection()
    },
    overrides
  )
}

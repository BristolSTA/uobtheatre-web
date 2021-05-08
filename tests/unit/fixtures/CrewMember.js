import CrewRole from './CrewRoleNode'
export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Jill Bloggs',
      role: CrewRole(),
      production: null, // TODO: Production model
    },
    overrides
  )
}

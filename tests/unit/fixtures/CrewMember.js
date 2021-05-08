import CrewRole from './CrewRole'
import Production from './Production'
export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Jill Bloggs',
      role: CrewRole(),
      production: Production,
    },
    overrides
  )
}

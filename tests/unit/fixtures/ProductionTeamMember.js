import Production from './Production'

export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      name: 'Alexis Toof',
      role: 'Producer',
      production: Production(),
    },
    overrides
  )
}

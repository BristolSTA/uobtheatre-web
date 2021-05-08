import address from './Address'

export default (overrides) => {
  return Object.assign(
    {
      address: address(),
    },
    overrides
  )
}

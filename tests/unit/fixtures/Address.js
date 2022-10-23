export default (overrides = {}) => {
  return Object.assign(
    {
      id: 1,
      buildingName: 'Wills Memorial Building',
      street: 'Queens Road',
      buildingNumber: '69',
      city: 'London',
      postcode: 'BS69 420',
      latitude: '123.4567',
      longitude: '987.654'
    },
    overrides
  )
}
